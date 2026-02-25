// src/pages/Register.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, Lock, User, ArrowRight, Check, 
  ShieldCheck, Phone, Users, FileText, Upload, Eye, EyeOff 
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    whatsapp: '',
    protege1: '',
    protege2: '',
    ayantDroit: '',
    cniFile: null // Stockera l'objet File
  });
  
  const [isFocused, setIsFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validation de sécurité de base
    if (formData.password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (!formData.cniFile) {
      alert("Veuillez uploader une copie de votre CNI pour valider votre adhésion.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Appel de la fonction register (AuthContext) avec le fichier CNI en dernier argument
      await register(
        formData.email, 
        formData.password, 
        formData.name, 
        {
          whatsapp: formData.whatsapp,
          protege1: formData.protege1,
          protege2: formData.protege2,
          ayantDroit: formData.ayantDroit
        }, 
        formData.cniFile // <--- PASSAGE DU FICHIER ICI
      );
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Erreur d'inscription :", error.code);
      if (error.code === 'auth/email-already-in-use') {
        alert("Cette adresse email est déjà associée à un compte.");
      } else {
        alert("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = formData.password.length > 0 
    ? formData.password.length < 6 ? 'Faible' : 'Fort' 
    : null;

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-20 overflow-hidden">
      
      {/* Background décoratif */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
          <div className="grid md:grid-cols-12">
            
            {/* Sidebar gauche (Desktop) */}
            <div className="hidden md:flex md:col-span-4 bg-slate-900 p-10 flex-col justify-between text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                    <ShieldCheck size={28} />
                </div>
                <h2 className="text-2xl font-bold leading-tight mb-4">Adhésion à la MUCOD.</h2>
                <p className="text-slate-400 text-sm leading-relaxed italic mb-8">
                  "S'unir pour mieux se soutenir."
                </p>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                      <span className="text-blue-400 font-bold text-xs">01</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Profil</p>
                      <p className="text-xs text-slate-500">Vos infos de contact</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                      <span className="text-blue-400 font-bold text-xs">02</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Famille</p>
                      <p className="text-xs text-slate-500">Protégés & Ayant-droit</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3 text-xs font-medium text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Check size={12} className="text-blue-400" />
                  </div>
                  Données cryptées (RGPD)
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl" />
            </div>

            {/* Section Formulaire */}
            <div className="md:col-span-8 p-8 md:p-12">
              <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Formulaire d'Adhésion</h1>
                <p className="text-slate-500 mt-2 text-sm font-medium italic">
                  Veuillez remplir tous les champs pour la validation de votre dossier.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* --- SECTION 1 : IDENTITÉ --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-2">Identité</label>
                    <div className={`relative transition-all duration-300 ${isFocused === 'name' ? 'scale-[1.02]' : ''}`}>
                      <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isFocused === 'name' ? 'text-blue-600' : 'text-slate-400'}`} size={18} />
                      <input 
                        type="text" required placeholder="Nom complet"
                        onFocus={() => setIsFocused('name')} onBlur={() => setIsFocused(null)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700"
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-2">Contact WhatsApp</label>
                    <div className={`relative transition-all duration-300 ${isFocused === 'whatsapp' ? 'scale-[1.02]' : ''}`}>
                      <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isFocused === 'whatsapp' ? 'text-blue-600' : 'text-slate-400'}`} size={18} />
                      <input 
                        type="tel" required placeholder="N° WhatsApp"
                        onFocus={() => setIsFocused('whatsapp')} onBlur={() => setIsFocused(null)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700"
                        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2">Email & Connexion</label>
                  <div className={`relative transition-all duration-300 ${isFocused === 'email' ? 'scale-[1.02]' : ''}`}>
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isFocused === 'email' ? 'text-blue-600' : 'text-slate-400'}`} size={18} />
                    <input 
                      type="email" required placeholder="Adresse email"
                      onFocus={() => setIsFocused('email')} onBlur={() => setIsFocused(null)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                {/* --- SECTION 2 : SOLIDARITÉ --- */}
                <div className="pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="text-blue-600" size={20} />
                    <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest">Protégés & Ayant-droit</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" required placeholder="Nom du Protégé 1"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700 text-sm"
                      onChange={(e) => setFormData({...formData, protege1: e.target.value})}
                    />
                    <input 
                      type="text" required placeholder="Nom du Protégé 2"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700 text-sm"
                      onChange={(e) => setFormData({...formData, protege2: e.target.value})}
                    />
                  </div>
                  
                  <input 
                    type="text" required placeholder="Nom de l'Ayant-droit"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 mt-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700 text-sm border-dashed"
                    onChange={(e) => setFormData({...formData, ayantDroit: e.target.value})}
                  />
                </div>

                {/* --- SECTION 3 : DOCUMENTS --- */}
                <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="text-blue-600" size={18} />
                      <span className="text-xs font-black text-slate-900 uppercase">Documents requis (CNI)</span>
                    </div>
                    {formData.cniFile && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full font-bold">
                        Fichier sélectionné
                      </span>
                    )}
                  </div>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-200 rounded-2xl cursor-pointer hover:bg-blue-50 transition-colors">
                    <Upload className="text-blue-400 mb-2" size={24} />
                    <span className="text-xs font-bold text-slate-500 text-center px-4">
                      {formData.cniFile ? formData.cniFile.name : "Cliquez pour uploader votre CNI"}
                    </span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*,.pdf"
                      onChange={(e) => setFormData({...formData, cniFile: e.target.files[0]})} 
                    />
                  </label>
                </div>

                {/* --- MOT DE PASSE --- */}
                <div className="space-y-2">
                  <div className={`relative transition-all duration-300 ${isFocused === 'password' ? 'scale-[1.02]' : ''}`}>
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isFocused === 'password' ? 'text-blue-600' : 'text-slate-400'}`} size={18} />
                    <input 
                      type={showPassword ? "text" : "password"}
                      required placeholder="Mot de passe"
                      onFocus={() => setIsFocused('password')} onBlur={() => setIsFocused(null)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700"
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {passwordStrength && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 px-1">
                        <div className="flex-grow h-1 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div className={`h-full ${passwordStrength === 'Faible' ? 'bg-rose-500' : 'bg-emerald-500'}`} initial={{ width: 0 }} animate={{ width: passwordStrength === 'Faible' ? '30%' : '100%' }} />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${passwordStrength === 'Faible' ? 'text-rose-500' : 'text-emerald-500'}`}>{passwordStrength}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-slate-900'} text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 group mt-6 cursor-pointer text-lg`}
                >
                  {isSubmitting ? "Traitement en cours..." : "Valider mon adhésion"}
                  {!isSubmitting && <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                <p className="text-slate-500 text-sm font-medium">
                  Déjà membre ? <Link to="/login" className="text-blue-600 font-bold hover:underline">Connectez-vous ici</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;