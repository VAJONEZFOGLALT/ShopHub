import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { useWishlist } from '../../hooks/useWishlist';
import { getRecentlyViewed } from '../../services/storage';
import { getAvatarUrl, getProductImageUrl } from '../../utils/imageOptimization';
import { useToast } from '../../contexts/ToastContext';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
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

  const roleLabel = user?.role === 'ADMIN' ? t('profile.adminAccount') : `👤 ${t('profile.customer')}`;
  const accountTypeLabel = user?.role === 'ADMIN' ? t('profile.administrator') : t('profile.customer');
  const displayName = user?.name || user?.username || '';

  useEffect(() => {
    const load = async () => {
      setLoadingProducts(true);
      try {
        const data = await api.getProducts(i18n.language);
        setProducts(data);
      } finally {
        setLoadingProducts(false);
      }
    };
    load();
  }, [i18n.language]);

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
        showToast('Nem sikerült betölteni a címeket', 'error');
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
    setSaveMessage('A profil sikeresen frissült.');
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
        showToast('Nem sikerült feltölteni a profilképet', 'error');
      } finally {
        setUploadingAvatar(false);
      }
    };
    input.click();
  };

  if (!user) {
    return (
      <div className="view">
        <div className="error">{t('profile.loginRequired')}</div>
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
              <h2>{t('profile.accountInfo')}</h2>
              {!isEditing && (
                <button className="btn-secondary" onClick={handleStartEdit}>{t('common.edit')}</button>
              )}
            </div>
            {saveMessage && <div className="success">{t('profile.profileUpdatedSuccessfully')}</div>}
            {isEditing ? (
              <form className="profile-edit-form" onSubmit={handleSaveProfile}>
                <label>
                  {t('profile.email')}
                  <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
                </label>
                <label>
                  {t('profile.fullName')}
                  <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
                </label>
                <label>
                  {t('profile.newPassword')}
                  <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder={t('profile.leaveBlank')} />
                </label>
                <div className="profile-edit-actions">
                  <button type="button" className="btn-secondary" onClick={handleCancelEdit}>{t('common.cancel')}</button>
                  <button type="submit" className="btn-primary">{t('common.save')}</button>
                </div>
              </form>
            ) : (
              <>
            <div className="profile-field">
              <label>{t('profile.username')}</label>
              <div className="profile-value">{user.username}</div>
            </div>
            <div className="profile-field">
              <label>{t('profile.email')}</label>
              <div className="profile-value">{user.email}</div>
            </div>
            <div className="profile-field">
              <label>{t('profile.fullName')}</label>
              <div className="profile-value">{user.name || '—'}</div>
            </div>
            <div className="profile-field">
              <label>{t('profile.accountType')}</label>
              <div className="profile-value">{accountTypeLabel}</div>
            </div>
              </>
            )}
          </div>

          <div className="profile-card">
            <h2>{t('profile.wishlist')}</h2>
            {loadingProducts ? (
              <p className="muted">{t('profile.loadingWishlist')}</p>
            ) : wishlistItems.length === 0 ? (
              <p className="muted">{t('profile.emptyWishlist')}</p>
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
                    <button className="btn-secondary" onClick={() => handleRemoveWishlist(item.id, item.name)}>{t('common.delete')}</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="profile-card">
            <h2>{t('profile.recentlyViewed')}</h2>
            {recentlyViewed.length === 0 ? (
              <p className="muted">{t('profile.noRecentlyViewed')}</p>
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
              <h2>{t('profile.savedAddresses')}</h2>
              <button className="btn-secondary" onClick={() => { setEditingAddress(null); setShowAddressForm(!showAddressForm); }}>
                {showAddressForm ? t('common.cancel') : `+ ${t('profile.addAddress')}`}
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
                  showToast(t('profile.failedToSaveAddress'), 'error');
                }
              }}>
                <input name="label" placeholder={t('profile.labelPlaceholder')} defaultValue={editingAddress?.label} required />
                <input name="fullName" placeholder={t('profile.fullName')} defaultValue={editingAddress?.fullName} required />
                <input name="street" placeholder={t('profile.streetAddress')} defaultValue={editingAddress?.street} required />
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                  <input name="city" placeholder={t('profile.city')} defaultValue={editingAddress?.city} required />
                  <input name="state" placeholder={t('profile.state')} defaultValue={editingAddress?.state} required />
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                  <input name="zipCode" placeholder={t('profile.zipCode')} defaultValue={editingAddress?.zipCode} required />
                  <input name="country" placeholder={t('profile.country')} defaultValue={editingAddress?.country || 'Magyarország'} />
                </div>
                <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input type="checkbox" name="isDefault" defaultChecked={editingAddress?.isDefault} />
                  {t('profile.setAsDefault')}
                </label>
                <button type="submit" className="btn-primary">{editingAddress ? t('profile.updateAddress') : t('profile.saveAddress')}</button>
              </form>
            )}
            {addresses.length === 0 ? (
              <p className="muted">{t('profile.noAddresses')}</p>
            ) : (
              <div className="addresses-list">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`address-item ${addr.isDefault ? 'default' : ''}`}>
                    <div className="address-content">
                      <div className="address-header">
                        <strong>{addr.label}</strong>
                        {addr.isDefault && <span className="default-badge">{t('profile.defaultAddress')}</span>}
                      </div>
                      <div>{addr.fullName}</div>
                      <div>{addr.street}</div>
                      <div>{addr.city}, {addr.state} {addr.zipCode}</div>
                      <div>{addr.country}</div>
                    </div>
                    <div className="address-actions">
                      <button onClick={() => { setEditingAddress(addr); setShowAddressForm(true); }}>{t('common.edit')}</button>
                      <button onClick={async () => {
                        await api.deleteAddress(addr.id);
                        const updated = await api.getAddresses(user!.id);
                        setAddresses(updated);
                      }}>{t('common.delete')}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="profile-actions">
            <Link to="/shop/orders" className="btn-primary">{t('profile.viewMyOrders')}</Link>
            <Link to="/shop/all" className="btn-secondary">{t('profile.continueShopping')}</Link>
          </div>
        </div>

          <div className="profile-sidebar">
            <div className="profile-card">
              <h2>{t('profile.quickStats')}</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <div className="stat-value">{orderCount}</div>
                    <div className="stat-label">{t('profile.totalOrders')}</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <div className="stat-value">${totalSpent.toFixed(2)}</div>
                    <div className="stat-label">{t('profile.totalSpent')}</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">❤️</div>
                  <div className="stat-info">
                    <div className="stat-value">{wishlistItems.length}</div>
                    <div className="stat-label">{t('profile.wishlistItems')}</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">👁️</div>
                  <div className="stat-info">
                    <div className="stat-value">{recentlyViewed.length}</div>
                    <div className="stat-label">{t('profile.recentlyViewedCount')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-card">
              <h2>{t('profile.quickLinks')}</h2>
              <div className="quick-links">
                <Link to="/shop/orders" className="quick-link">
                  <span className="quick-link-icon">📋</span>
                  <div>
                    <div className="quick-link-title">{t('profile.myOrders')}</div>
                    <div className="quick-link-desc">{t('profile.trackPurchases')}</div>
                  </div>
                </Link>
                <Link to="/shop/all" className="quick-link">
                  <span className="quick-link-icon">🛍️</span>
                  <div>
                    <div className="quick-link-title">{t('profile.shop')}</div>
                    <div className="quick-link-desc">{t('profile.browseProducts')}</div>
                  </div>
                </Link>
                <Link to="/shop/checkout" className="quick-link">
                  <span className="quick-link-icon">🛒</span>
                  <div>
                    <div className="quick-link-title">{t('profile.cart')}</div>
                    <div className="quick-link-desc">{t('profile.viewCart')}</div>
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
