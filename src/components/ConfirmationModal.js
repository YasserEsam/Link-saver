"use client";

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 110,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        background: 'var(--bg-secondary)'
      }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{message || t('delete_confirm')}</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          <button onClick={onClose} className="btn btn-secondary">{t('cancel')}</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="btn btn-danger">
             {t('delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
