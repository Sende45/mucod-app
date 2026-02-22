import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = "admin@mucod.ci";
  // REMPLACE PAR TA CLÉ API IMGBB (disponible sur https://api.imgbb.com/)
  const IMGBB_API_KEY = "35bb74e2910fc59f0f0e4e2ad6c87935"; 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUser({ ...firebaseUser, ...docSnap.data() });
          } else {
            setUser(firebaseUser);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur profil :", error);
        setUser(firebaseUser || null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const register = async (email, password, displayName, extraData = {}, cniFile = null) => {
    try {
      // 1. GESTION DE L'UPLOAD VERS IMGBB
      let cniUrl = "";
      if (cniFile) {
        const formData = new FormData();
        formData.append("image", cniFile);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: "POST",
          body: formData,
        });

        const imgData = await response.json();
        if (imgData.success) {
          cniUrl = imgData.data.url; // URL directe de l'image hébergée
        } else {
          throw new Error("Échec de l'upload de l'image sur ImgBB");
        }
      }

      // 2. CRÉATION DU COMPTE AUTH
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      const role = email === ADMIN_EMAIL ? 'admin' : 'membre';

      // 3. PRÉPARATION ET ENREGISTREMENT DANS FIRESTORE
      const userData = {
        uid: newUser.uid,
        displayName,
        email,
        whatsapp: extraData.whatsapp || '',
        proteges: [
          { nom: extraData.protege1 || '', status: 'actif' },
          { nom: extraData.protege2 || '', status: 'actif' }
        ],
        ayantDroit: extraData.ayantDroit || '',
        cniUrl: cniUrl, // On stocke l'URL ImgBB
        role: role,
        status: role === 'admin' ? "À jour" : "En attente de validation", 
        createdAt: new Date().toISOString(),
        totalCotise: 0,
        arrieres: 0
      };

      await setDoc(doc(db, "users", newUser.uid), userData);
      setUser({ ...newUser, ...userData });
      return newUser;
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Erreur de connexion :", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAdmin: user?.role === 'admin',
    isBE: user?.role === 'BE',
    isCCG: user?.role === 'CCG'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '10px', color: '#64748b' }}>Chargement de la MUCOD...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};