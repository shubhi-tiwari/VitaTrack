import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth'; // Import Firebase authentication functions

import { auth } from '../Firebase/firebase-config'; // Assuming your Firebase configuration is in firebase-config.js

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        setCurrentUser(userCredential.user); // Set current user upon successful login
        const userEmail = userCredential.user.email;
        const userID = userCredential.user.uid;
        localStorage.setItem('userEmail', userEmail); // Store user email in local storage
        localStorage.setItem('userID', userID); // Store userID in local storage
      })
      .catch(error => {
        console.error('Login failed:', error.message);
      });
  };

  const logout = async () => {
    try {
      await signOut(auth);      localStorage.removeItem('userEmail'); // Clear user email from local storage
      localStorage.removeItem('userID'); // Clear userID from local storage
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
