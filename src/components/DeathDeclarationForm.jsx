import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Send, FileText } from 'lucide-react';

const DeathDeclarationForm = ({ closeModal }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    defuntNom: '',
    lienParente: '', // Protégé 1, Protégé 2, ou le Membre lui-même
    dateDeces: '',
    commentaire: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "declarations"), {
        ...formData,
        userId: user.uid,
        userEmail: user.email,
        status: "En attente de traitement",
        createdAt: serverTimestamp(),
      });
      alert("Déclaration transmise. La MUCOD vous contactera sous peu.");
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-2xl font-sans">
      <div className="flex items-center gap-2 text-rose-600 mb-4">
        <AlertTriangle size={20} />
        <h2 className="font-black uppercase text-sm">Déclarer un sinistre</h2>
      </div>

      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nom du défunt</label>
        <input 
          type="text" required
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-rose-500 outline-none transition-all"
          onChange={(e) => setFormData({...formData, defuntNom: e.target.value})}
        />
      </div>

      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Lien de parenté</label>
        <select 
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
          onChange={(e) => setFormData({...formData, lienParente: e.target.value})}
        >
          <option value="">Sélectionner...</option>
          <option value="Membre">Moi-même (Membre)</option>
          <option value="Protege 1">Protégé 1</option>
          <option value="Protege 2">Protégé 2</option>
        </select>
      </div>

      <button 
        type="submit" disabled={loading}
        className="w-full bg-rose-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-rose-100"
      >
        {loading ? "Envoi..." : "Envoyer la déclaration"} <Send size={18} />
      </button>
    </form>
  );
};

export default DeathDeclarationForm;