"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, Globe, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getFriendlyErrorMessage } from '../../utils/errorHelper';

export default function LoginPage() {
  const { t, toggleLanguage, language } = useLanguage();
  const { toggleTheme, theme } = useTheme();
  const { login, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(getFriendlyErrorMessage(err.code, t));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(getFriendlyErrorMessage(err.code, t));
    } finally {
      setLoading(false);
    }
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
      {/* Background Decor */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, var(--accent-color) 0%, transparent 70%)', opacity: 0.2, filter: 'blur(80px)', zIndex: -1 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, var(--danger) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(80px)', zIndex: -1 }}></div>

      {/* Top Controls */}
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', gap: '1rem' }}>
        <button onClick={toggleTheme} className="icon-btn">
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
        <button onClick={toggleLanguage} className="icon-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{language === 'en' ? 'AR' : 'EN'}</span> 
          <Globe size={20} />
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '360px' }}>
        <div className="text-center mb-4">
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{t('login')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('welcome')}</p>
        </div>

        {error && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: '500' }}>{t('email')}</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [language === 'ar' ? 'right' : 'left']: '0.75rem', color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                className="glass-input" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: language === 'ar' ? '0.75rem' : '2.4rem', paddingRight: language === 'ar' ? '2.4rem' : '0.75rem' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ padding: '0.6rem' }}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : t('login')}
            {!loading && <ArrowRight size={18} style={{ transform: language === 'ar' ? 'rotate(180deg)' : 'none' }} />}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          className="btn btn-secondary w-full" 
          disabled={loading}
          style={{ padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
          Continue with Google
        </button>

        <div className="text-center mt-4" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link href="/signup" style={{ color: 'var(--accent-color)', fontWeight: '600' }}>{t('signup')}</Link>
        </div>
      </div>
    </div>
  );
}
