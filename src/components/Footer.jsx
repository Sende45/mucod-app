// src/components/Footer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Plateforme",
      links: [
        { name: "Comment ça marche ?", href: "#" },
        { name: "Devenir membre", href: "/register" },
        { name: "Déclarer un décès", href: "#" },
        { name: "Tarifs & Cotisations", href: "#" },
      ]
    },
    {
      title: "Assistance",
      links: [
        { name: "Centre d'aide", href: "#" },
        { name: "Foire aux questions", href: "#" },
        { name: "Documents utiles", href: "#" },
        { name: "Contact d'urgence", href: "#" },
      ]
    }
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 overflow-hidden relative">
      {/* Effet visuel en arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* --- BRANDING & NEWSLETTER --- */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                <ShieldCheck className="text-white" size={28} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                MUCOD<span className="text-blue-500">.</span>
              </span>
            </div>
            
            <p className="text-slate-400 leading-relaxed text-sm max-w-sm">
              Plus qu'une mutuelle, une communauté solidaire dédiée à préserver la dignité humaine dans les moments les plus difficiles.
            </p>

            <div className="flex flex-col gap-4">
               <h4 className="text-white font-bold text-sm uppercase tracking-widest">Restez informé</h4>
               <div className="flex gap-2">
                 <input 
                  type="email" 
                  placeholder="votre@email.com" 
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-blue-500 transition-colors w-full"
                 />
                 <button className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all active:scale-95">
                   <ArrowUpRight size={20} />
                 </button>
               </div>
            </div>
          </div>

          {/* --- DYNAMIC LINKS --- */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-white font-bold mb-8 text-sm uppercase tracking-widest">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href} 
                        className="group flex items-center gap-1 hover:text-blue-400 transition-colors text-sm font-medium"
                      >
                        {link.name}
                        <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* --- CONTACT INFO --- */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-8 text-sm uppercase tracking-widest">Nous contacter</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="p-2.5 bg-slate-800 rounded-xl group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-bold uppercase">Téléphone</span>
                  <span className="text-sm text-white font-medium">+225 07 00 00 00 00</span>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-2.5 bg-slate-800 rounded-xl group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                  <Mail size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-bold uppercase">Email</span>
                  <span className="text-sm text-white font-medium">contact@mucod-mutuelle.ci</span>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-2.5 bg-slate-800 rounded-xl group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                  <MapPin size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-bold uppercase">Siège Social</span>
                  <span className="text-sm text-white font-medium">Abidjan, Côte d'Ivoire</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            <p>© {currentYear} MUCOD MUTUELLE</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
            </div>
          </div>
          
          <div className="flex gap-3">
            {[
              { icon: <Facebook size={18} />, color: "hover:bg-blue-600" },
              { icon: <Twitter size={18} />, color: "hover:bg-sky-500" },
              { icon: <Linkedin size={18} />, color: "hover:bg-blue-700" }
            ].map((social, i) => (
              <button key={i} className={`p-2.5 bg-slate-800 text-slate-400 rounded-xl transition-all cursor-pointer ${social.color} hover:text-white`}>
                {social.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;