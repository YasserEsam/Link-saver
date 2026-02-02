"use client";

import React, { useState, useEffect } from 'react';
import { ExternalLink, Copy, Eye, EyeOff, Edit2, Trash2, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LinkCard({ item, onEdit, onDelete }) {
  const { t, language } = useLanguage();
  const [toast, setToast] = useState(null);
  
  const copyToClipboard = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setToast(type);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="glass-panel" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      position: 'relative',
      padding: '0.85rem',
      background: 'var(--bg-secondary)',
      overflow: 'visible'
    }}>
      
      {/* Mini Toast Notification */}
      {toast && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--text-primary)',
          color: 'var(--bg-secondary)',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: '700',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          animation: 'fadeInUp 0.2s ease-out'
        }}>
          <Check size={12} strokeWidth={3} /> {language === 'ar' ? 'تم النسخ!' : 'Copied!'}
        </div>
      )}
      
      {/* Header with Icon, Title, Link and Actions */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: '1.5rem',
        marginTop: '0.5rem'
      }}>
        {/* Actions - Now floating in top corners for a cleaner look */}
        <div style={{ 
          position: 'absolute', 
          top: '0.6rem', 
          [language === 'ar' ? 'left' : 'right']: '0.6rem', 
          display: 'flex', 
          gap: '0.3rem',
          opacity: 0.8
        }}>
          <button onClick={() => onEdit(item)} className="icon-btn" style={{ background: 'var(--bg-primary)', width: '26px', height: '26px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} title={t('edit')}>
             <Edit2 size={12} />
          </button>
          <button onClick={() => onDelete(item.id)} className="icon-btn" style={{ color: 'var(--danger)', background: 'var(--bg-primary)', width: '26px', height: '26px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} title={t('delete')}>
             <Trash2 size={12} />
          </button>
        </div>

        {/* Brand Icon - Large, Centered, and Premium */}
        <div style={{ 
          width: '84px', 
          height: '84px', 
          borderRadius: '24px', 
          background: 'var(--bg-secondary)', 
          color: 'var(--accent-color)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '2.5rem',
          marginBottom: '1rem',
          boxShadow: `
            0 20px 25px -5px rgba(0, 0, 0, 0.1), 
            0 10px 10px -5px rgba(0, 0, 0, 0.04),
            inset 0 0 0 1px var(--glass-border)
          `,
          position: 'relative',
          overflow: 'hidden',
          padding: '4px',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          {/* Subtle Glow Background */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), transparent)',
            zIndex: 0
          }}></div>

          <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {item.icon && item.icon.startsWith('data:image') ? (
              <img src={item.icon} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              item.icon || '🔗'
            )}
          </div>
        </div>

        {/* Brand Info - Centered below icon */}
        <div style={{ width: '100%', padding: '0 0.5rem' }}>
          <h3 style={{ 
            fontSize: '1.15rem', 
            fontWeight: '900', 
            marginBottom: '4px', 
            color: 'var(--text-primary)',
            letterSpacing: '-0.4px',
            lineHeight: 1.2
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
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.3rem', 
              textDecoration: 'none',
              opacity: 0.7,
              fontWeight: '600',
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(59, 130, 246, 0.05)'
            }}
          >
            <ExternalLink size={10} /> 
            <span>{item.link ? new URL(item.link).hostname.replace('www.', '') : 'Link'}</span>
          </a>
        </div>
      </div>

      {/* Accounts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {item.accounts && item.accounts.length > 0 ? (
          item.accounts.map((acc, idx) => (
            <AccountItem key={idx} account={acc} t={t} language={language} onCopy={copyToClipboard} />
          ))
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1.5rem 0', fontSize: '0.8rem', fontStyle: 'italic' }}>
            {t('no_accounts')}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}

function AccountItem({ account, t, language, onCopy }) {
  const [showPass, setShowPass] = useState(false);

  return (
    <div style={{ 
      background: 'rgba(0, 0, 0, 0.025)', 
      borderRadius: '12px', 
      padding: '0.8rem',
      border: '1px solid var(--glass-border)',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
         <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.6px', opacity: 0.7 }}>
            {account.title || t('main_account')}
         </span>
         <button onClick={() => setShowPass(!showPass)} className="icon-btn" style={{ padding: '4px', background: 'transparent', width: '24px', height: '24px' }}>
            {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
         </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {/* Email Row */}
        {account.email && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div style={{ 
              fontSize: '0.85rem', 
              fontWeight: '600', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              color: 'var(--text-primary)',
              flex: 1,
              textAlign: language === 'ar' ? 'right' : 'left'
            }}>
              {account.email}
            </div>
            <button onClick={() => onCopy(account.email, 'email')} className="icon-btn" style={{ padding: '4px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '6px' }}>
               <Copy size={12} />
            </button>
          </div>
        )}

        {/* Password Row */}
        {account.password && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: '2px' }}>
            <div style={{ 
              fontSize: '0.8rem', 
              fontFamily: 'monospace', 
              letterSpacing: showPass ? '0' : '2px',
              color: 'var(--text-secondary)',
              opacity: 0.8,
              fontWeight: '600',
              flex: 1,
              textAlign: language === 'ar' ? 'right' : 'left'
            }}>
              {showPass ? account.password : '••••••••'}
            </div>
            <button onClick={() => onCopy(account.password, 'pass')} className="icon-btn" style={{ padding: '4px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '6px' }}>
               <Copy size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
