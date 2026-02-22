// src/pages/Contact.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Clock, 
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      title: "Appelez-nous",
      desc: "Notre équipe est disponible pour les urgences.",
      detail: "+225 07 00 00 00 00",
      icon: <Phone className="text-blue-600" size={24} />,
      color: "bg-blue-50"
    },
    {
      title: "Écrivez-nous",
      desc: "Pour vos dossiers administratifs.",
      detail: "contact@mucod-mutuelle.ci",
      icon: <Mail className="text-emerald-600" size={24} />,
      color: "bg-emerald-50"
    },
    {
      title: "Visitez-nous",
      desc: "Nos bureaux vous accueillent.",
      detail: "Abidjan, Cocody Riviera 3",
      icon: <MapPin className="text-rose-600" size={24} />,
      color: "bg-rose-50"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* --- HEADER --- */}
      <section className="bg-white pt-16 pb-24 px-6 border-b border-slate-100">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 mb-6"
          >
            Nous sommes <span className="text-blue-600">à votre écoute</span>
          </motion.h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto italic">
            Une question sur votre adhésion ou un besoin d'assistance immédiat ? 
            Nos conseillers vous accompagnent avec bienveillance.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* --- COLONNE INFOS --- */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-blue-200 transition-all"
              >
                <div className={`w-14 h-14 ${info.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{info.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{info.desc}</p>
                <p className="text-slate-900 font-bold tracking-tight">{info.detail}</p>
              </motion.div>
            ))}

            <div className="bg-slate-900 p-8 rounded-[2rem] text-white overflow-hidden relative">
              <Clock className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32" />
              <h3 className="text-xl font-bold mb-4 relative z-10">Horaires de permanence</h3>
              <div className="space-y-3 relative z-10 text-slate-400 text-sm font-medium">
                <div className="flex justify-between"><span>Lundi - Vendredi</span><span className="text-white">08h - 18h</span></div>
                <div className="flex justify-between"><span>Samedi</span><span className="text-white">09h - 13h</span></div>
                <div className="flex justify-between text-blue-400 font-bold uppercase tracking-wider pt-2">
                  <span>Urgence décès</span><span>24h/24</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- FORMULAIRE --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <MessageSquare size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Envoyez-nous un message</h2>
            </div>

            <form className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 italic">Nom complet</label>
                <input 
                  type="text" 
                  placeholder="Jean Dupont"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 italic">Email</label>
                <input 
                  type="email" 
                  placeholder="jean@exemple.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 italic">Sujet</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none">
                  <option>Information sur l'adhésion</option>
                  <option>Problème de cotisation</option>
                  <option>Déclaration de sinistre</option>
                  <option>Autre demande</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 italic">Votre message</label>
                <textarea 
                  rows="5"
                  placeholder="Comment pouvons-nous vous aider ?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
                ></textarea>
              </div>
              
              <div className="md:col-span-2 pt-4">
                <button className="w-full md:w-auto flex items-center justify-center gap-3 bg-blue-600 hover:bg-slate-900 text-white font-black px-10 py-5 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 cursor-pointer">
                  <Send size={20} />
                  Envoyer ma demande
                </button>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;