// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import du context
import { 
  ShieldCheck, 
  Menu, 
  X, 
  UserCircle, 
  ArrowRight,
  ChevronDown,
  LogOut,
  LayoutDashboard
} from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false); // Menu déroulant profil
  
  const { user, logout } = useAuth(); // Récupération de l'état global
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowProfileMenu(false);
  };

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Solidarité', path: '/solidarite' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.nav 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`relative flex items-center justify-between px-4 md:px-8 py-3 rounded-2xl border transition-all duration-300 ${
            scrolled ? 'bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl shadow-slate-900/5' : 'bg-white/60 backdrop-blur-md border-transparent'
          }`}
        >
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg">
              <ShieldCheck className="text-white" size={22} />
            </div>
            <div className="flex flex-col uppercase">
              <span className="text-xl font-black leading-none tracking-tighter text-slate-900">
                MUCOD<span className="text-blue-600">.</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest">Mutuelle</span>
            </div>
          </Link>

          {/* --- DESKTOP NAV --- */}
          <div className="hidden md:flex items-center bg-slate-100/50 rounded-full px-2 py-1 border border-slate-200/50">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className="relative px-5 py-2 text-sm font-bold transition-colors"
              >
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={`relative z-10 ${location.pathname === link.path ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>
                  {link.name}
                </span>
              </Link>
            ))}
          </div>

          {/* --- ACTIONS --- */}
          <div className="flex items-center gap-3">
            {user ? (
              /* --- SI CONNECTÉ : MENU PROFIL --- */
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 bg-slate-900 text-white pl-4 pr-3 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all cursor-pointer"
                >
                  {user.displayName?.split(' ')[0]}
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                    <ChevronDown size={14} className={`transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 z-[60]"
                    >
                      <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connecté en tant que</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                      </div>
                      <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition">
                        <LayoutDashboard size={18} /> Mon Espace
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      >
                        <LogOut size={18} /> Déconnexion
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* --- SI DÉCONNECTÉ : BOUTONS CLASSIQUES --- */
              <>
                <Link 
                  to="/login" 
                  className="hidden lg:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 px-4 transition"
                >
                  <UserCircle size={18} /> Connexion
                </Link>
                <Link 
                  to="/register"
                  className="group relative inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-bold px-6 py-2.5 rounded-xl overflow-hidden transition-all hover:bg-blue-600 active:scale-95 shadow-lg shadow-slate-200"
                >
                  <span className="relative z-10">Adhérer</span>
                  <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </motion.nav>

        {/* --- MOBILE MENU --- */}
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="md:hidden mt-4">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-lg font-bold">
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="flex justify-between items-center text-slate-600 border-b border-slate-50 pb-2">
                    {link.name} <ChevronDown size={16} className="-rotate-90" />
                  </Link>
                ))}
                {!user ? (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="mt-4 flex items-center justify-center gap-2 py-4 bg-slate-50 rounded-2xl text-slate-900">
                    <UserCircle size={20} /> Connexion
                  </Link>
                ) : (
                  <button onClick={handleLogout} className="mt-4 flex items-center justify-center gap-2 py-4 bg-rose-50 rounded-2xl text-rose-600">
                    <LogOut size={20} /> Déconnexion
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;