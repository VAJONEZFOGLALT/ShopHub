import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
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
      let message = 'Login failed';
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
          <h2>Login</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {error && <div className="modal-form-error">{error}</div>}

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="modal-form-group">
              <label htmlFor="identifier">Email or username:</label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="email or username"
              />
            </div>

            <div className="modal-form-group">
              <label htmlFor="password">Password:</label>
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
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        <div className="modal-footer">
          Don't have an account? <button type="button" onClick={onSwitchToRegister}>Register here</button>
        </div>
      </div>
    </div>
  );
}
