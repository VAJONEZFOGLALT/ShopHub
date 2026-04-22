import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { api } from '../services/api';
import { COUNTRY_ADDRESS_CONFIGS, DEFAULT_COUNTRY_CODE, formatAddressSingleLine, getCountryAddressConfig } from '../utils/addressing';

declare global {
  interface Window {
    Packeta?: {
      Widget?: {
        pick: (
          apiKey: string,
          callback: (point: any) => void,
          options?: Record<string, unknown>
        ) => void;
      };
    };
  }
}

const couriers: CourierOption[] = [
  { id: 'UPS', name: 'UPS Express (hazhoz)', price: 15.99, days: '1-2 nap', type: 'address' },
  { id: 'INPOST', name: 'Magyar Posta (hazhoz)', price: 6.99, days: '2-4 nap', type: 'address' },
  { id: 'PACKETA', name: 'Packeta (atvevo pont / Z-BOX)', price: 4.99, days: '2-3 nap', type: 'pickup' },
  { id: 'DPD', name: 'DPD Pickup (atvevo pont)', price: 5.99, days: '1-2 nap', type: 'pickup' },
];

const DPD_PICKUP_POINTS: Array<{ code: string; name: string; city: string; address: string }> = [
  { code: 'DPD-BUD-001', name: 'DPD Pickup - Corvin', city: 'Budapest', address: 'Futou. 1' },
  { code: 'DPD-BUD-002', name: 'DPD Pickup - Westend', city: 'Budapest', address: 'Vaci ut 1-3' },
  { code: 'DPD-BUD-003', name: 'DPD Pickup - Allee', city: 'Budapest', address: 'Oktober 23. ut 8-10' },
  { code: 'DPD-DEP-001', name: 'DPD Pickup - Debrecen Plaza', city: 'Debrecen', address: 'Pesti ut 2' },
  { code: 'DPD-GYO-001', name: 'DPD Pickup - Arpad', city: 'Gyor', address: 'Arpad ut 35' },
  { code: 'DPD-SZE-001', name: 'DPD Pickup - Belvaros', city: 'Szeged', address: 'Kossuth Lajos sgt. 14' },
  { code: 'DPD-PEC-001', name: 'DPD Pickup - Kiraly', city: 'Pecs', address: 'Kossuth ter 3' },
  { code: 'DPD-MIS-001', name: 'DPD Pickup - Szinvapark', city: 'Miskolc', address: 'Bajcsy-Zsilinszky ut 2-4' },
];

type CourierOption = {
  id: 'UPS' | 'DPD' | 'PACKETA' | 'INPOST';
  name: string;
  price: number;
  days: string;
  type: 'address' | 'pickup';
};

type GuestAddressDraft = {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};


