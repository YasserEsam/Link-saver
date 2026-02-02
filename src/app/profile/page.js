"use client";

import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { User, Mail, Lock, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <Loader2 className="animate-spin" style={{ color: 'var(--accent-color)' }} size={40} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1, padding: '1rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{t('profile')}</h1>
        
        <div className="grid grid-cols-1 grid-cols-xl-2" style={{ gap: '1rem' }}>
          
          {/* Profile Info */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', marginBottom: '1rem', overflow: 'hidden' }}>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'
                    )}
                </div>
                <h2 style={{ fontSize: '1.5rem' }}>{user.displayName || 'User'}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
             </div>

             <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                   <label style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                   <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [language === 'ar' ? 'right' : 'left']: '1rem', color: 'var(--text-secondary)' }} />
                      <input type="text" className="glass-input" defaultValue={user.displayName} style={{ paddingLeft: language === 'ar' ? '1rem' : '2.8rem', paddingRight: language === 'ar' ? '2.8rem' : '1rem' }} />
                   </div>
                </div>
                <div>
                   <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('email')}</label>
                   <div style={{ position: 'relative' }}>
                      <Mail size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [language === 'ar' ? 'right' : 'left']: '1rem', color: 'var(--text-secondary)' }} />
                      <input type="email" className="glass-input" defaultValue={user.email} disabled style={{ paddingLeft: language === 'ar' ? '1rem' : '2.8rem', paddingRight: language === 'ar' ? '2.8rem' : '1rem', opacity: 0.7 }} />
                   </div>
                </div>
                <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>{t('update_profile')}</button>
             </form>
          </div>

          {/* Security */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
             <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{t('reset_password')}</h3>
             <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                   <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('current_password')}</label>
                   <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [language === 'ar' ? 'right' : 'left']: '1rem', color: 'var(--text-secondary)' }} />
                      <input type="password" className="glass-input" placeholder="••••••••" style={{ paddingLeft: language === 'ar' ? '1rem' : '2.8rem', paddingRight: language === 'ar' ? '2.8rem' : '1rem' }} />
                   </div>
                </div>
                <div>
                   <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('new_password')}</label>
                   <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [language === 'ar' ? 'right' : 'left']: '1rem', color: 'var(--text-secondary)' }} />
                      <input type="password" className="glass-input" placeholder="••••••••" style={{ paddingLeft: language === 'ar' ? '1rem' : '2.8rem', paddingRight: language === 'ar' ? '2.8rem' : '1rem' }} />
                   </div>
                </div>
                <button type="button" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
                   <Save size={18} /> {t('save')}
                </button>
             </form>
          </div>

        </div>
      </main>
    </div>
  );
}
