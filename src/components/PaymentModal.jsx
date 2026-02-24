import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { X, ShieldCheck } from 'lucide-react';

// Remplace par ta clé publique Stripe (pk_test_...)
const stripePromise = loadStripe('pk_test_51T17ReIImwaKuwtjOtgouWGzsbeCpiIiWHL98WKatEkUTdrr2K10dQcLVCJ2YvB1iX0qqlV9xRnhTXHUigx52wvO00g9jmgu4J');

const CheckoutForm = ({ amount, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      // 1. Appeler la Cloud Function pour créer l'intention de paiement
      const createPayment = httpsCallable(functions, 'createStripePayment');
      const { data } = await createPayment({ amount: amount });

      // 2. Confirmer le paiement avec la carte saisie
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      });

      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        alert("Paiement de " + amount + " FCFA réussi !");
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la transaction.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Détails de la carte</label>
        <CardElement options={{
          style: {
            base: { fontSize: '16px', color: '#1e293b', '::placeholder': { color: '#94a3b8' } },
          }
        }} />
      </div>

      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-slate-900 transition-all disabled:opacity-50"
      >
        {isProcessing ? "Traitement..." : `Régler ${amount.toLocaleString()} FCFA`}
      </button>
      
      <p className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
        <ShieldCheck size={14} /> Paiement sécurisé par Stripe
      </p>
    </form>
  );
};

// COMPOSANT PRINCIPAL À EXPORTER
const PaymentModal = ({ amount, isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
        
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black text-slate-900">Cotisation</h2>
          <p className="text-slate-500 text-sm font-medium">Régularisation de votre situation</p>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm amount={amount} onSuccess={onSuccess} onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentModal;