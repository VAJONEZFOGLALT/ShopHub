import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; email: string; username: string; password?: string }) => Promise<void>;
  currentData: { name: string; email: string; username: string };
}

export function ProfileEditModal({ isOpen, onClose, onSave, currentData }: ProfileEditModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(currentData.name);
  const [email, setEmail] = useState(currentData.email);
  const [username, setUsername] = useState(currentData.username);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        email: email.trim(),
        username: username.trim(),
        password: password.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content profile-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('profile.editAccount')}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form className="profile-edit-form" onSubmit={handleSubmit}>
          {error && <div className="error" style={{ marginBottom: '16px' }}>{error}</div>}

          <div className="form-group">
            <label htmlFor="username">{t('profile.username')}</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <small className="muted">{t('profile.cannotChangeUsername')}</small>
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('profile.email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">{t('profile.fullName')}</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('profile.newPassword')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('profile.leaveBlankToKeep')}
            />
            <small className="muted">{t('profile.passwordHint')}</small>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
