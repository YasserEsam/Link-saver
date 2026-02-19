"use client";

import React, { useState } from 'react';
import { X, ExternalLink, Copy, Eye, EyeOff, Check, Edit2, Trash2, StickyNote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function AccountDetail({ account, t, onCopy, copiedField }) {
  const [showPass, setShowPass] = useState(false);

  return (
    <div style={{
      background: 'var(--bg-primary)',
      borderRadius: '14px',
      padding: '1rem 1.1rem',
      border: '1px solid var(--glass-border)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
        <span style={{
          fontSize: '0.7rem', color: 'var(--accent-color)', fontWeight: '800',
          textTransform: 'uppercase', letterSpacing: '0.8px',
          background: 'rgba(59,130,246,0.06)', padding: '3px 10px', borderRadius: '6px',
        }}>
          {account.title || t('main_account')}
        </span>
        <button onClick={() => setShowPass(!showPass)} className="icon-btn" style={{ padding: '5px', width: '28px', height: '28px' }}>
          {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {account.email && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {account.email}
            </span>
            <button
              onClick={() => onCopy(account.email, `email-${account.title}`)}
              className="icon-btn"
              style={{ padding: '6px', background: 'rgba(59,130,246,0.06)', borderRadius: '8px', flexShrink: 0 }}
            >
              {copiedField === `email-${account.title}` ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
            </button>
          </div>
        )}
        {account.password && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-secondary)', letterSpacing: showPass ? '0' : '2px', flex: 1 }}>
              {showPass ? account.password : '••••••••'}
            </span>
            <button
              onClick={() => onCopy(account.password, `pass-${account.title}`)}
              className="icon-btn"
              style={{ padding: '6px', background: 'rgba(59,130,246,0.06)', borderRadius: '8px', flexShrink: 0 }}
            >
              {copiedField === `pass-${account.title}` ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LinkDetailModal({ isOpen, item, onClose, onEdit, onDelete }) {
  const { t, language } = useLanguage();
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !item) return null;

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  let hostname = '';
  try { hostname = new URL(item.link).hostname.replace('www.', ''); } catch {}

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel"
        style={{
          width: '100%', maxWidth: '500px', maxHeight: '88vh',
          display: 'flex', flexDirection: 'column',
          background: 'var(--bg-secondary)', overflow: 'hidden',
          borderRadius: '18px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          animation: 'modalSlideUp 0.25s ease',
        }}
      >
        {/* Hero header with icon */}
        <div style={{
          padding: '2rem 1.5rem 1.25rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', position: 'relative',
          background: 'linear-gradient(180deg, rgba(59,130,246,0.04) 0%, transparent 100%)',
        }}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="icon-btn"
            style={{ position: 'absolute', top: '1rem', [language === 'ar' ? 'left' : 'right']: '1rem' }}
          >
            <X size={20} />
          </button>

          {/* Large icon */}
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'var(--bg-secondary)', border: '1.5px solid var(--glass-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', overflow: 'hidden', padding: '6px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            marginBottom: '1rem',
          }}>
            {item.icon && item.icon.startsWith('data:image') ? (
              <img src={item.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              item.icon || '🔗'
            )}
          </div>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '0.25rem' }}>
            {item.name}
          </h2>
          {hostname && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{hostname}</span>
          )}

          {/* Visit Website */}
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: '1rem',
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: 'var(--accent-color)', color: '#fff',
                padding: '0.55rem 1.4rem', borderRadius: '10px',
                textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600',
                boxShadow: '0 4px 12px rgba(59,130,246,0.25)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
            >
              <ExternalLink size={15} /> {t('visit_website')}
            </a>
          )}
        </div>

        {/* Note */}
        {item.note && (
          <div style={{
            margin: '0 1.5rem', marginBottom: '0.75rem',
            padding: '0.75rem 0.85rem', borderRadius: '12px',
            background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
            display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
          }}>
            <StickyNote size={15} style={{ color: 'var(--text-secondary)', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-wrap', margin: 0 }}>
              {item.note}
            </p>
          </div>
        )}

        {/* Accounts list */}
        <div style={{ padding: '0 1.5rem 1.25rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {item.accounts && item.accounts.length > 0 ? (
            item.accounts.map((acc, idx) => (
              <AccountDetail key={idx} account={acc} t={t} onCopy={copyToClipboard} copiedField={copiedField} />
            ))
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0', fontSize: '0.88rem' }}>
              {t('no_accounts')}
            </p>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.85rem 1.5rem',
          borderTop: '1px solid var(--glass-border)',
          display: 'flex', gap: '0.65rem',
        }}>
          <button
            onClick={() => { onEdit(item); onClose(); }}
            className="btn btn-secondary"
            style={{ flex: 1, justifyContent: 'center', borderRadius: '10px', padding: '0.6rem' }}
          >
            <Edit2 size={15} /> {t('edit')}
          </button>
          <button
            onClick={() => { onDelete(item.id); onClose(); }}
            className="btn btn-danger"
            style={{ justifyContent: 'center', padding: '0.6rem 1.25rem', borderRadius: '10px' }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
