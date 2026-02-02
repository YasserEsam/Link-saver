"use client";

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Globe, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav style={{ 
      padding: '0.75rem 2rem', 
      position: 'sticky', 
      top: '0', 
      zIndex: 50,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--glass-border)',
      width: '100%',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
    }}>
      <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="logo" style={{ fontWeight: '900', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', letterSpacing: '-0.5px' }}>
          <span style={{ color: 'var(--text-primary)' }}>Saver</span>
          <span style={{ color: 'var(--accent-color)' }}>Link</span>
        </div>
      </Link>

      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
        <button onClick={toggleTheme} className="icon-btn" title={theme === 'dark' ? t('theme_light') : t('theme_dark')}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button onClick={toggleLanguage} className="icon-btn" title={t('language')} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.85rem', fontWeight: '800' }}>
          <Globe size={20} />
          <span className="hide-mobile">{language === 'en' ? 'AR' : 'EN'}</span>
        </button>

        <div style={{ width: '1px', height: '20px', background: 'var(--glass-border)', margin: '0 0.5rem' }}></div>

        <Link href="/profile" className="icon-btn" title={t('profile')} style={{ overflow: 'hidden', padding: user?.photoURL ? '0' : '0.4rem' }}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          ) : (
            <User size={20} />
          )}
        </Link>
        <button onClick={handleLogout} className="icon-btn" style={{ color: 'var(--danger)' }} title={t('logout')}>
          <LogOut size={20} />
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 480px) {
          .hide-mobile { display: none; }
        }
      `}</style>
    </nav>
  );
}
