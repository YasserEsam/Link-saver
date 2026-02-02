"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Loader2, Globe, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getFriendlyErrorMessage } from '../../utils/errorHelper';

export default function SignupPage() {
  const { t, toggleLanguage, language } = useLanguage();
  const { toggleTheme, theme } = useTheme();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, name);
      router.push('/');
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
      <div style={{ position: 'absolute', top: '20%', left: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--accent-color) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(80px)', zIndex: -1 }}></div>

      {/* Top Controls */}
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', gap: '1rem' }}>
        <button onClick={toggleTheme} className="icon-btn">
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
        <button onClick={toggleLanguage} className="icon-btn">
          {language === 'en' ? 'AR' : 'EN'} <Globe size={20} style={{ marginLeft: '5px' }} />
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '380px' }}>
        <div className="text-center mb-4">
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{t('signup')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Create your account</p>
        </div>

        {error && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
           {/* Name */}
           <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [language === 'ar' ? 'right' : 'left']: '0.75rem', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                className="glass-input" 
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: language === 'ar' ? '0.75rem' : '2.4rem', paddingRight: language === 'ar' ? '2.4rem' : '0.75rem' }}
                required
              />
            </div>

          {/* Email */}
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

          {/* Password */}
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [language === 'ar' ? 'right' : 'left']: '0.75rem', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                className="glass-input" 
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: language === 'ar' ? '0.75rem' : '2.4rem', paddingRight: language === 'ar' ? '2.4rem' : '0.75rem' }}
                required
              />
            </div>

             {/* Confirm Password */}
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [language === 'ar' ? 'right' : 'left']: '0.75rem', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                className="glass-input" 
                placeholder={t('confirm_password')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingLeft: language === 'ar' ? '0.75rem' : '2.4rem', paddingRight: language === 'ar' ? '2.4rem' : '0.75rem' }}
                required
              />
            </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ padding: '0.6rem' }}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : t('signup')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="text-center mt-4" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--accent-color)', fontWeight: '600' }}>{t('login')}</Link>
        </div>
      </div>
    </div>
  );
}
