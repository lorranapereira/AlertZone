// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Monitora o estado de autenticação
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Inscreve-se para atualizações em tempo real dos dados do usuário
        const userRef = doc(db, "users", user.uid);
        const unsubscribeUser = onSnapshot(userRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setUserData({
              id: user.uid,
              email: user.email,
              notificationToken: data.notificationToken,
              latitude: data.latitude,
              longitude: data.longitude,
              isAdmin: data.isAdmin || false,
            });
          } else {
            setUserData(null);
          }
          setLoading(false);
        }, (error) => {
          console.log("Erro ao escutar dados do usuário:", error);
          setUserData(null);
          setLoading(false);
        });

        // Limpa o listener do Firestore ao mudar o usuário
        return () => unsubscribeUser();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    // Limpa o listener de autenticação ao desmontar o componente
    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ userData }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
