// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Importation du Context
import { AuthProvider } from './context/AuthContext';

// Importation des composants globaux
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Importation des pages et composants de formulaires
import Home from './pages/Home';
import Services from './pages/Services';
import Solidarite from './pages/Solidarite';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardAdmin from './pages/DashboardAdmin';
import DeathDeclarationForm from './components/DeathDeclarationForm'; // Importation du formulaire

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50">
          
          {/* Le Header reste fixe en haut */}
          <Header />

          {/* Le main avec padding pour compenser le header fixe */}
          <main className="flex-grow pt-24 md:pt-28">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/solidarite" element={<Solidarite />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Route pour la déclaration de décès (liée au bouton de la Home) */}
              <Route path="/declarer-deces" element={<DeathDeclarationForm />} />
              
              {/* Routes d'authentification et utilisateur */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Route Admin protégée */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <DashboardAdmin />
                  </ProtectedRoute>
                } 
              /> 
              
              {/* Route de secours (404) redirigeant vers l'accueil */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          <Footer />
          
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;