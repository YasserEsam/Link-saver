"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Mail, Lock, ArrowRight, Loader2, Globe, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { t, toggleLanguage, language } = useLanguage();
  const { toggleTheme, theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 1500);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decor (Blobs) */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, var(--accent-color) 0%, transparent 70%)',
        opacity: 0.2,
        filter: 'blur(80px)',
        zIndex: -1
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, var(--danger) 0%, transparent 70%)',
        opacity: 0.1,
        filter: 'blur(80px)',
        zIndex: -1
      }}></div>

      {/* Top Controls */}
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', gap: '1rem' }}>
        <button onClick={toggleTheme} className="icon-btn">
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
        <button onClick={toggleLanguage} className="icon-btn">
          {language === 'en' ? 'AR' : 'EN'} <Globe size={20} style={{ marginLeft: '5px' }} />
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '360px' }}>
        <div className="text-center mb-4">
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{t('login')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('welcome')}</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: '500' }}>{t('email')}</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [language === 'ar' ? 'right' : 'left']: '0.75rem', color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                className="glass-input" 
                placeholder="name@example.com"
                style={{ paddingLeft: language === 'ar' ? '0.75rem' : '2.4rem', paddingRight: language === 'ar' ? '2.4rem' : '0.75rem' }}
                required
              />
            </div>
          </div>

          <div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '500' }}>{t('password')}</label>
                <Link href="#" style={{ fontSize: '0.75rem', color: 'var(--accent-color)', textDecoration: 'none' }}>{t('forgot_password')}</Link>
             </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [language === 'ar' ? 'right' : 'left']: '0.75rem', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                className="glass-input" 
                placeholder="••••••••"
                style={{ paddingLeft: language === 'ar' ? '0.75rem' : '2.4rem', paddingRight: language === 'ar' ? '2.4rem' : '0.75rem' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ padding: '0.6rem' }}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : t('login')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="text-center mt-4" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link href="/signup" style={{ color: 'var(--accent-color)', fontWeight: '600' }}>{t('signup')}</Link>
        </div>
      </div>
    </div>
  );
}
