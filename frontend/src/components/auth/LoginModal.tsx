import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const { t } = useTranslation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const currentIdentifier = identifier;
      const currentPassword = password;
      await login(currentIdentifier, currentPassword);
      onClose();
      navigate('/shop');
    } catch (err) {
      let message = t('auth.loginFailed');
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const api = await import('../../services/api');
        message = api.getApiErrorMessage(err, t('auth.loginFailed'));
      } catch {
        if (err instanceof Error) message = err.message;
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
          <h2>{t('auth.loginTitle')}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {error && <div className="modal-form-error">{error}</div>}

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="modal-form-group">
              <label htmlFor="identifier">{t('auth.emailOrUsername')}:</label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder={t('auth.emailOrUsername')}
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

            <button type="submit" disabled={isLoading} className="modal-form-button">
              {isLoading ? t('auth.loggingIn') : t('auth.loginButton')}
            </button>
          </form>
        </div>

        <div className="modal-footer">
          {t('auth.noAccount')} <button type="button" onClick={onSwitchToRegister}>{t('auth.registerHere')}</button>
        </div>
      </div>
    </div>
  );
}
