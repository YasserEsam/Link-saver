"use client";

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AddEditModal({ isOpen, onClose, initialData, onSave }) {
  const { t, language } = useLanguage();
  
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    icon: '🔗',
    accounts: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Default empty state
      setFormData({
        name: '',
        link: '',
        icon: '🔗', // Default emoji
        accounts: [{ title: '', email: '', password: '' }] // Start with one empty account
      });
    }
  }, [initialData, isOpen]);

  const handleAccountChange = (index, field, value) => {
    const newAccounts = [...formData.accounts];
    newAccounts[index][field] = value;
    setFormData({ ...formData, accounts: newAccounts });
  };

  const addAccount = () => {
    setFormData({
      ...formData,
      accounts: [...formData.accounts, { title: '', email: '', password: '' }]
    });
  };

  const removeAccount = (index) => {
    const newAccounts = formData.accounts.filter((_, i) => i !== index);
    setFormData({ ...formData, accounts: newAccounts });
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, icon: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 100,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-secondary)', 
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.1rem' }}>{initialData ? t('edit') : t('add_new')}</h2>
          <button onClick={onClose} className="icon-btn"><X size={20} /></button>
        </div>
        
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
          <form id="add-edit-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Main Info */}
            <div className="grid grid-cols-1" style={{ gap: '0.75rem' }}>
               <div>
                 <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: '500' }}>{t('card_title')}</label>
                 <input 
                    type="text" 
                    className="glass-input" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Facebook, Google, etc."
                    required 
                 />
               </div>
               <div>
                 <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: '500' }}>{t('website_link')}</label>
                 <input 
                    type="url" 
                    className="glass-input" 
                    value={formData.link} 
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    placeholder="https://..."
                 />
               </div>
               
               {/* Icon Upload */}
               <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: '500' }}>Icon Image</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '8px', 
                      background: 'var(--bg-primary)', 
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      padding: '8px'
                    }}>
                      {formData.icon && formData.icon.startsWith('data:image') ? (
                        <img src={formData.icon} alt="icon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <span style={{ fontSize: '1.2rem' }}>{formData.icon || '🔗'}</span>
                      )}
                    </div>
                    <label className="btn btn-secondary" style={{ cursor: 'pointer', fontSize: '0.75rem', padding: '0.5rem' }}>
                      <Plus size={14} /> Upload Image
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleIconChange} />
                    </label>
                  </div>
               </div>
            </div>
            
            <hr style={{ border: '0', borderTop: '1px solid var(--glass-border)' }} />

            {/* Accounts Section */}
            <div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '0.9rem' }}>Accounts</h3>
                  <button type="button" onClick={addAccount} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                     <Plus size={14} /> {t('add_account')}
                  </button>
               </div>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {formData.accounts.map((acc, index) => (
                    <div key={index} style={{ 
                       padding: '0.75rem', 
                       border: '1px solid var(--glass-border)', 
                       borderRadius: '8px',
                       background: 'var(--bg-primary)',
                       position: 'relative',
                       display: 'flex',
                       flexDirection: 'column',
                       gap: '0.5rem'
                    }}>
                       {formData.accounts.length > 1 && (
                         <button 
                           type="button" 
                           onClick={() => removeAccount(index)} 
                           style={{ position: 'absolute', top: '0.5rem', [language==='ar'?'left':'right']: '0.5rem', color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                         >
                           <Trash2 size={14} />
                         </button>
                       )}
                       
                       <input 
                          type="text" 
                          className="glass-input" 
                          placeholder={t('account_title')} 
                          value={acc.title} 
                          onChange={(e) => handleAccountChange(index, 'title', e.target.value)}
                          style={{ padding: '0.4rem' }}
                       />
                       <div className="grid grid-cols-1 grid-cols-sm-2" style={{ gap: '0.5rem' }}>
                          <input 
                             type="text" 
                             className="glass-input" 
                             placeholder={t('email')} 
                             value={acc.email} 
                             onChange={(e) => handleAccountChange(index, 'email', e.target.value)}
                             style={{ padding: '0.4rem' }}
                          />
                          <input 
                             type="text" 
                             className="glass-input" 
                             placeholder={t('password')} 
                             value={acc.password} 
                             onChange={(e) => handleAccountChange(index, 'password', e.target.value)}
                             style={{ padding: '0.4rem' }}
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

          </form>
        </div>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">{t('cancel')}</button>
          <button type="submit" form="add-edit-form" className="btn btn-primary">
            <Save size={16} /> {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}
