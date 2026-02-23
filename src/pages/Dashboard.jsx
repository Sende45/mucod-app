import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  User, Mail, ShieldCheck, Calendar, 
  CreditCard, Settings, Bell, ChevronRight, Loader2,
  AlertTriangle, Send, X, MessageSquare
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeathForm, setShowDeathForm] = useState(false);
  const [declarationLoading, setDeclarationLoading] = useState(false);

  // --- RÉCUPÉRATION DES DONNÉES FIRESTORE ---
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [user]);

  // --- NOUVELLE FONCTION : REMPLISSAGE AUTO DU NOM ---
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && selectedValue !== "Autre") {
      // On récupère la partie avant le '|' (le nom)
      const namePart = selectedValue.split('|')[0];
      // On l'injecte directement dans le champ input 'nom'
      const nameInput = document.getElementsByName('nom')[0];
      if (nameInput) {
        nameInput.value = namePart;
      }
    }
  };

  // --- FONCTION DÉCLARATION DÉCÈS ---
  const handleDeathSubmit = async (e) => {
    e.preventDefault();
    setDeclarationLoading(true);
    const formData = new FormData(e.target);
    
    // On nettoie la valeur du lien pour ne garder que le label (ex: "Protégé 1")
    const fullLien = formData.get('lien');
    const finalLien = fullLien.includes('|') ? fullLien.split('|')[1] : fullLien;

    try {
      await addDoc(collection(db, "declarations"), {
        defuntNom: formData.get('nom'),
        lien: finalLien,
        dateDeces: formData.get('date'),
        déclarantId: user.uid,
        déclarantNom: userData?.displayName || userData?.name || user.email,
        status: "En attente",
        createdAt: serverTimestamp()
      });
      alert("Déclaration envoyée. La MUCOD reviendra vers vous.");
      setShowDeathForm(false);
    } catch (error) {
      alert("Erreur lors de l'envoi");
    } finally {
      setDeclarationLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );

  const displayName = userData?.displayName || userData?.name || user?.displayName || 'Membre';
  const initial = displayName.charAt(0).toUpperCase();
  const status = userData?.status || "En attente";

  const stats = [
    { 
      label: "Statut", 
      value: status, 
      icon: <ShieldCheck className={status === "À jour" ? "text-emerald-500" : "text-amber-500"} /> 
    },
    { 
      label: "Membre depuis", 
      value: userData?.createdAt ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString() : "Récemment", 
      icon: <Calendar className="text-blue-500" /> 
    },
    { 
      label: "Cotisations", 
      value: `${userData?.totalCotise || 0} FCFA`, 
      icon: <CreditCard className="text-indigo-500" /> 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* --- MODAL FORMULAIRE DÉCÈS --- */}
      <AnimatePresence>
        {showDeathForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
              <button onClick={() => setShowDeathForm(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl"><AlertTriangle size={24}/></div>
                <h2 className="text-xl font-black text-slate-900">Déclarer un décès</h2>
              </div>
              <form onSubmit={handleDeathSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nom complet du défunt</label>
                  <input name="nom" required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-rose-500 font-bold" placeholder="S'affiche automatiquement" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Lien de parenté</label>
                  <select name="lien" required onChange={handleSelectChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none font-bold text-slate-700">
                    <option value="">Choisir...</option>
                    <option value={`${displayName}|Membre`}>Moi-même (Membre)</option>
                    
                    {/* Mapping dynamique basé sur le tableau 'proteges' de Firestore */}
                    {userData?.proteges && userData.proteges.map((protege, index) => (
                      <option key={index} value={`${protege.nom}|Protégé ${index + 1}`}>
                        (Protégé {index + 1})
                      </option>
                    ))}
                    
                    <option value="Autre">Autre bénéficiaire</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Date du décès</label>
                  <input name="date" required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" />
                </div>
                <button type="submit" disabled={declarationLoading} className="w-full bg-rose-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 hover:bg-rose-700 transition-all">
                  {declarationLoading ? <Loader2 className="animate-spin" /> : <><Send size={18}/> Envoyer l'alerte</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header du Dashboard */}
      <div className="bg-slate-900 pt-32 pb-40 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl border-4 border-slate-800">
                {initial}
              </div>
              <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-4 border-slate-900 flex items-center justify-center ${status === "À jour" ? "bg-emerald-500" : "bg-amber-500"}`}>
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black text-white tracking-tight mb-2">Bonjour, {displayName}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <span className="flex items-center gap-2 text-slate-400 font-medium"><Mail size={16} /> {user?.email}</span>
                <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-500/20">ID: #MU-{user?.uid?.slice(0, 5)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">{stat.icon}</div>
            </motion.div>
          ))}

          <div className="lg:col-span-2 space-y-6">
            
            {/* --- BOUTON URGENCE --- */}
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => setShowDeathForm(true)}
              className="w-full p-6 bg-rose-50 border-2 border-dashed border-rose-200 rounded-[2.5rem] flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-lg shadow-rose-200"><AlertTriangle size={24} /></div>
                <div>
                  <p className="font-black text-rose-600 uppercase text-[10px] tracking-[0.2em]">Urgence & Sinistre</p>
                  <p className="font-bold text-slate-800 text-lg">Déclarer un décès</p>
                </div>
              </div>
              <ChevronRight className="text-rose-400 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 mb-8">Ma Famille & Bénéficiaires</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {userData?.proteges && userData.proteges.map((protege, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Protégé {i + 1}</p>
                    <p className="font-bold text-slate-800">{protege.nom || "Non défini"}</p>
                    <p className="text-[10px] text-slate-400 italic">Statut: {protege.status || 'Actif'}</p>
                  </div>
                ))}
                {(!userData?.proteges || userData.proteges.length === 0) && (
                   <p className="text-slate-400 text-sm italic">Aucun protégé enregistré.</p>
                )}
              </div>

              <div className="space-y-4">
                {[
                  { label: "Historique des paiements", icon: <CreditCard size={20}/>, desc: "Consulter mes reçus de cotisation" },
                  { label: "Documents (CNI)", icon: <ShieldCheck size={20}/>, desc: "Gérer mes documents officiels" },
                  { label: "Sécurité", icon: <Settings size={20}/>, desc: "Changer mon mot de passe" },
                ].map((item, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-6 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-all group cursor-pointer border border-transparent hover:border-blue-100">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-3 bg-white rounded-xl text-slate-400 group-hover:text-blue-600 shadow-sm transition-colors">{item.icon}</div>
                      <div>
                        <p className="font-bold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <Bell size={20} className="text-blue-600" />
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Dernières Alertes</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-800 mb-1">Cotisation Exceptionnelle</p>
                  <p className="text-[10px] text-blue-600 leading-relaxed">L'admin a lancé une cotisation de 2000 FCFA pour le membre X.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-xl font-bold mb-4">Ayant-droit</h3>
                 <p className="text-blue-100 text-sm mb-2 font-medium italic">Bénéficiaire désigné :</p>
                 <p className="text-2xl font-black mb-8">{userData?.ayantDroit || "Non renseigné"}</p>
                 <button className="w-full py-4 bg-white text-blue-600 font-black rounded-2xl text-sm hover:bg-blue-50 transition-colors cursor-pointer">Consulter mon contrat</button>
               </div>
               <ShieldCheck className="absolute -bottom-10 -right-10 text-white/10 w-48 h-48 rotate-12" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;