export default function CheckoutPage({ onSuccess }: { onSuccess?: (id: number) => void }) {
  const { t } = useTranslation();
  const { items, remove, clear, total } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [courier, setCourier] = useState<CourierOption['id']>('UPS');
  const [packetaReady, setPacketaReady] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddr, setSelectedAddr] = useState<number | null>(null);
  const [pickupPointLabel, setPickupPointLabel] = useState('');
  const [pickupPointCode, setPickupPointCode] = useState('');
  const [dpdPickerOpen, setDpdPickerOpen] = useState(false);
  const [dpdSearch, setDpdSearch] = useState('');
  const [guestAddress, setGuestAddress] = useState<GuestAddressDraft>({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: DEFAULT_COUNTRY_CODE,
  });
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedCourier = couriers.find((c) => c.id === courier) || couriers[0];
  const hasItems = items.length > 0;
  const emptyCheckout = !hasItems;
  const needsPickup = selectedCourier.type === 'pickup';
  const needsAddress = selectedCourier.type === 'address';
  const guestCountryConfig = getCountryAddressConfig(guestAddress.country);

  useEffect(() => {
    if (user) {
      api.getAddresses(user.id).then((data) => {
        setAddresses(data);
        const preferred = data.find((a: any) => a.isDefault) || data[0];
        setSelectedAddr(preferred?.id ?? null);
      }).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    setPickupPointLabel('');
    setPickupPointCode('');
    setDpdPickerOpen(false);
    setDpdSearch('');
  }, [courier]);

  useEffect(() => {
    const existing = document.querySelector('script[data-packeta-widget="1"]') as HTMLScriptElement | null;
    if (existing) {
      setPacketaReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://widget.packeta.com/v6/www/js/library.js';
    script.async = true;
    script.setAttribute('data-packeta-widget', '1');
    script.onload = () => setPacketaReady(true);
    script.onerror = () => setPacketaReady(false);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!hasItems) {
      setError(t('cart.empty'));
      return;
    }
    setError('');
  }, [hasItems, t]);

  const handlePickPacketaPoint = () => {
    const apiKey = import.meta.env.VITE_PACKETA_API_KEY || '';

    if (!apiKey) {
      setError('Hianyzik a VITE_PACKETA_API_KEY, add meg .env-ben.');
      return;
    }

    if (!window.Packeta?.Widget?.pick) {
      setError('A Packeta widget nem toltheto be most.');
      return;
    }

    window.Packeta.Widget.pick(
      apiKey,
      (point: any) => {
        if (!point) return;
        const label = [point.name, point.city, point.street].filter(Boolean).join(', ');
        setPickupPointLabel(label);
        setPickupPointCode(String(point.id || point.code || 'PACKETA-POINT'));
      },
      {
        language: 'hu',
        country: 'hu',
      }
    );
  };

  const filteredDpdPoints = DPD_PICKUP_POINTS.filter((point) => {
    const q = dpdSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      point.code.toLowerCase().includes(q)
      || point.name.toLowerCase().includes(q)
      || point.city.toLowerCase().includes(q)
      || point.address.toLowerCase().includes(q)
    );
  });

  const handleSelectDpdPoint = (point: { code: string; name: string; city: string; address: string }) => {
    setPickupPointCode(point.code);
    setPickupPointLabel(`${point.name}, ${point.city}, ${point.address}`);
    setDpdPickerOpen(false);
  };

  const validateGuestAddress = () => {
    if (user) return true;
    const requiredFields: Array<keyof GuestAddressDraft> = ['fullName', 'street', 'city', 'state', 'zipCode', 'country'];
    const missing = requiredFields.some((field) => !guestAddress[field]?.trim());
    return !missing;
  };

  const ship = selectedCourier.price;
  const finalTotal = total + ship;

  const handleOrder = async () => {
    setLoading(true);
    setError('');
    try {
      if (!hasItems) {
        setError(t('cart.empty'));
        return;
      }

      if (needsPickup && !pickupPointLabel.trim()) {
        setError('Valassz atvevo pontot/boxot a kivalasztott futarhoz.');
        return;
      }

      if (needsAddress && user && !selectedAddr) {
        setError('Valassz szallitasi cimet.');
        return;
      }

      if (needsAddress && !validateGuestAddress()) {
        setError('Toltsd ki a szallitasi cim kotelezo mezoit.');
        return;
      }

      let userId: number;
      if (user?.id) {
        userId = user.id;
      } else {
        const u = await api.createUser(newUser);
        userId = u.id;
      }

      const orderItems = items.map(i => ({ productId: i.productId, quantity: i.quantity }));
      const selectedAddress = addresses.find(a => a.id === selectedAddr);
      const shipping = needsPickup
        ? `PICKUP | ${courier} | ${pickupPointCode || 'N/A'} | ${pickupPointLabel}`
        : `ADDRESS | ${courier} | ${formatAddressSingleLine(user ? selectedAddress || {} : guestAddress)}`;

      const order = await api.createOrder({ userId, items: orderItems, courier, shippingAddress: shipping });
      if (order.emailStatus && !order.emailStatus.emailSent) {
        const reason = order.emailStatus.reason || 'Unknown email delivery issue';
        showToast(`Az email nem ment ki: ${reason}`, 'warning');
      }
      clear();
      onSuccess?.(order.id);
      navigate('/shop/confirmation');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-wrapper">
      <div className={`checkout-container ${hasItems ? '' : 'checkout-container-empty'}`.trim()}>
        <div className="checkout-main">
          <h2>{t('checkout.title')}</h2>
          {error && (
            <div className={emptyCheckout ? 'checkout-empty-banner' : 'error'}>
              {emptyCheckout && <span className="checkout-empty-banner-icon">!</span>}
              <span>{error}</span>
            </div>
          )}

          {!hasItems ? (
            <div className="empty-checkout">
              <div className="empty-state">
                <p style={{ fontSize: '4em', margin: '0 0 16px 0' }}>🛒</p>
                <h3>{t('cart.empty')}</h3>
                <p className="muted">Tegyél legalább egy terméket a kosárba a rendelés folytatásához.</p>
                <div className="empty-checkout-actions">
                  <button
                    className="btn-primary"
                    onClick={() => navigate('/shop/all')}
                  >
                    {t('profile.continueShopping')}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => navigate('/shop')}
                  >
                    {t('common.home')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="checkout-section">
                <h3>{t('checkout.items')} ({items.length})</h3>
                {items.map(it => (
                  <div key={it.productId} className="checkout-item">
                    <div className="checkout-item-info">
                      <strong>{it.name}</strong> x {it.quantity}
                      <span>${(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                    <button className="btn-text" onClick={() => remove(it.productId)}>{t('checkout.remove')}</button>
                  </div>
                ))}
              </div>

              <div className="checkout-section">
                <h3>{t('checkout.delivery')}</h3>
                {couriers.map(c => (
                  <label key={c.id} style={{ display: 'flex', gap: '10px', margin: '10px 0', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px' }}>
                    <input
                      type="radio"
                      value={c.id}
                      checked={courier === c.id}
                      onChange={e => {
                        setCourier(e.target.value as CourierOption['id']);
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div><strong>{c.name}</strong> - ${c.price.toFixed(2)}</div>
                      <div className="muted" style={{ fontSize: '0.9em' }}>{c.days}</div>
                    </div>
                  </label>
                ))}

                {needsPickup && courier === 'PACKETA' && (
                  <div className="courier-picker-box">
                    <button className="btn-secondary" onClick={handlePickPacketaPoint} disabled={!packetaReady}>
                      {packetaReady ? 'Packeta pont valasztasa' : 'Packeta betoltese...'}
                    </button>
                    {pickupPointLabel && <p className="muted" style={{ marginTop: '8px' }}>📍 {pickupPointLabel}</p>}
                  </div>
                )}

                {needsPickup && courier === 'DPD' && (
                  <div className="courier-picker-box">
                    <button className="btn-secondary" onClick={() => setDpdPickerOpen(true)}>
                      DPD atvevo pont valasztasa
                    </button>
                    {pickupPointLabel && <p className="muted" style={{ marginTop: '8px' }}>📍 {pickupPointLabel}</p>}
                  </div>
                )}
              </div>

              {needsPickup && courier === 'DPD' && dpdPickerOpen && (
                <div className="modal-overlay" onClick={() => setDpdPickerOpen(false)}>
                  <div className="modal-content" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h2>DPD atvevo pont valaszto</h2>
                      <button className="modal-close" onClick={() => setDpdPickerOpen(false)}>✕</button>
                    </div>
                    <div className="modal-body" style={{ display: 'grid', gap: '12px' }}>
                      <input
                        value={dpdSearch}
                        onChange={(e) => setDpdSearch(e.target.value)}
                        placeholder="Kereses kodra, varosra vagy cimre"
                        className="filter-search"
                      />
                      <div style={{ display: 'grid', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
                        {filteredDpdPoints.map((point) => (
                          <button
                            key={point.code}
                            type="button"
                            className="btn-secondary"
                            style={{ textAlign: 'left' }}
                            onClick={() => handleSelectDpdPoint(point)}
                          >
                            <strong>{point.name}</strong><br />
                            {point.city}, {point.address} ({point.code})
                          </button>
                        ))}
                        {filteredDpdPoints.length === 0 && (
                          <p className="muted">Nincs talalat a megadott keresessel.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {needsAddress && user && addresses.length > 0 && (
                <div className="checkout-section">
                  <h3>{t('checkout.address')}</h3>
                  {addresses.map(a => (
                    <label key={a.id} style={{ display: 'flex', gap: '10px', margin: '10px 0', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px' }}>
                      <input type="radio" checked={selectedAddr === a.id} onChange={() => setSelectedAddr(a.id)} />
                      <div>
                        <strong>{a.label}</strong><br />
                        {formatAddressSingleLine(a)}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {needsAddress && user && addresses.length === 0 && (
                <div className="checkout-section">
                  <h3>{t('checkout.address')}</h3>
                  <p className="muted">Nincs mentett szallitasi cimed. Adj hozza egyet a profil oldalon.</p>
                  <button className="btn-secondary" onClick={() => navigate('/shop/profile')}>Profil megnyitasa</button>
                </div>
              )}

              {needsAddress && !user && (
                <div className="checkout-section">
                  <h3>Szallitasi cim</h3>
                  <input
                    placeholder={t('profile.fullName')}
                    value={guestAddress.fullName}
                    onChange={(e) => setGuestAddress((prev) => ({ ...prev, fullName: e.target.value }))}
                    style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
                    required
                  />
                  <input
                    placeholder={t('profile.streetAddress')}
                    value={guestAddress.street}
                    onChange={(e) => setGuestAddress((prev) => ({ ...prev, street: e.target.value }))}
                    style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
                    required
                  />
                  <select
                    value={guestAddress.country}
                    onChange={(e) => setGuestAddress((prev) => ({ ...prev, country: e.target.value, state: '' }))}
                    style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
                  >
                    {COUNTRY_ADDRESS_CONFIGS.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input
                      placeholder={t('profile.city')}
                      value={guestAddress.city}
                      onChange={(e) => setGuestAddress((prev) => ({ ...prev, city: e.target.value }))}
                      style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
                      required
                    />
                    {guestCountryConfig.regions ? (
                      <select
                        value={guestAddress.state}
                        onChange={(e) => setGuestAddress((prev) => ({ ...prev, state: e.target.value }))}
                        style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
                        required
                      >
                        <option value="" disabled>{guestCountryConfig.regionLabel}</option>
                        {guestCountryConfig.regions.map((region) => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        placeholder={guestCountryConfig.regionLabel}
                        value={guestAddress.state}
                        onChange={(e) => setGuestAddress((prev) => ({ ...prev, state: e.target.value }))}
                        style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
                        required
                      />
                    )}
                  </div>
                  <input
                    placeholder={guestCountryConfig.postalLabel}
                    value={guestAddress.zipCode}
                    onChange={(e) => setGuestAddress((prev) => ({ ...prev, zipCode: e.target.value }))}
                    style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
                    required
                  />
                </div>
              )}

              {!user && (
                <div className="checkout-section">
                  <h3>{t('checkout.accountInfo')}</h3>
                  <input placeholder={t('common.username')} value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} style={{ width: '100%', marginBottom: '8px', padding: '8px' }} required />
                  <input placeholder={t('auth.email')} type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} style={{ width: '100%', marginBottom: '8px', padding: '8px' }} required />
                  <input placeholder={t('auth.password')} type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} style={{ width: '100%', padding: '8px' }} required />
                </div>
              )}
            </>
          )}
        </div>

        {hasItems && (
          <div className="checkout-sidebar">
            <h3>{t('checkout.summary')}</h3>
            <div style={{ padding: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>{t('checkout.subtotal')}</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                <span>{t('checkout.shipping')}</span>
                <span>${ship.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', fontWeight: 'bold' }}>
                <span>{t('checkout.total')}</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            <button className="btn-primary btn-block" onClick={handleOrder} disabled={loading || !hasItems}>
              {loading ? t('checkout.processing') : t('checkout.placeOrder')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
