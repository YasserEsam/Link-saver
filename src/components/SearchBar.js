"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function SearchBar({ links = [], onSelect, compact = false }) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 250);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const results = debouncedQuery.trim().length > 0
    ? links.filter(link =>
        link.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        (link.accounts || []).some(acc => acc.email?.toLowerCase().includes(debouncedQuery.toLowerCase()))
      ).slice(0, 8)
    : [];

  const showDropdown = open && debouncedQuery.trim().length > 0;

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (link) => {
    onSelect(link);
    setQuery('');
    setOpen(false);
  };

  const height = compact ? '40px' : '46px';
  const iconSize = compact ? 16 : 18;
  const fontSize = compact ? '0.88rem' : '0.95rem';
  const dropdownWidth = compact ? '340px' : '100%';

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      {/* Input */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        background: 'var(--input-bg)',
        border: open ? '1.5px solid var(--accent-color)' : '1.5px solid var(--input-border)',
        borderRadius: '12px',
        padding: '0 1rem',
        height,
        transition: 'all 0.2s ease',
        boxShadow: open ? '0 0 0 3px rgba(59,130,246,0.08)' : 'none',
      }}>
        <Search size={iconSize} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={t('search')}
          style={{
            border: 'none', background: 'transparent', outline: 'none',
            color: 'var(--text-primary)', fontSize,
            flex: 1, height: '100%', minWidth: 0,
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            style={{
              background: 'var(--bg-primary)', border: 'none', cursor: 'pointer',
              width: '22px', height: '22px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)', flexShrink: 0,
            }}
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)',
          [language === 'ar' ? 'right' : 'left']: 0,
          width: dropdownWidth, minWidth: '300px', maxHeight: '400px', overflowY: 'auto',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--glass-border)',
          borderRadius: '14px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.18), 0 0 0 1px var(--glass-border)',
          zIndex: 200,
          animation: 'searchDrop 0.18s ease',
        }}>
          {results.length > 0 ? (
            <div style={{ padding: '6px' }}>
              {results.map((link) => {
                let hostname = '';
                try { hostname = new URL(link.link).hostname.replace('www.', ''); } catch {}
                return (
                  <button
                    key={link.id}
                    onClick={() => handleSelect(link)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.65rem 0.75rem', border: 'none', borderRadius: '10px',
                      background: 'transparent', cursor: 'pointer',
                      textAlign: language === 'ar' ? 'right' : 'left',
                      transition: 'background 0.12s',
                      color: 'var(--text-primary)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                      background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.15rem', overflow: 'hidden', padding: '4px',
                    }}>
                      {link.icon && link.icon.startsWith('data:image') ? (
                        <img src={link.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        link.icon || '🔗'
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {link.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        {hostname && <span>{hostname}</span>}
                        {hostname && link.accounts?.length > 0 && <span>·</span>}
                        {link.accounts?.length > 0 && (
                          <span>{link.accounts.length} {t('accounts_count')}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Search size={28} style={{ marginBottom: '0.5rem', opacity: 0.3 }} />
              <p style={{ fontSize: '0.88rem' }}>{t('no_results')}</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes searchDrop {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
