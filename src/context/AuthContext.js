"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

function compressImage(file, maxSize = 200) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        if (w > h) { h = (maxSize * h) / w; w = maxSize; }
        else { w = (maxSize * w) / h; h = maxSize; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUserProfile = async (uid) => {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        setUserProfile(snap.data());
        return snap.data();
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await loadUserProfile(firebaseUser.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const u = result.user;
      const snap = await getDoc(doc(db, 'users', u.uid));
      if (!snap.exists()) {
        await setDoc(doc(db, 'users', u.uid), {
          displayName: u.displayName || '',
          email: u.email || '',
          photoURL: u.photoURL || '',
          createdAt: new Date().toISOString()
        });
      }
      await loadUserProfile(u.uid);
      router.push('/');
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password, displayName) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(res.user, { displayName });
    }
    await setDoc(doc(db, 'users', res.user.uid), {
      displayName: displayName || '',
      email: email,
      photoURL: '',
      createdAt: new Date().toISOString()
    });
    return res;
  };

  const logout = () => {
    setUserProfile(null);
    return signOut(auth);
  };

  const updateUserProfile = async ({ displayName, photoFile }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No user logged in');

    const profileData = { ...(userProfile || {}) };

    if (displayName !== undefined) {
      profileData.displayName = displayName;
      await updateProfile(currentUser, { displayName });
    }

    if (photoFile) {
      profileData.photoURL = await compressImage(photoFile);
    }

    profileData.updatedAt = new Date().toISOString();
    await setDoc(doc(db, 'users', currentUser.uid), profileData, { merge: true });
    setUserProfile({ ...profileData });
  };

  const updateUserPassword = async (newPassword) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No user logged in');
    await updatePassword(currentUser, newPassword);
  };

  const buildMergedUser = () => {
    if (!user) return null;
    return {
      uid: user.uid,
      email: user.email,
      displayName: userProfile?.displayName || user.displayName || '',
      photoURL: userProfile?.photoURL || user.photoURL || '',
      emailVerified: user.emailVerified,
    };
  };

  const mergedUser = buildMergedUser();

  return (
    <AuthContext.Provider value={{ user: mergedUser, loading, login, signup, logout, loginWithGoogle, updateUserProfile, updateUserPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
