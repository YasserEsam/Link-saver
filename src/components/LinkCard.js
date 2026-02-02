"use client";

import React, { useState } from 'react';
import { ExternalLink, Copy, Eye, EyeOff, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LinkCard({ item, onEdit, onDelete }) {
  const { t, language } = useLanguage();
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="glass-panel" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      position: 'relative',
      padding: '0.75rem'
    }}>
      
      {/* Header with Actions and Main Info */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '1rem' 
      }}>
        {/* Actions - Top Left in LTR, Top Right in RTL (reversed by flex-direction) */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button onClick={() => onDelete(item.id)} className="icon-btn" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }} title={t('delete')}>
             <Trash2 size={14} />
          </button>
          <button onClick={() => onEdit(item)} className="icon-btn" style={{ background: 'rgba(0, 0, 0, 0.03)' }} title={t('edit')}>
             <Edit2 size={14} />
          </button>
        </div>

        {/* Brand Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: language === 'ar' ? 'right' : 'left' }}>
           <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ 
                fontSize: '1rem', 
                fontWeight: '800', 
                marginBottom: '2px', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                letterSpacing: '-0.2px'
              }}>
                {item.name}
              </h3>
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--accent-color)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.2rem', 
                  textDecoration: 'none',
                  justifyContent: language === 'ar' ? 'flex-end' : 'flex-start'
                }}
              >
                <ExternalLink size={10} /> <span>{item.link ? new URL(item.link).hostname : 'No Link'}</span>
              </a>
           </div>

           <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))', 
              color: 'var(--accent-color)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '1.25rem',
              flexShrink: 0,
              overflow: 'hidden',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              padding: '6px'
            }}>
              {item.icon && item.icon.startsWith('data:image') ? (
                <img src={item.icon} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                item.icon || '🔗'
              )}
           </div>
        </div>
      </div>

      {/* Accounts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {item.accounts && item.accounts.length > 0 ? (
          item.accounts.map((acc, idx) => (
            <AccountItem key={idx} account={acc} t={t} language={language} copyToClipboard={copyToClipboard} />
          ))
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem 0', fontSize: '0.8rem' }}>
            {t('no_accounts')}
          </div>
        )}
      </div>
    </div>
  );
}

function AccountItem({ account, t, language, copyToClipboard }) {
  const [showPass, setShowPass] = useState(false);

  return (
    <div style={{ 
      background: 'rgba(0, 0, 0, 0.02)', 
      borderRadius: '10px', 
      padding: '0.75rem',
      border: '1px solid var(--glass-border)',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
         <div style={{ display: 'flex', gap: '4px' }}>
             <button onClick={() => setShowPass(!showPass)} className="icon-btn" style={{ padding: '4px', background: 'transparent' }}>
                {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
             </button>
             <button onClick={() => copyToClipboard(account.email || account.password)} className="icon-btn" style={{ padding: '4px', background: 'transparent' }}>
                <Copy size={13} />
             </button>
         </div>
         <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {account.title || t('main_account')}
         </span>
      </div>
      
      <div style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>
        {account.email && (
          <div style={{ fontSize: '0.85rem', fontWeight: '500', marginBottom: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>
            {account.email}
          </div>
        )}

        {account.password && (
          <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', opacity: 0.7, color: 'var(--text-secondary)' }}>
            {showPass ? account.password : '••••••••'}
          </div>
        )}
      </div>
    </div>
  );
}
