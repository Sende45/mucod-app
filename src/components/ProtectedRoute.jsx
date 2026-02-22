// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Si le contexte est encore en train de vérifier si l'utilisateur est là
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si pas d'utilisateur, on redirige vers /login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si tout est bon, on affiche la page demandée
  return children;
};

export default ProtectedRoute;