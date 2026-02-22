// src/pages/Solidarite.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users2, 
  Handshake, 
  Quote, 
  Target, 
  Globe2,
  Sparkles
} from 'lucide-react';

const Solidarite = () => {
  const valeurs = [
    {
      title: "Transparence Totale",
      desc: "Chaque franc cotisé est tracé. Nos membres reçoivent un rapport mensuel sur l'état du fonds de solidarité.",
      icon: <Target className="w-6 h-6 text-indigo-600" />
    },
    {
      title: "Réactivité Humaine",
      desc: "Parce que le deuil n'attend pas, nos bénévoles et délégués sont mobilisables 24h/24 pour assister les familles.",
      icon: <Sparkles className="w-6 h-6 text-blue-600" />
    },
    {
      title: "Inclusion Sociale",
      desc: "Aucune distinction de rang social. La solidarité MUCOD s'applique avec la même dignité pour tous nos adhérents.",
      icon: <Globe2 className="w-6 h-6 text-emerald-600" />
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 skew-x-12 translate-x-20" />
        </div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <Heart size={14} fill="currentColor" />
              L'humain au cœur
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight">
              La force du <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">collectif.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-8 max-w-lg italic">
              "Personne n'est assez fort pour porter seul le poids de la perte, mais ensemble, nous sommes invincibles."
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-square bg-linear-to-br from-blue-100 to-indigo-50 rounded-[4rem] flex items-center justify-center p-12">
              <Users2 className="w-full h-full text-blue-600/20" strokeWidth={1} />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-blue-900/10 max-w-xs rotate-3 hover:rotate-0 transition-transform cursor-default">
                    <Quote className="text-blue-600 mb-4" size={32} />
                    <p className="text-slate-700 font-medium text-lg leading-snug">
                      Grâce à la MUCOD, j'ai pu enterrer mon mari avec dignité sans m'endetter. La solidarité a été immédiate.
                    </p>
                    <div className="mt-6 border-t pt-4 border-slate-100 font-bold text-sm text-slate-400">
                      — Témoignage d'une adhérente
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- NOS VALEURS --- */}
      <section className="py-24 bg-slate-900 text-white rounded-[4rem] mx-4 md:mx-10 my-10 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Nos piliers de fraternité</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              La solidarité n'est pas qu'un mot, c'est une organisation rigoureuse basée sur trois principes fondamentaux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {valeurs.map((valeur, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:border-blue-500 transition-all"
              >
                <div className="mb-6 p-4 bg-slate-700 rounded-2xl w-fit group-hover:bg-blue-600 transition-colors">
                  {valeur.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{valeur.title}</h3>
                <p className="text-slate-400 leading-relaxed italic">
                  {valeur.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS D'IMPACT --- */}
      <section className="py-24 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-block p-4 bg-blue-50 rounded-2xl mb-8">
           <Handshake size={40} className="text-blue-600" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-12">La MUCOD en chiffres</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Membres", value: "10k+" },
            { label: "Familles aidées", value: "450+" },
            { label: "Villes couvertes", value: "25" },
            { label: "Note de confiance", value: "4.9/5" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-2 border-l-2 border-slate-100 pl-6 text-left">
              <span className="text-4xl font-black text-blue-600">{stat.value}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Solidarite;