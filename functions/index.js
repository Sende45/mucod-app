// functions/index.js
const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https"); // MODIF : Ajout de HttpsError
const { setGlobalOptions } = require("firebase-functions/v2");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * On force la région sur us-central1
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
  // MODIFICATION : Devise par défaut réglée sur "xof" (FCFA)
  const { amount, currency = "xof" } = request.data;
  
  if (!request.auth) {
    // MODIF : Utilisation de HttpsError pour éviter l'erreur INTERNAL floue
    throw new HttpsError("unauthenticated", "L'utilisateur doit être connecté.");
  }

  // MODIF : On vérifie que le secret est bien chargé avant d'initialiser Stripe
  const secretValue = stripeSecret.value();
  if (!secretValue) {
    throw new HttpsError("internal", "Le secret STRIPE_SECRET est introuvable.");
  }

  const stripe = require("stripe")(secretValue);

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
    // MODIF : On renvoie l'erreur spécifique de Stripe au frontend
    throw new HttpsError("internal", error.message);
  }
});

exports.stripeWebhook = onRequest({ secrets: [stripeWebhook, stripeSecret] }, async (req, res) => {
  const stripe = require("stripe")(stripeSecret.value());
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Note : req.rawBody est indispensable pour la validation Stripe
    event = stripe.webhooks.constructEvent(req.rawBody, sig, stripeWebhook.value());
  } catch (err) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const userId = paymentIntent.metadata.userId;
    
    // Stripe travaille en centimes, mais le FCFA n'a pas de décimales.
    // Pour le XOF, 1000 dans Stripe = 1000 FCFA.
    const amountPaid = paymentIntent.amount; 

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