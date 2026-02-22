// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Importation du Context
import { AuthProvider } from './context/AuthContext';

// Importation des composants globaux
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Importation des pages
import Home from './pages/Home';
import Services from './pages/Services';
import Solidarite from './pages/Solidarite';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardAdmin from './pages/DashboardAdmin';

function App() {
  return (
    /* L'AuthProvider doit être TOUT en haut pour que 
      le Header et les Pages puissent savoir qui est connecté.
    */
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50">
          
          {/* Le Header reste fixe en haut */}
          <Header />

          {/* pt-24 compense la hauteur du header fixe. 
              Si ta page est blanche, vérifie aussi que tes composants 
              pages (Home, Login, etc.) exportent bien "default".
          */}
          <main className="flex-grow pt-24 md:pt-28">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/solidarite" element={<Solidarite />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Nouvelles routes d'authentification */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              // Dans App.jsx
              <Route 
                path="/admin" 
                element={
                <ProtectedRoute>
                {/* Tu pourras ajouter ici une vérification if(user.email === 'admin@mucod.ci') */}
                <DashboardAdmin />
                </ProtectedRoute>
                } 
              /> 
              
              {/* Route de secours (404) si tu tapes n'importe quoi */}
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