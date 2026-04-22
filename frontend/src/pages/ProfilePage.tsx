import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { useWishlist } from '../hooks/useWishlist';
import { getRecentlyViewed } from '../services/storage';
import { getAvatarUrl, getProductImageUrl } from '../utils/imageOptimization';
import { useToast } from '../contexts/ToastContext';

export default function ProfilePage() {
  const { user, updateProfile, setUserData } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const { wishlistIds, handleRemoveWishlist } = useWishlist();
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>(() => getRecentlyViewed());
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [orderCount, setOrderCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const roleLabel = user?.role === 'ADMIN' ? '⚡ Admin Account' : '👤 Customer';
  const accountTypeLabel = user?.role === 'ADMIN' ? 'Administrator' : 'Customer';
  const displayName = user?.name || user?.username || '';

  useEffect(() => {
    const load = async () => {
      setLoadingProducts(true);
      try {
        const data = await api.getProducts();
        setProducts(data);
      } finally {
        setLoadingProducts(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;
      try {
        const orders = await api.getUserOrders(user.id);
        setOrderCount(orders.length);
        const total = orders.reduce((sum: number, order: any) => sum + Number(order.total), 0);
        setTotalSpent(total);
      } catch {
        // Ignore errors
      }
    };
    loadOrders();
  }, [user]);

  useEffect(() => {
    const loadAddresses = async () => {
      if (!user) return;
      try {
        const data = await api.getAddresses(user.id);
        setAddresses(data);
      } catch (err) {
        showToast('Failed to load addresses', 'error');
      }
    };
    loadAddresses();
  }, [user]);



  useEffect(() => {
    const load = async () => {
      if (!user) {
        setRecentlyViewed(getRecentlyViewed());
        return;
      }
      const items = await api.getRecentlyViewed(user.id);
      setRecentlyViewed(items.map((entry: any) => entry.product));
    };
    load();
  }, [user]);

  useEffect(() => {
    if (user) {
      setNameInput(user.name || '');
      setEmailInput(user.email || '');
    }
  }, [user]);

  const wishlistItems = useMemo(() => {
    return products.filter(p => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);



  const handleStartEdit = () => {
    setIsEditing(true);
    setSaveMessage(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPasswordInput('');
    if (user) {
      setNameInput(user.name || '');
      setEmailInput(user.email || '');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage(null);
    await updateProfile({
      name: nameInput.trim(),
      email: emailInput.trim(),
      password: passwordInput.trim() || undefined,
    });
    setPasswordInput('');
    setIsEditing(false);
    setSaveMessage('Profile updated successfully.');
  };

  const handleAvatarUpload = async () => {
    if (!user) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      try {
        setUploadingAvatar(true);
        const updated = await api.uploadUserAvatar(user.id, file);
        const nextUser = {
          id: updated.id,
          email: updated.email,
          username: updated.username,
          name: updated.name,
          role: updated.role,
          avatar: updated.avatar,
        };
        setUserData(nextUser);
      } catch (err) {
        showToast('Failed to upload avatar', 'error');
      } finally {
        setUploadingAvatar(false);
      }
    };
    input.click();
  };

  if (!user) {
    return (
      <div className="view">
        <div className="error">Please log in to view your profile</div>
      </div>
    );
  }

  return (
    <div className="view">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {user.avatar ? (
                <img src={getAvatarUrl(user.avatar)} alt={displayName} loading="lazy" />
              ) : (
                <span>👤</span>
              )}
            </div>
            <button 
              className="avatar-upload-btn" 
              onClick={handleAvatarUpload}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? '...' : '📷'}
            </button>
          </div>
          <div className="profile-info">
            <h1>{displayName}</h1>
            <p className="profile-role">{roleLabel}</p>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-main">
          <div className="profile-card">
            <div className="profile-card-header">
              <h2>Account Information</h2>
              {!isEditing && (
                <button className="btn-secondary" onClick={handleStartEdit}>Edit</button>
              )}
            </div>
            {saveMessage && <div className="success">{saveMessage}</div>}
            {isEditing ? (
              <form className="profile-edit-form" onSubmit={handleSaveProfile}>
                <label>
                  Email
                  <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
                </label>
                <label>
                  Full Name
                  <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
                </label>
                <label>
                  New Password
                  <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Leave blank to keep" />
                </label>
                <div className="profile-edit-actions">
                  <button type="button" className="btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                  <button type="submit" className="btn-primary">Save</button>
                </div>
              </form>
            ) : (
              <>
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
              </>
            )}
          </div>

          <div className="profile-card">
            <h2>Wishlist</h2>
            {loadingProducts ? (
              <p className="muted">Loading wishlist…</p>
            ) : wishlistItems.length === 0 ? (
              <p className="muted">Your wishlist is empty.</p>
            ) : (
              <div className="profile-grid">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="profile-product">
                    <div className="profile-product-info" onClick={() => navigate(`/shop/product/${item.id}`)}>
                      {item.image ? (
                        <img src={getProductImageUrl(item.image)} alt={item.name} loading="lazy" />
                      ) : (
                        <div className="profile-product-placeholder">{item.name}</div>
                      )}
                      <div>
                        <strong>{item.name}</strong>
                        <div className="muted">${Number(item.price).toFixed(2)}</div>
                      </div>
                    </div>
                    <button className="btn-secondary" onClick={() => handleRemoveWishlist(item.id, item.name)}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="profile-card">
            <h2>Recently Viewed</h2>
            {recentlyViewed.length === 0 ? (
              <p className="muted">No recently viewed products yet.</p>
            ) : (
              <div className="profile-grid">
                {recentlyViewed.map((item: any) => (
                  <div key={item.id} className="profile-product" onClick={() => navigate(`/shop/product/${item.id}`)}>
                    <div className="profile-product-info">
                      {item.image ? (
                        <img src={getProductImageUrl(item.image)} alt={item.name} loading="lazy" />
                      ) : (
                        <div className="profile-product-placeholder">{item.name}</div>
                      )}
                      <div>
                        <strong>{item.name}</strong>
                        <div className="muted">${Number(item.price).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="profile-card">
            <div className="profile-card-header">
              <h2>Saved Addresses</h2>
              <button className="btn-secondary" onClick={() => { setEditingAddress(null); setShowAddressForm(!showAddressForm); }}>
                {showAddressForm ? 'Cancel' : '+ Add Address'}
              </button>
            </div>
            {showAddressForm && (
              <form className="address-form" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  userId: user!.id,
                  label: formData.get('label') as string,
                  fullName: formData.get('fullName') as string,
                  street: formData.get('street') as string,
                  city: formData.get('city') as string,
                  state: formData.get('state') as string,
                  zipCode: formData.get('zipCode') as string,
                  country: formData.get('country') as string || 'USA',
                  isDefault: formData.get('isDefault') === 'on',
                };
                try {
                  if (editingAddress) {
                    await api.updateAddress(editingAddress.id, data);
                  } else {
                    await api.createAddress(data);
                  }
                  const updated = await api.getAddresses(user!.id);
                  setAddresses(updated);
                  setShowAddressForm(false);
                  setEditingAddress(null);
                } catch (err) {
                  showToast('Failed to save address', 'error');
                }
              }}>
                <input name="label" placeholder="Label (e.g., Home, Work)" defaultValue={editingAddress?.label} required />
                <input name="fullName" placeholder="Full Name" defaultValue={editingAddress?.fullName} required />
                <input name="street" placeholder="Street Address" defaultValue={editingAddress?.street} required />
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                  <input name="city" placeholder="City" defaultValue={editingAddress?.city} required />
                  <input name="state" placeholder="State" defaultValue={editingAddress?.state} required />
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                  <input name="zipCode" placeholder="ZIP Code" defaultValue={editingAddress?.zipCode} required />
                  <input name="country" placeholder="Country" defaultValue={editingAddress?.country || 'USA'} />
                </div>
                <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input type="checkbox" name="isDefault" defaultChecked={editingAddress?.isDefault} />
                  Set as default address
                </label>
                <button type="submit" className="btn-primary">{editingAddress ? 'Update' : 'Save'} Address</button>
              </form>
            )}
            {addresses.length === 0 ? (
              <p className="muted">No saved addresses yet.</p>
            ) : (
              <div className="addresses-list">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`address-item ${addr.isDefault ? 'default' : ''}`}>
                    <div className="address-content">
                      <div className="address-header">
                        <strong>{addr.label}</strong>
                        {addr.isDefault && <span className="default-badge">Default</span>}
                      </div>
                      <div>{addr.fullName}</div>
                      <div>{addr.street}</div>
                      <div>{addr.city}, {addr.state} {addr.zipCode}</div>
                      <div>{addr.country}</div>
                    </div>
                    <div className="address-actions">
                      <button onClick={() => { setEditingAddress(addr); setShowAddressForm(true); }}>Edit</button>
                      <button onClick={async () => {
                        await api.deleteAddress(addr.id);
                        const updated = await api.getAddresses(user!.id);
                        setAddresses(updated);
                      }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="profile-actions">
            <Link to="/shop/orders" className="btn-primary">View My Orders</Link>
            <Link to="/shop/all" className="btn-secondary">Continue Shopping</Link>
          </div>
        </div>

          <div className="profile-sidebar">
            <div className="profile-card">
              <h2>Quick Stats</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <div className="stat-value">{orderCount}</div>
                    <div className="stat-label">Total Orders</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <div className="stat-value">${totalSpent.toFixed(2)}</div>
                    <div className="stat-label">Total Spent</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">❤️</div>
                  <div className="stat-info">
                    <div className="stat-value">{wishlistItems.length}</div>
                    <div className="stat-label">Wishlist Items</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">👁️</div>
                  <div className="stat-info">
                    <div className="stat-value">{recentlyViewed.length}</div>
                    <div className="stat-label">Recently Viewed</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-card">
              <h2>Quick Links</h2>
              <div className="quick-links">
                <Link to="/shop/orders" className="quick-link">
                  <span className="quick-link-icon">📋</span>
                  <div>
                    <div className="quick-link-title">My Orders</div>
                    <div className="quick-link-desc">Track your purchases</div>
                  </div>
                </Link>
                <Link to="/shop/all" className="quick-link">
                  <span className="quick-link-icon">🛍️</span>
                  <div>
                    <div className="quick-link-title">Shop</div>
                    <div className="quick-link-desc">Browse products</div>
                  </div>
                </Link>
                <Link to="/shop/checkout" className="quick-link">
                  <span className="quick-link-icon">🛒</span>
                  <div>
                    <div className="quick-link-title">Cart</div>
                    <div className="quick-link-desc">View your cart</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
