"use client";

import React, { useState } from 'react';
import { ExternalLink, Copy, Eye, EyeOff, Edit2, Trash2, Check, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LinkCard({ item, onEdit, onDelete, onClick }) {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const copy = (e, text, key) => {
    e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const firstAccount = item.accounts?.[0];
  const extraCount = (item.accounts?.length || 0) - 1;
  let hostname = '';
  try { hostname = new URL(item.link).hostname.replace('www.', ''); } catch {}

  const iconBtn = { width: '26px', height: '26px', padding: 0, flexShrink: 0 };

  return (
    <div
      onClick={() => onClick?.(item)}
      className="link-card glass-panel"
      style={{
        display: 'flex', flexDirection: 'column',
        position: 'relative', padding: '0.85rem',
        background: 'var(--bg-secondary)',
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'hidden', minWidth: 0, height: '100%',
      }}
    >
      {/* Top row: icon + info + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.6rem' }}>
        <div style={{
          width: '46px', height: '46px', borderRadius: '14px', flexShrink: 0,
          background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', overflow: 'hidden', padding: '4px',
        }}>
          {item.icon && item.icon.startsWith('data:image') ? (
            <img src={item.icon} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            item.icon || '🔗'
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: '0.95rem', fontWeight: '800', lineHeight: 1.2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            marginBottom: '2px',
          }}>
            {item.name}
          </h3>
          {hostname && (
            <a
              href={item.link} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                fontSize: '0.7rem', color: 'var(--accent-color)',
                display: 'inline-flex', alignItems: 'center', gap: '3px',
                textDecoration: 'none', opacity: 0.7, fontWeight: '600',
              }}
            >
              <ExternalLink size={9} /> {hostname}
            </a>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.2rem', flexShrink: 0 }}>
          <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="icon-btn" style={{ width: '28px', height: '28px', background: 'var(--bg-primary)', borderRadius: '8px' }} title={t('edit')}>
            <Edit2 size={12} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="icon-btn" style={{ width: '28px', height: '28px', color: 'var(--danger)', background: 'var(--bg-primary)', borderRadius: '8px' }} title={t('delete')}>
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Note preview */}
      {item.note && (
        <p style={{
          fontSize: '0.75rem', color: 'var(--text-secondary)',
          marginBottom: '0.55rem', lineHeight: 1.4,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
        }}>
          {item.note}
        </p>
      )}

      {/* First account preview */}
      {firstAccount && (
        <div style={{
          background: 'var(--bg-primary)', borderRadius: '10px',
          padding: '0.6rem 0.7rem',
          border: '1px solid var(--glass-border)',
          overflow: 'hidden', minWidth: 0,
          display: 'flex', flexDirection: 'column', gap: '0.3rem',
        }}>
          <span style={{ fontSize: '0.6rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-secondary)', opacity: 0.7 }}>
            {firstAccount.title || t('main_account')}
          </span>

          {firstAccount.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {firstAccount.email}
              </span>
              <button onClick={(e) => copy(e, firstAccount.email, 'email')} className="icon-btn" style={iconBtn}>
                {copied === 'email' ? <Check size={12} style={{ color: 'var(--success)' }} /> : <Copy size={12} />}
              </button>
            </div>
          )}

          {firstAccount.password && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)', letterSpacing: showPass ? '0' : '2px', flex: 1 }}>
                {showPass ? firstAccount.password : '••••••••'}
              </span>
              <button onClick={(e) => copy(e, firstAccount.password, 'pass')} className="icon-btn" style={iconBtn}>
                {copied === 'pass' ? <Check size={12} style={{ color: 'var(--success)' }} /> : <Copy size={12} />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); setShowPass(!showPass); }} className="icon-btn" style={iconBtn}>
                {showPass ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>
          )}
        </div>
      )}

      {/* View details — always visible */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '0.3rem', marginTop: 'auto', paddingTop: '0.5rem',
        fontSize: '0.72rem', fontWeight: '700', color: 'var(--accent-color)',
        padding: '0.35rem 0', borderRadius: '8px',
        background: 'rgba(59,130,246,0.04)',
      }}>
        {extraCount > 0 ? `+${extraCount} ${t('accounts_count')} ` : ''}{t('view_details')} <ChevronRight size={12} />
      </div>
    </div>
  );
}
