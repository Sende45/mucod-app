// src/pages/Login.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowRight, ShieldCheck, Fingerprint } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate('/');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-20 overflow-hidden">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-slate-200/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
          <div className="grid md:grid-cols-2">
            
            {/* --- LEFT SIDE: BRANDING/VISUAL --- */}
            <div className="hidden md:flex bg-slate-900 p-12 flex-col justify-between relative overflow-hidden text-white">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                  <ShieldCheck size={28} />
                </div>
                <h2 className="text-4xl font-black leading-tight mb-6 tracking-tighter">
                  Sécurité <br />
                  <span className="text-blue-500">renforcée.</span>
                </h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                  Connectez-vous pour gérer vos cotisations et accéder à vos services de solidarité en toute confidentialité.
                </p>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                    <Fingerprint size={24} />
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    Protection biométrique et cryptage de bout en bout activés.
                  </p>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
            </div>

            {/* --- RIGHT SIDE: FORM --- */}
            <div className="p-10 md:p-16">
              <div className="mb-10 text-center md:text-left">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bon retour</h1>
                <p className="text-slate-500 mt-2 font-medium">Ravi de vous revoir parmi nous.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                  <div className={`relative transition-all duration-300 ${isFocused === 'email' ? 'scale-[1.02]' : ''}`}>
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isFocused === 'email' ? 'text-blue-600' : 'text-slate-400'}`} size={18} />
                    <input 
                      type="email" required placeholder="votre@email.com"
                      onFocus={() => setIsFocused('email')}
                      onBlur={() => setIsFocused(null)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Mot de passe</label>
                    <button type="button" className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-tighter">Oublié ?</button>
                  </div>
                  <div className={`relative transition-all duration-300 ${isFocused === 'password' ? 'scale-[1.02]' : ''}`}>
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isFocused === 'password' ? 'text-blue-600' : 'text-slate-400'}`} size={18} />
                    <input 
                      type="password" required placeholder="••••••••"
                      onFocus={() => setIsFocused('password')}
                      onBlur={() => setIsFocused(null)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 group cursor-pointer mt-8">
                  Accéder à mon espace
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                <p className="text-slate-500 text-sm font-medium">
                  Pas encore membre ? <Link to="/register" className="text-blue-600 font-black hover:underline">Rejoindre la MUCOD</Link>
                </p>
              </div>
            </div>

          </div>
        </div>
        
        {/* --- FOOTER LOGIN --- */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-slate-400 text-xs font-bold uppercase tracking-[0.2em]"
        >
          © 2026 MUCOD Mutuelle • Système de Prévoyance Sécurisé
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;