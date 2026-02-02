"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LinkCard from "../components/LinkCard";
import AddEditModal from "../components/AddEditModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { Plus, Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "../lib/firebase";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  query,
  orderBy
} from "firebase/firestore";

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Protected Route & Data Fetching
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }

    if (user) {
      const q = query(
        collection(db, `users/${user.uid}/links`),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const linksData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setLinks(linksData);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, authLoading, router]);

  const filteredLinks = links.filter(link => 
    link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.accounts.some(acc => acc.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveLink = async (formData) => {
    if (!user) return;

    try {
      if (currentItem) {
        // Edit
        const docRef = doc(db, `users/${user.uid}/links`, currentItem.id);
        await updateDoc(docRef, {
          ...formData,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Add
        await addDoc(collection(db, `users/${user.uid}/links`), {
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error saving link:", error);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsAddEditOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!user || !deleteId) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/links`, deleteId));
      setIsConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  if (authLoading || (user && loading)) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <Loader2 className="animate-spin" style={{ color: 'var(--accent-color)' }} size={40} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="container" style={{ flex: 1, padding: '1.5rem', width: '100%' }}>
        
        {/* Header Actions */}
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "1rem", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "2rem" 
        }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "800", letterSpacing: "-0.5px" }}>{t('dashboard')}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{language === 'ar' ? 'قم بإدارة روابطك وحساباتك بأمان' : 'Safe & simple link management'}</p>
          </div>
          
          <button 
            onClick={() => { setCurrentItem(null); setIsAddEditOpen(true); }} 
            className="btn btn-primary"
            style={{ padding: "0.75rem 1.5rem", borderRadius: "10px", boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)" }}
          >
            <Plus size={20} /> {t('add_new')}
          </button>
        </div>

        {/* Search Bar */}
        <div className="glass-panel" style={{ padding: "0.75rem", marginBottom: "2rem" }}>
          <div style={{ position: "relative", width: "100%" }}>
            <Search size={18} style={{ 
              position: "absolute", 
              [language === 'ar' ? 'right' : 'left']: "1.25rem", 
              top: "50%", 
              transform: "translateY(-50%)", 
              color: "var(--text-secondary)" 
            }} />
            <input 
              type="text" 
              className="glass-input" 
              placeholder={t('search')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                paddingLeft: language === 'ar' ? '1rem' : '3.25rem', 
                paddingRight: language === 'ar' ? '3.25rem' : '1rem' 
              }}
            />
          </div>
        </div>

        {/* Links Grid */}
        {filteredLinks.length > 0 ? (
          <div className="grid grid-cols-1 grid-cols-sm-2 grid-cols-lg-3 grid-cols-xl-4" style={{ gap: "1.25rem" }}>
            {filteredLinks.map(link => (
              <LinkCard 
                key={link.id} 
                item={link} 
                onEdit={handleEdit} 
                onDelete={handleDeleteClick} 
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel text-center" style={{ 
            padding: "6rem 2rem", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: "1.5rem",
            background: "linear-gradient(135deg, var(--bg-secondary), var(--bg-primary))"
          }}>
             <div style={{ 
                width: "80px", 
                height: "80px", 
                borderRadius: "24px", 
                background: "rgba(59, 130, 246, 0.05)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "var(--accent-color)",
                marginBottom: "0.5rem"
             }}>
                <Plus size={40} strokeWidth={1.5} />
             </div>
             
             <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>{t('no_accounts')}</h2>
                <p style={{ color: "var(--text-secondary)", maxWidth: "300px", margin: "0 auto", fontSize: "0.95rem" }}>
                  {language === 'ar' 
                    ? 'ابدأ بإضافة أول رابط وحساباتك لتنظيمها بشكل آمن' 
                    : 'Start by adding your first link and accounts to organize them securely'}
                </p>
             </div>

             <button 
                onClick={() => { setCurrentItem(null); setIsAddEditOpen(true); }}
                className="btn btn-primary"
                style={{ padding: "0.8rem 2.5rem", borderRadius: "12px", fontSize: "1rem", fontWeight: "700" }}
             >
                {t('add_account')}
             </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddEditModal 
        isOpen={isAddEditOpen} 
        onClose={() => setIsAddEditOpen(false)} 
        initialData={currentItem}
        onSave={handleSaveLink}
      />

      <ConfirmationModal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={confirmDelete}
        message={t('delete_confirm')}
      />

      {/* Footer Branding */}
      <footer style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
        LinkSaver - Build By Yasser WIth Love {new Date().getFullYear()} ©
      </footer>
    </div>
  );
}
