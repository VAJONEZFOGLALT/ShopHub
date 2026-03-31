import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { useWishlist } from '../hooks/useWishlist';
import { getRecentlyViewed } from '../services/storage';
import { getAvatarUrl, getProductImageUrl } from '../utils/imageOptimization';
import { useToast } from '../contexts/ToastContext';
import { ProfileEditModal } from '../components/profile/ProfileEditModal';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { user, updateProfile, setUserData } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const { wishlistIds, handleRemoveWishlist } = useWishlist();
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>(() => getRecentlyViewed());
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
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

  const wishlistItems = useMemo(() => {
    return products.filter(p => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  const handleStartEdit = () => {
    setEditModalOpen(true);
  };

  const handleSaveProfile = async (data: { name: string; email: string; username: string; password?: string }) => {
    await updateProfile({
      name: data.name,
      email: data.email,
      password: data.password || undefined,
    });
    showToast('Profile updated successfully', 'success');
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
          
          <div className="profile-header-stats">
            <div className="header-stat">
              <span className="header-stat-icon">📦</span>
              <div>
                <div className="header-stat-value">{orderCount}</div>
                <div className="header-stat-label">{t('profile.totalOrders')}</div>
              </div>
            </div>
            <div className="header-stat">
              <span className="header-stat-icon">💰</span>
              <div>
                <div className="header-stat-value">${totalSpent.toFixed(2)}</div>
                <div className="header-stat-label">{t('profile.totalSpent')}</div>
              </div>
            </div>
            <div className="header-stat">
              <span className="header-stat-icon">❤️</span>
              <div>
                <div className="header-stat-value">{wishlistItems.length}</div>
                <div className="header-stat-label">{t('profile.wishlistItems')}</div>
              </div>
            </div>
            <div className="header-stat">
              <span className="header-stat-icon">👁️</span>
              <div>
                <div className="header-stat-value">{recentlyViewed.length}</div>
                <div className="header-stat-label">{t('profile.recentlyViewedCount')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          {/* LEFT: Wishlist */}
          <div className="profile-card profile-left">
            <h2>{t('profile.wishlist')}</h2>
            {loadingProducts ? (
              <p className="muted">{t('profile.loadingWishlist')}</p>
            ) : wishlistItems.length === 0 ? (
              <p className="muted">{t('profile.emptyWishlist')}</p>
            ) : (
              <div className="profile-product-list">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="profile-product-mini">
                    <div className="profile-product-mini-img" onClick={() => navigate(`/shop/product/${item.id}`)}>
                      {item.image ? (
                        <img src={getProductImageUrl(item.image)} alt={item.name} loading="lazy" />
                      ) : (
                        <div className="profile-product-placeholder-mini">{item.name}</div>
                      )}
                    </div>
                    <div className="profile-product-mini-info">
                      <strong onClick={() => navigate(`/shop/product/${item.id}`)} style={{cursor: 'pointer'}}>{item.name}</strong>
                      <div className="muted">${Number(item.price).toFixed(2)}</div>
                      <button className="btn-delete" onClick={() => handleRemoveWishlist(item.id, item.name)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CENTER: Account Info */}
          <div className="profile-card profile-center">
            <div className="profile-card-header">
              <h2>{t('profile.accountInfo')}</h2>
              <div style={{display: 'flex', gap: '8px'}}>
                <button className="btn-secondary" onClick={handleStartEdit}>{t('common.edit')}</button>
                <button className="btn-secondary" onClick={() => setShowAddressModal(!showAddressModal)}>
                  📍 {t('profile.savedAddresses')}
                </button>
              </div>
            </div>
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

            {/* Address Modal - Collapsible */}
            {showAddressModal && (
              <div className="address-modal">
                <div className="address-modal-header">
                  <h3>{t('profile.savedAddresses')}</h3>
                  <button className="close-btn" onClick={() => {
                    setShowAddressModal(false);
                    setEditingAddress(null);
                  }}>✕</button>
                </div>
                
                {!editingAddress && (
                  <button className="btn-primary" style={{marginBottom: '16px', width: '100%'}} onClick={() => setEditingAddress({})} >
                    + {t('profile.addAddress')}
                  </button>
                )}

                {editingAddress !== null && (
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
                      if (editingAddress.id) {
                        await api.updateAddress(editingAddress.id, data);
                      } else {
                        await api.createAddress(data);
                      }
                      const updated = await api.getAddresses(user!.id);
                      setAddresses(updated);
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
                      <input name="country" placeholder={t('profile.country')} defaultValue={editingAddress?.country || 'USA'} />
                    </div>
                    <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <input type="checkbox" name="isDefault" defaultChecked={editingAddress?.isDefault} />
                      {t('profile.setAsDefault')}
                    </label>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button type="submit" className="btn-primary" style={{flex: 1}}>{editingAddress.id ? t('profile.updateAddress') : t('profile.saveAddress')}</button>
                      <button type="button" className="btn-secondary" style={{flex: 1}} onClick={() => setEditingAddress(null)}>{t('common.cancel')}</button>
                    </div>
                  </form>
                )}

                {addresses.length === 0 ? (
                  <p className="muted" style={{textAlign: 'center', padding: '20px'}}>{t('profile.noAddresses')}</p>
                ) : (
                  <div className="addresses-modal-list">
                    {addresses.map((addr) => (
                      <div key={addr.id} className={`address-modal-item ${addr.isDefault ? 'default' : ''}`}>
                        <div className="address-modal-content">
                          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                            <strong>{addr.label}</strong>
                            {addr.isDefault && <span className="default-badge">{t('profile.defaultAddress')}</span>}
                          </div>
                          <div style={{fontSize: '0.9em', color: 'var(--text-secondary)', lineHeight: '1.4'}}>
                            <div>{addr.fullName}</div>
                            <div>{addr.street}</div>
                            <div>{addr.city}, {addr.state} {addr.zipCode}</div>
                            <div>{addr.country}</div>
                          </div>
                        </div>
                        <div style={{display: 'flex', gap: '6px'}}>
                          <button className="btn-sm" onClick={() => setEditingAddress(addr)}>{t('common.edit')}</button>
                          <button className="btn-sm danger" onClick={async () => {
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
            )}
          </div>

          {/* RIGHT: Recently Viewed */}
          <div className="profile-card profile-right">
            <h2>{t('profile.recentlyViewed')}</h2>
            {recentlyViewed.length === 0 ? (
              <p className="muted">{t('profile.noRecentlyViewed')}</p>
            ) : (
              <div className="profile-product-list">
                {recentlyViewed.map((item: any) => (
                  <div key={item.id} className="profile-product-mini">
                    <div className="profile-product-mini-img" onClick={() => navigate(`/shop/product/${item.id}`)}>
                      {item.image ? (
                        <img src={getProductImageUrl(item.image)} alt={item.name} loading="lazy" />
                      ) : (
                        <div className="profile-product-placeholder-mini">{item.name}</div>
                      )}
                    </div>
                    <div className="profile-product-mini-info">
                      <strong onClick={() => navigate(`/shop/product/${item.id}`)} style={{cursor: 'pointer'}}>{item.name}</strong>
                      <div className="muted">${Number(item.price).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER: Actions */}
        <div className="profile-actions">
          <Link to="/shop/orders" className="btn-primary">{t('profile.viewMyOrders')}</Link>
          <Link to="/shop/all" className="btn-secondary">{t('profile.continueShopping')}</Link>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveProfile}
        currentData={{
          name: user?.name || '',
          email: user?.email || '',
          username: user?.username || '',
        }}
      />
    </div>
  );
}
