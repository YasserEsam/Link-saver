"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LinkCard from "../components/LinkCard";
import AddEditModal from "../components/AddEditModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { useLanguage } from "../context/LanguageContext";
import { Plus, Search, Filter } from "lucide-react";

export default function Dashboard() {
  const { t, language } = useLanguage();
  
  // Dummy Data
  const [links, setLinks] = useState([
    {
      id: 1,
      name: "Facebook",
      icon: "📘",
      link: "https://facebook.com",
      accounts: [
        { title: "Personal", email: "mohammed@fb.com", password: "password123" },
        { title: "Work", email: "dev@fb.com", password: "workpass!23" }
      ]
    },
    {
      id: 2,
      name: "Google",
      icon: "🔍",
      link: "https://google.com",
      accounts: [
        { title: "Main", email: "admin@gmail.com", password: "securepassword" }
      ]
    },
    {
      id: 3,
      name: "GitHub",
      icon: "💻",
      link: "https://github.com",
      accounts: [
        { title: "Dev Account", email: "coder@github.com", password: "gitpassword" }
      ]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filteredLinks = links.filter(link => 
    link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.accounts.some(acc => acc.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveLink = (formData) => {
    if (currentItem) {
      // Edit
      setLinks(links.map(link => link.id === currentItem.id ? { ...formData, id: link.id } : link));
    } else {
      // Add
      const newLink = {
        ...formData,
        id: Date.now()
      };
      setLinks([...links, newLink]);
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

  const confirmDelete = () => {
    setLinks(links.filter(link => link.id !== deleteId));
    setIsConfirmOpen(false);
  };

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
          <div className="glass-panel text-center" style={{ padding: "5rem 2rem" }}>
             <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>{t('no_accounts')}</p>
             <button 
                onClick={() => { setCurrentItem(null); setIsAddEditOpen(true); }}
                className="btn btn-secondary mt-4"
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
