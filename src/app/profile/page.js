"use client";

import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { User, Mail, Lock, Save, Loader2, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Navbar from '../../components/Navbar';

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
      padding: '0.75rem 1.5rem', borderRadius: '10px', zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      background: type === 'success' ? 'var(--success)' : 'var(--danger)',
      color: '#fff', fontSize: '0.9rem', fontWeight: 500,
      boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
      animation: 'slideUp 0.3s ease'
    }}>
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      {message}
    </div>
  );
}

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const { user, loading, updateUserProfile, updateUserPassword } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [displayName, setDisplayName] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      await updateUserProfile({ photoFile: file });
      setToast({ message: t('profile_updated'), type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: t('err_generic'), type: 'error' });
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await updateUserProfile({ displayName });
      setToast({ message: t('profile_updated'), type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: t('err_generic'), type: 'error' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setToast({ message: t('password_too_short'), type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ message: t('passwords_no_match'), type: 'error' });
      return;
    }
    setPasswordSaving(true);
    try {
      await updateUserPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setToast({ message: t('password_updated'), type: 'success' });
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setToast({ message: t('err_requires_login'), type: 'error' });
      } else {
        setToast({ message: t('err_generic'), type: 'error' });
      }
    } finally {
      setPasswordSaving(false);
    }
  };

  const currentAvatar = user?.photoURL;

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <Loader2 className="animate-spin" style={{ color: 'var(--accent-color)' }} size={40} />
      </div>
    );
  }

  if (!user) return null;

  const iconSide = language === 'ar' ? 'right' : 'left';
  const inputPadStart = language === 'ar' ? { paddingRight: '2.8rem', paddingLeft: '1rem' } : { paddingLeft: '2.8rem', paddingRight: '1rem' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '1rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{t('profile')}</h1>

        <div className="grid grid-cols-1 grid-cols-xl-2" style={{ gap: '1rem' }}>

          {/* Profile Info */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div
                  onClick={!avatarUploading ? handleAvatarClick : undefined}
                  style={{
                    width: '110px', height: '110px', borderRadius: '50%',
                    background: 'var(--accent-color)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '2.5rem', marginBottom: '0.75rem',
                    overflow: 'hidden', position: 'relative',
                    cursor: avatarUploading ? 'wait' : 'pointer',
                  }}
                >
                  {currentAvatar ? (
                    <img src={currentAvatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'
                  )}
                  {avatarUploading ? (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Loader2 size={28} color="#fff" className="animate-spin" />
                    </div>
                  ) : (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      height: '36px', background: 'rgba(0,0,0,0.55)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Camera size={18} color="#fff" />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('change_avatar')}</span>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('full_name')}</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [iconSide]: '1rem', color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    className="glass-input"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    style={inputPadStart}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('email')}</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [iconSide]: '1rem', color: 'var(--text-secondary)' }} />
                  <input
                    type="email"
                    className="glass-input"
                    defaultValue={user.email}
                    disabled
                    style={{ ...inputPadStart, opacity: 0.7 }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={profileSaving} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {profileSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {t('update_profile')}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{t('reset_password')}</h3>
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('new_password')}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [iconSide]: '1rem', color: 'var(--text-secondary)' }} />
                  <input
                    type="password"
                    className="glass-input"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={inputPadStart}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('confirm_new_password')}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [iconSide]: '1rem', color: 'var(--text-secondary)' }} />
                  <input
                    type="password"
                    className="glass-input"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={inputPadStart}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-secondary" disabled={passwordSaving} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {passwordSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {t('save')}
              </button>
            </form>
          </div>

        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
