// src/pages/DashboardAdmin.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase'; 
import { collection, onSnapshot, query, orderBy, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Users, Wallet, Search, MoreVertical, 
  CheckCircle, Download, Loader2, Clock, Phone, Eye,
  AlertCircle, MessageSquare, X, ShieldCheck, Star, Briefcase, Edit2
} from 'lucide-react';

const DashboardAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [declarations, setDeclarations] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('membres'); 
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // AJOUT : État pour le membre en cours d'édition

  // --- RÉCUPÉRATION DES DONNÉES ---
  useEffect(() => {
    const qUsers = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsersList(users.filter(u => u.role !== 'admin'));
      setLoading(false);
    });

    const qDeces = query(collection(db, "declarations"), orderBy("createdAt", "desc"));
    const unsubDeces = onSnapshot(qDeces, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDeclarations(docs);
    });

    return () => { unsubUsers(); unsubDeces(); };
  }, []);

  // --- ACTION : AJOUTER ---
  const handleAddUser = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      await addDoc(collection(db, "users"), {
        name: f.get('name'),
        email: f.get('email'),
        whatsapp: f.get('whatsapp'),
        role: f.get('role'),
        status: "À jour",
        totalCotise: 0,
        createdAt: serverTimestamp()
      });
      setShowAddUserModal(false);
      alert("Adhérent ajouté avec succès !");
    } catch (error) {
      alert("Erreur lors de l'ajout.");
    }
  };

  // --- AJOUT : ACTION MODIFIER ---
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      const userRef = doc(db, "users", editingUser.id);
      await updateDoc(userRef, {
        name: f.get('name'),
        whatsapp: f.get('whatsapp'),
        role: f.get('role')
      });
      setEditingUser(null);
      alert("Profil mis à jour avec succès !");
    } catch (error) {
      alert("Erreur lors de la mise à jour.");
    }
  };

  const handleNotifyAll = () => {
    const message = encodeURIComponent("⚠️ ALERTE MUCOD : Une nouvelle cotisation est lancée suite à un décès. Merci de vous connecter pour régulariser.");
    if (window.confirm(`Voulez-vous envoyer une alerte aux ${usersList.length} membres ?`)) {
      window.open(`https://wa.me/?text=${message}`, '_blank');
    }
  };

  const handleApprove = async (userId) => {
    if (!window.confirm("Valider cette adhésion ?")) return;
    try {
      await updateDoc(doc(db, "users", userId), { status: "À jour" });
    } catch (error) {
      alert("Erreur de validation.");
    }
  };

  // --- FILTRAGE ---
  const filteredUsers = usersList.filter(user => 
    (user.name || user.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    switch(role) {
      case 'Bureau Exécutif':
        return <span className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-[9px] font-black uppercase"><Star size={10}/> B.E</span>;
      case 'ACCG':
        return <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-[9px] font-black uppercase"><ShieldCheck size={10}/> ACCG</span>;
      default:
        return <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-[9px] font-black uppercase"><Users size={10}/> Membre</span>;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* --- MODAL AJOUTER UN ADHÉRENT --- */}
      <AnimatePresence>
        {showAddUserModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative">
              <button onClick={() => setShowAddUserModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600"><X size={24} /></button>
              <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900">Nouvel Adhérent</h2>
                <p className="text-slate-500 text-sm">Inscrire un membre manuellement.</p>
              </div>
              <form onSubmit={handleAddUser} className="space-y-5">
                <div className="space-y-4">
                  <input name="name" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none" placeholder="Nom Complet" />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="email" required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none" placeholder="Email" />
                    <input name="whatsapp" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none" placeholder="WhatsApp" />
                  </div>
                  <select name="role" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none font-bold text-slate-700">
                    <option value="Membre">Simple Membre</option>
                    <option value="Bureau Exécutif">Bureau Exécutif (B.E)</option>
                    <option value="ACCG">ACCG</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                  <CheckCircle size={20} /> Enregistrer
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- AJOUT : MODAL MODIFIER UN ADHÉRENT --- */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative">
              <button onClick={() => setEditingUser(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600"><X size={24} /></button>
              <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900">Modifier l'adhérent</h2>
                <p className="text-slate-500 text-sm italic">Édition de : {editingUser.name || editingUser.displayName}</p>
              </div>
              <form onSubmit={handleUpdateUser} className="space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nom Complet</label>
                    <input name="name" defaultValue={editingUser.name || editingUser.displayName} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Numéro WhatsApp</label>
                    <input name="whatsapp" defaultValue={editingUser.whatsapp} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Rôle / Catégorie</label>
                    <select name="role" defaultValue={editingUser.role || "Membre"} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none font-bold text-slate-700 cursor-pointer focus:border-blue-500 transition-all">
                      <option value="Membre">Simple Membre</option>
                      <option value="Bureau Exécutif">Bureau Exécutif (B.E)</option>
                      <option value="ACCG">ACCG</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
                  <CheckCircle size={20} /> Valider les modifications
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 pt-24 pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Administration</h1>
              <p className="text-slate-500 font-medium italic">Gestion des membres et de la solidarité.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowAddUserModal(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg cursor-pointer">
                <Users size={18} /> Ajouter Adhérent
              </button>
              <button onClick={handleNotifyAll} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg cursor-pointer">
                <MessageSquare size={18} /> Alerte Cotisation
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { label: "Adhérents", value: usersList.length, icon: <Users size={24}/>, color: "bg-blue-600" },
              { label: "Cagnotte", value: `${usersList.reduce((a,c)=>a+(Number(c.totalCotise)||0),0).toLocaleString()} FCFA`, icon: <Wallet size={24}/>, color: "bg-emerald-600" },
              { label: "Alertes Décès", value: declarations.length, icon: <AlertCircle size={24}/>, color: "bg-rose-500" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className={`${stat.color} p-4 rounded-2xl text-white w-fit mb-6`}>{stat.icon}</div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-4 mb-6">
            <button onClick={() => setActiveTab('membres')} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'membres' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>Membres</button>
            <button onClick={() => setActiveTab('deces')} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'deces' ? 'bg-rose-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>Décès ({declarations.length})</button>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{activeTab === 'membres' ? "Registre des Membres" : "Registre des Décès"}</h3>
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Rechercher..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-3 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            <div className="overflow-x-auto">
              {activeTab === 'membres' ? (
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-8 py-4">Membre</th>
                      <th className="px-8 py-4">Rôle</th>
                      <th className="px-8 py-4">Famille</th>
                      <th className="px-8 py-4">Statut</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">{(m.name || m.displayName || 'U').charAt(0)}</div>
                            <div>
                              <p className="font-bold text-slate-900">{m.name || m.displayName}</p>
                              <p className="text-[10px] text-slate-500">{m.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">{getRoleBadge(m.role)}</td>
                        <td className="px-8 py-6">
                          <div className="text-[10px] space-y-1">
                            <p className="text-slate-600 font-bold">P1: {m.protege1 || '-'}</p>
                            <p className="text-slate-600 font-bold">P2: {m.protege2 || '-'}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${m.status === 'À jour' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{m.status}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            {m.status !== 'À jour' && <button onClick={() => handleApprove(m.id)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-slate-900 transition-all cursor-pointer">Valider</button>}
                            {/* BOUTON MODIFIER - Utilise setEditingUser(m) pour ouvrir le modal */}
                            <button onClick={() => setEditingUser(m)} className="p-2 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-xl transition-all text-slate-500 cursor-pointer">
                              <Edit2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-rose-50/50 text-rose-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-8 py-4">Défunt</th>
                      <th className="px-8 py-4">Lien</th>
                      <th className="px-8 py-4">Déclarant</th>
                      <th className="px-8 py-4">Statut</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {declarations.map((d) => (
                      <tr key={d.id} className="border-b border-slate-50">
                        <td className="px-8 py-6 font-bold text-slate-900">{d.defuntNom}</td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500 uppercase">{d.lien}</td>
                        <td className="px-8 py-6 text-sm text-slate-600">{d.déclarantNom}</td>
                        <td className="px-8 py-6"><span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">{d.status}</span></td>
                        <td className="px-8 py-6 text-right"><button onClick={handleNotifyAll} className="bg-rose-600 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-rose-700 transition-all cursor-pointer">Appel Solidarité</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;