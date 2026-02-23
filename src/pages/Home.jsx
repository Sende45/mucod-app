// src/pages/Home.jsx
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Ajouté pour la navigation
import { 
  HeartHandshake, 
  Users, 
  HandHeart, 
  ClipboardCheck, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate(); // Hook pour rediriger l'utilisateur

  // Effet de parallaxe léger au scroll
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);

  const services = [
    { 
      id: "01", 
      titre: "Adhésion simplifiée", 
      desc: "Rejoignez notre communauté en quelques clics pour protéger l'avenir de vos proches.",
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-600",
      lightColor: "bg-blue-50"
    },
    { 
      id: "02", 
      titre: "Gestion des Cotisations", 
      desc: "Un suivi transparent et sécurisé de vos versements pour une sérénité totale.",
      icon: <ClipboardCheck className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-600",
      lightColor: "bg-emerald-50"
    },
    { 
      id: "03", 
      titre: "Soutien aux Familles", 
      desc: "Une assistance humaine et financière immédiate lors des moments de deuil.",
      icon: <HandHeart className="w-6 h-6" />,
      color: "from-rose-500 to-pink-600",
      lightColor: "bg-rose-50"
    },
  ];

  const stats = [
    { label: "Membres actifs", value: "5,000+", icon: <Users size={20}/> },
    { label: "Soutiens versés", value: "98%", icon: <CheckCircle2 size={20}/> },
    { label: "Croissance annuelle", value: "+12%", icon: <TrendingUp size={20}/> },
  ];

  return (
    <div className="bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <header className="relative pt-24 pb-32 px-6 bg-white overflow-hidden">
        {/* Cercles de fond dynamiques */}
        <motion.div style={{ y: y1 }} className="absolute inset-0 -z-10 opacity-40">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-200/50 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-100/50 blur-[100px]" />
        </motion.div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[10px] font-black tracking-[0.2em] text-blue-700 uppercase bg-blue-50/80 backdrop-blur-sm border border-blue-100 rounded-full shadow-sm"
          >
            <Sparkles size={12} className="animate-spin-slow" />
            <span>Protection & Solidarité nouvelle génération</span>
          </motion.div>

          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-9xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.85]"
          >
            Unis dans la <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 drop-shadow-sm">
              bienveillance.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl leading-relaxed font-medium"
          >
            La MUCOD transforme la prévoyance en un acte collectif de compassion. 
            Sécurisez l'avenir de votre famille au sein d'une mutuelle de confiance.
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-5"
          >
            {/* BOUTON ADHÉRER LIÉ AU REGISTER */}
            <button 
              onClick={() => navigate('/register')}
              className="group relative flex items-center gap-3 px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl overflow-hidden hover:scale-105 transition-all shadow-2xl shadow-slate-200 cursor-pointer"
            >
              <div className="absolute inset-0 bg-blue-600 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                Commencer l'adhésion <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </span>
            </button>

            {/* BOUTON VALEURS LIÉ AUX SERVICES */}
            <button 
              onClick={() => navigate('/services')}
              className="px-10 py-5 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer shadow-sm"
            >
              Découvrir nos services
            </button>
          </motion.div>
        </div>
      </header>

      {/* --- STATS STRIP (Glassmorphism) --- */}
      <section className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white flex items-center gap-5 hover:bg-white transition-all"
            >
              <div className="p-4 bg-slate-50 rounded-2xl text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                {stat.icon}
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <main className="max-w-7xl mx-auto px-6 py-40">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
              Un accompagnement <br/>
              <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">total & digital.</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed italic">
              Nous avons simplifié chaque processus pour que la bureaucratie ne soit jamais un obstacle à votre sérénité.
            </p>
          </motion.div>
          <div className="hidden md:block">
             <div className="w-20 h-20 rounded-full border border-slate-200 flex items-center justify-center animate-bounce">
                <ArrowRight className="rotate-90 text-slate-300" />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {services.map((s, i) => (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="relative bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              <div className={`mb-8 p-5 rounded-2xl inline-block bg-gradient-to-br ${s.color} text-white shadow-lg`}>
                {s.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-blue-600 transition-colors">{s.titre}</h3>
              <p className="text-slate-500 leading-relaxed mb-8 font-medium">
                {s.desc}
              </p>
              <button 
                onClick={() => navigate('/services')}
                className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-blue-600 hover:gap-4 transition-all cursor-pointer"
              >
                En savoir plus <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* --- CALL TO ACTION (Ultra Moderne) --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-40 relative bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/30 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest text-blue-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Support Prioritaire
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight tracking-tighter italic">
                Une urgence ? <br/>
                <span className="text-blue-400">On gère le reste.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                En cas de sinistre, notre cellule de crise s'active instantanément. 
                Déclaration en ligne simplifiée et fonds débloqués en un temps record.
              </p>
              <div className="flex flex-wrap gap-4 font-bold">
                {/* BOUTON DÉCLARER UN DÉCÈS LIÉ AU COMPOSANT DeathDeclarationForm */}
                <button 
                  onClick={() => navigate('/declarer-deces')} 
                  className="flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-2xl hover:scale-105 transition-all cursor-pointer shadow-xl"
                >
                  <HeartHandshake size={20}/>
                  Déclarer un décès
                </button>
                <button 
                  onClick={() => navigate('/contact')}
                  className="px-10 py-5 border border-slate-700 rounded-2xl hover:bg-slate-800 transition-all cursor-pointer backdrop-blur-sm"
                >
                  Urgences 24/7
                </button>
              </div>
            </div>
            
            <div className="flex justify-center items-center">
                <div className="relative w-72 h-72 md:w-96 md:h-96">
                   <div className="absolute inset-0 border-2 border-dashed border-blue-500/30 rounded-full animate-[spin_30s_linear_infinite]" />
                   <div className="absolute inset-10 border border-slate-700 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <ShieldCheck className="text-blue-500 drop-shadow-[0_0_30px_rgba(37,99,235,0.4)]" size={120} />
                     <span className="mt-4 font-black text-2xl tracking-tighter">MUCOD SECURE</span>
                   </div>
                </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;