"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function EmptyState({ onAdd }) {
  const { t } = useLanguage();

  return (
    <div className="glass-panel text-center" style={{
      padding: '6rem 2rem',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
      background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-primary))',
    }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '24px',
        background: 'rgba(59,130,246,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--accent-color)', marginBottom: '0.5rem',
      }}>
        <Plus size={40} strokeWidth={1.5} />
      </div>

      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{t('empty_title')}</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '300px', margin: '0 auto', fontSize: '0.95rem' }}>
          {t('empty_desc')}
        </p>
      </div>

      <button
        onClick={onAdd}
        className="btn btn-primary"
        style={{ padding: '0.8rem 2.5rem', borderRadius: '12px', fontSize: '1rem', fontWeight: '700' }}
      >
        {t('add_account')}
      </button>
    </div>
  );
}
