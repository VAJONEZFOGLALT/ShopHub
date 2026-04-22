import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { useWishlist } from '../hooks/useWishlist';
import { getRecentlyViewed } from '../services/storage';
import { getAvatarUrl, getProductImageUrl } from '../utils/imageOptimization';
import { useToast } from '../contexts/ToastContext';
import { COUNTRY_ADDRESS_GROUPS, DEFAULT_COUNTRY_CODE, getCountryAddressConfig } from '../utils/addressing';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { user, updateProfile, setUserData } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const { wishlistIds, handleRemoveWishlist, isWishlistLoading } = useWishlist();
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [recentlyViewedLoading, setRecentlyViewedLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [orderCount, setOrderCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [addressCountry, setAddressCountry] = useState(DEFAULT_COUNTRY_CODE);

  const roleLabel = user?.role === 'ADMIN' ? t('profile.adminAccount') : `👤 ${t('profile.customer')}`;
  const accountTypeLabel = user?.role === 'ADMIN' ? t('profile.administrator') : t('profile.customer');
  const displayName = user?.name || user?.username || '';
  const addressButtonText = addresses.length === 0 ? t('profile.addAddress') : t('profile.updateAddress');
  const isCollectionsLoading = loadingProducts || isWishlistLoading || recentlyViewedLoading;
  const preferredAddress = useMemo(() => {
    if (addresses.length === 0) return null;
    return addresses.find((addr) => addr.isDefault) || addresses[0];
  }, [addresses]);
  const activeCountryConfig = useMemo(
    () => getCountryAddressConfig(addressCountry),
    [addressCountry],
  );

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
        const orders = await api.getUserOrders(user.id).catch(async () => {
          const allOrders = await api.getOrders();
          return allOrders.filter((order: any) => Number(order.userId) === user.id);
        });
        setOrderCount(orders.length);
        const total = orders.reduce((sum: number, order: any) => sum + Number(order.totalPrice ?? order.total ?? 0), 0);
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
      setRecentlyViewedLoading(true);
      if (!user) {
        setRecentlyViewed(getRecentlyViewed());
        setRecentlyViewedLoading(false);
        return;
      }
      try {
        const items = await api.getRecentlyViewed(user.id);
        setRecentlyViewed(items.map((entry: any) => entry.product));
      } catch {
        setRecentlyViewed([]);
      } finally {
        setRecentlyViewedLoading(false);
      }
    };
    load();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setNameInput(user.name || '');
    setEmailInput(user.email || '');
    setUsernameInput(user.username || '');
  }, [user]);

  const wishlistItems = useMemo(() => {
    return products.filter(p => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setSaveMessage(null);
    setOldPasswordInput('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPasswordInput('');
    setOldPasswordInput('');
    if (user) {
      setNameInput(user.name || '');
      setEmailInput(user.email || '');
      setUsernameInput(user.username || '');
    }
  };

  const formatEmailForDisplay = (email: string): { user: string; domain: string } => {
    const atIndex = email.indexOf('@');
    if (atIndex === -1) return { user: email, domain: '' };
    return { user: email.substring(0, atIndex), domain: email.substring(atIndex) };
  };

  const validatePasswordStrength = (pwd: string): string | null => {
    if (pwd.length < 8) return 'Jelszó minimum 8 karakter hosszú kell legyen';
    if (!/[A-Z]/.test(pwd)) return 'Jelszóban kell lennie nagy betűnek';
    if (!/[a-z]/.test(pwd)) return 'Jelszóban kell lennie kis betűnek';
    if (!/[0-9]/.test(pwd)) return 'Jelszóban kell lennie számnak';
    return null;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage(null);
    if (passwordInput.trim() && !oldPasswordInput.trim()) {
      showToast('Az uj jelszohoz meg kell adni a regi jelszot is.', 'error');
      return;
    }
    if (passwordInput.trim()) {
      const error = validatePasswordStrength(passwordInput.trim());
      if (error) {
        showToast(error, 'error');
        return;
      }
    }

    try {
      await updateProfile({
        name: nameInput.trim(),
        email: emailInput.trim(),
        username: usernameInput.trim(),
        password: passwordInput.trim() || undefined,
        oldPassword: passwordInput.trim() ? oldPasswordInput.trim() : undefined,
      });
      setPasswordInput('');
      setOldPasswordInput('');
      setIsEditing(false);
      setSaveMessage('Profil frissitve.');
    } catch (err: any) {
      showToast(err?.message || 'Profile update failed', 'error');
    }
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
            <h1>{user.username || displayName}</h1>
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
            {isCollectionsLoading ? (
              <p className="muted">{t('common.loading')}</p>
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
              <button className="btn-secondary" onClick={handleStartEdit}>{t('common.edit')}</button>
            </div>
            {saveMessage && <div className="success">{saveMessage}</div>}
            <>
              <div className="profile-field">
                <label>{t('profile.username')}</label>
                <div className="profile-value">{user.username}</div>
              </div>
              <div className="profile-field">
                <label>{t('profile.email')} ({formatEmailForDisplay(user.email).domain})</label>
                <div className="profile-value profile-email">{formatEmailForDisplay(user.email).user}</div>
              </div>
              <div className="profile-field">
                <label>{t('profile.fullName')}</label>
                <div className="profile-value profile-fullname">{user.name || '—'}</div>
              </div>
              <div className="profile-field">
                <label>{t('profile.accountType')}</label>
                <div className="profile-value">{accountTypeLabel}</div>
              </div>
            </>
          </div>

          <div className="profile-card profile-address-column">
            <div className="profile-card-header">
              <h2>{t('profile.savedAddresses')}</h2>
              <button className="btn-secondary" onClick={() => {
                setShowAddressModal(true);
                setEditingAddress(null);
                setAddressCountry(DEFAULT_COUNTRY_CODE);
              }}>
                📍 {addressButtonText}
              </button>
            </div>
            {preferredAddress ? (
              <div className="profile-address-preview-card">
                <div className="profile-address-preview-title">
                  <strong>{preferredAddress.label}</strong>
                  {preferredAddress.isDefault && <span className="default-badge">{t('profile.defaultAddress')}</span>}
                </div>
                <div className="profile-address-line address-line-fullname">{preferredAddress.fullName}</div>
                <div className="profile-address-line">{preferredAddress.street}</div>
                <div className="profile-address-line">{preferredAddress.city}, {preferredAddress.state} {preferredAddress.zipCode}</div>
                <div className="profile-address-line">{preferredAddress.country}</div>
                <div className="profile-address-count muted">
                  {addresses.length} {t('profile.savedAddresses').toLowerCase()}
                </div>
              </div>
            ) : (
              <p className="muted">{t('profile.noAddresses')}</p>
            )}
          </div>

          {/* RIGHT: Recently Viewed */}
          <div className="profile-card profile-right">
            <h2>{t('profile.recentlyViewed')}</h2>
            {isCollectionsLoading ? (
              <p className="muted">{t('common.loading')}</p>
            ) : recentlyViewed.length === 0 ? (
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

      {showAddressModal && (
        <div className="modal-overlay" onClick={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}>
          <div className="modal-content address-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="address-modal-header">
              <h3>{t('profile.savedAddresses')}</h3>
              <button className="close-btn" onClick={() => {
                setShowAddressModal(false);
                setEditingAddress(null);
              }}>✕</button>
            </div>

            {!editingAddress && (
              <button className="btn-primary" style={{marginBottom: '16px', width: '100%'}} onClick={() => {
                setEditingAddress({ country: DEFAULT_COUNTRY_CODE });
                setAddressCountry(DEFAULT_COUNTRY_CODE);
              }}>
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
                  fullName: user!.name || user!.username,
                  street: formData.get('street') as string,
                  city: formData.get('city') as string,
                  state: formData.get('state') as string,
                  zipCode: formData.get('zipCode') as string,
                  country: formData.get('country') as string || DEFAULT_COUNTRY_CODE,
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
                <input name="street" placeholder={t('profile.streetAddress')} defaultValue={editingAddress?.street} required />
                <select name="country" value={addressCountry} onChange={(e) => setAddressCountry(e.target.value)}>
                  {COUNTRY_ADDRESS_GROUPS.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                  <input name="city" placeholder={t('profile.city')} defaultValue={editingAddress?.city} required />
                  {activeCountryConfig.regions ? (
                    <select name="state" defaultValue={editingAddress?.state || ''}>
                      <option value="">{`${activeCountryConfig.regionLabel} (${t('profile.optional')})`}</option>
                      {activeCountryConfig.regions.map((region) => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  ) : (
                    <input name="state" placeholder={`${activeCountryConfig.regionLabel} (${t('profile.optional')})`} defaultValue={editingAddress?.state} />
                  )}
                </div>
                <input name="zipCode" placeholder={activeCountryConfig.postalLabel} defaultValue={editingAddress?.zipCode} required />
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
                      <button className="btn-sm" onClick={() => {
                        setEditingAddress(addr);
                        setAddressCountry((addr.country || DEFAULT_COUNTRY_CODE).toUpperCase());
                      }}>{t('common.edit')}</button>
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
        </div>
      )}

      {isEditing && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content profile-edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('profile.editAccount')}</h2>
              <button className="modal-close" onClick={handleCancelEdit}>✕</button>
            </div>
            <form className="profile-edit-form modal-body" onSubmit={handleSaveProfile}>
              <label>
                {t('profile.username')}
                <input value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} maxLength={16} required />
              </label>
              <label>
                {t('profile.email')}
                <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required />
              </label>
              <label>
                {t('profile.fullName')}
                <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
              </label>
              <div className="profile-edit-password-section"></div>
              <label>
                {t('profile.oldPassword')}
                <input type="password" value={oldPasswordInput} onChange={(e) => setOldPasswordInput(e.target.value)} placeholder={t('profile.oldPasswordPlaceholder')} />
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
          </div>
        </div>
      )}
    </div>
  );
}
