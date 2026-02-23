// functions/index.js
const { onCall, onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2"); // Ajouté pour la région
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * On force la région sur us-central1 (ou europe-west1 si tu veux changer) 
 * et on s'assure que les fonctions utilisent Node 24
 */
setGlobalOptions({ 
    region: "us-central1",
    maxInstances: 10 
});

// Définition des secrets
const stripeSecret = defineSecret("STRIPE_SECRET");
const stripeWebhook = defineSecret("STRIPE_WEBHOOK");

exports.createStripePayment = onCall({ secrets: [stripeSecret] }, async (request) => {
  // Dans la v2, les données sont dans request.data et l'auth dans request.auth
  const { amount, currency = "eur" } = request.data;
  
  if (!request.auth) {
    throw new Error("unauthenticated");
  }

  const stripe = require("stripe")(stripeSecret.value());

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      metadata: { 
        userId: request.auth.uid,
        product_id: "prod_U1mXDP013bHyYJ",
        type: "Cotisation MUCOD"
      }
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error("Erreur Stripe:", error);
    throw new Error(error.message);
  }
});

exports.stripeWebhook = onRequest({ secrets: [stripeWebhook, stripeSecret] }, async (req, res) => {
  const stripe = require("stripe")(stripeSecret.value());
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Note : req.rawBody est requis pour valider la signature Stripe
    event = stripe.webhooks.constructEvent(req.rawBody, sig, stripeWebhook.value());
  } catch (err) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const userId = paymentIntent.metadata.userId;
    const amountPaid = paymentIntent.amount / 100;

    const userRef = admin.firestore().collection("users").doc(userId);
    
    try {
      await userRef.update({
        totalCotise: admin.firestore.FieldValue.increment(amountPaid),
        status: "À jour",
        lastPaymentDate: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Paiement validé pour l'utilisateur : ${userId}`);
    } catch (dbError) {
      console.error("Erreur Firestore mise à jour:", dbError);
    }
  }

  res.json({ received: true });
});