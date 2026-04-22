import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const currentPassword = password;
    const currentConfirm = confirmPassword;
    if (currentPassword !== currentConfirm) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }

    if (currentPassword.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    setIsLoading(true);

    try {
      const currentEmail = email;
      const currentUsername = username;
      await register(currentEmail, currentPassword, currentUsername, currentUsername);
      onClose();
      navigate('/shop');
    } catch (err) {
      let message = t('auth.registrationFailed');
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('auth.createAccount')}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {error && <div className="modal-form-error">{error}</div>}

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="modal-form-group">
              <label htmlFor="username">{t('auth.username')}:</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder={t('auth.username')}
              />
            </div>

            <div className="modal-form-group">
              <label htmlFor="email">{t('auth.email')}:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
              />
            </div>

            <div className="modal-form-group">
              <label htmlFor="password">{t('auth.password')}:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <div className="modal-form-group">
              <label htmlFor="confirmPassword">{t('auth.confirmPassword')}:</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={isLoading} className="modal-form-button">
              {isLoading ? t('auth.creatingAccount') : t('auth.registerButton')}
            </button>
          </form>
        </div>

        <div className="modal-footer">
          {t('auth.haveAccount')} <button type="button" onClick={onSwitchToLogin}>{t('auth.loginHere')}</button>
        </div>
      </div>
    </div>
  );
}
