// src/pages/Services.jsx
import React, { useState } from 'react'; // Import de useState ajouté
import { motion } from 'framer-motion';
import { 
  Users, 
  HandHeart, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  Gem,
  ArrowRight,
  LifeBuoy,
  CheckCircle2 // Import ajouté pour le pricing
} from 'lucide-react';

// Imports pour le paiement
import { getFunctions, httpsCallable } from 'firebase/functions';
import PaymentModal from '../components/PaymentModal'; 

const Services = () => {
  // États pour gérer le modal de paiement
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);

  const allServices = [
    {
      title: "Prévoyance Collective",
      desc: "Un système de cotisation mutualisé qui garantit une protection financière solide pour chaque membre en cas de sinistre.",
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
      features: ["Fonds de secours garanti", "Transparence des comptes", "Audit régulier"]
    },
    {
      title: "Soutien Logistique",
      desc: "Nous ne donnons pas seulement de l'argent. Nous vous accompagnons dans l'organisation pratique des obsèques.",
      icon: <LifeBuoy className="w-8 h-8 text-emerald-600" />,
      features: ["Conseil funéraire", "Aide administrative", "Réseau de partenaires"]
    },
    {
      title: "Assistance Psychologique",
      desc: "Le deuil est une épreuve humaine. La MUCOD offre des séances d'écoute pour aider les familles à traverser le choc.",
      icon: <HandHeart className="w-8 h-8 text-rose-600" />,
      features: ["Cellule d'écoute", "Groupes de parole", "Suivi personnalisé"]
    },
    {
      title: "Digitalisation & Rapidité",
      desc: "Grâce à notre plateforme, les demandes d'aide sont traitées en moins de 48h après validation des documents.",
      icon: <Clock className="w-8 h-8 text-amber-600" />,
      features: ["Déclaration en ligne", "Paiement mobile", "Suivi en temps réel"]
    }
  ];

  // Fonction pour ouvrir le modal avec le bon montant
  const openPayment = (amount) => {
    setSelectedAmount(amount);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* --- SECTION TITRE --- */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 mb-6"
          >
            Nos Services & <span className="text-blue-600">Engagements</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 leading-relaxed"
          >
            Parce que la solidarité ne doit pas être un vain mot, nous avons conçu des services 
            réels, rapides et humains pour vous soutenir quand vous en avez le plus besoin.
          </motion.p>
        </div>
      </section>

      {/* --- GRID DES SERVICES --- */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {allServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="shrink-0">
                  <div className="p-5 bg-slate-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                    {service.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-6 italic">
                    {service.desc}
                  </p>
                  <ul className="grid grid-cols-1 gap-3">
                    {service.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- NOUVELLE SECTION : GRILLE DE PAIEMENT / ABONNEMENT --- */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Adhésion & Cotisations</h2>
          <p className="text-slate-500">Sélectionnez votre plan pour activer votre couverture immédiatement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Membre Individuel", price: 5000, desc: "Pour une personne seule" },
            { name: "Couple", price: 8000, desc: "Protection pour vous et votre conjoint" },
            { name: "Famille Plus", price: 15000, desc: "Couverture complète (enfants inclus)" }
          ].map((plan, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white border-2 border-slate-100 p-8 rounded-[3rem] shadow-sm hover:border-blue-500 transition-all flex flex-col"
            >
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-slate-400 text-sm mb-6">{plan.desc}</p>
              
              <div className="text-4xl font-black text-slate-900 mb-8">
                {plan.price.toLocaleString()} <span className="text-sm font-bold text-slate-400">FCFA</span>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 size={18} className="text-emerald-500" /> Prise en charge 100%
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 size={18} className="text-emerald-500" /> Accès à la cellule psychologique
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 size={18} className="text-emerald-500" /> Assistance 24h/7
                </li>
              </ul>

              <button 
                onClick={() => openPayment(plan.price)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all flex justify-center items-center gap-2"
              >
                Adhérer maintenant
                <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- PRICING PREVIEW (Original) --- */}
      <section className="max-w-5xl mx-auto px-6 pb-32">
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6 text-white">Prêt à sécuriser l'avenir ?</h2>
            <p className="text-slate-400 mb-10 max-w-xl mx-auto italic">
              L'adhésion à la MUCOD est ouverte à tous, avec des cotisations adaptées à chaque profil familial.
            </p>
            <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
              Consulter les tarifs
              <ArrowRight size={20} />
            </button>
          </div>
          {/* Décoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
        </div>
      </section>

      {/* --- MODAL DE PAIEMENT --- */}
      <PaymentModal 
        isOpen={isModalOpen}
        amount={selectedAmount}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          // Optionnel : Rediriger ou afficher un message de succès global
        }}
      />
    </div>
  );
};

export default Services;