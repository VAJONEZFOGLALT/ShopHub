import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const roleLabel = user?.role === 'ADMIN' ? '⚡ Admin Account' : '👤 Customer';
  const accountTypeLabel = user?.role === 'ADMIN' ? 'Administrator' : 'Customer';
  const displayName = user?.name || user?.username || '';

  if (!user) {
    return (
      <div className="view">
        <div className="error">Please log in to view your profile</div>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    );
  }

  return (
    <div className="view">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <div className="profile-info">
            <h1>{displayName}</h1>
            <p className="profile-role">{roleLabel}</p>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <h2>Account Information</h2>
            <div className="profile-field">
              <label>Username</label>
              <div className="profile-value">{user.username}</div>
            </div>
            <div className="profile-field">
              <label>Email</label>
              <div className="profile-value">{user.email}</div>
            </div>
            <div className="profile-field">
              <label>Full Name</label>
              <div className="profile-value">{user.name || '—'}</div>
            </div>
            <div className="profile-field">
              <label>Account Type</label>
              <div className="profile-value">{accountTypeLabel}</div>
            </div>
          </div>

          <div className="profile-actions">
            <Link to="/shop/orders" className="btn-primary">View My Orders</Link>
            <Link to="/shop/all" className="btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
