import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
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
  { id: 'UPS', name: 'UPS Express', price: 15.99, days: '1-2 days', type: 'address' },
  { id: 'DPD', name: 'DPD', price: 7.99, days: '1-2 days', type: 'both' },
  { id: 'PACKETA', name: 'Packeta (Z-Box / pickup point)', price: 4.99, days: '2-3 days', type: 'pickup' },
  { id: 'INPOST', name: 'InPost Locker', price: 5.49, days: '2-3 days', type: 'pickup' },
];

type CourierOption = {
  id: 'UPS' | 'DPD' | 'PACKETA' | 'INPOST';
  name: string;
  price: number;
  days: string;
  type: 'address' | 'pickup' | 'both';
};

type DeliveryMode = 'address' | 'pickup';

type GuestAddressDraft = {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

const getDefaultMode = (courier?: CourierOption): DeliveryMode => {
  if (!courier) return 'address';
  if (courier.type === 'pickup') return 'pickup';
  return 'address';
};

export default function CheckoutPage({ onSuccess }: { onSuccess?: (id: number) => void }) {
  const { t } = useTranslation();
  const { items, remove, clear, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courier, setCourier] = useState<CourierOption['id']>('UPS');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('address');
  const [packetaReady, setPacketaReady] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddr, setSelectedAddr] = useState<number | null>(null);
  const [pickupPointLabel, setPickupPointLabel] = useState('');
  const [pickupPointCode, setPickupPointCode] = useState('');
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
  const needsPickup = selectedCourier.type === 'pickup' || (selectedCourier.type === 'both' && deliveryMode === 'pickup');
  const needsAddress = selectedCourier.type === 'address' || (selectedCourier.type === 'both' && deliveryMode === 'address');
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
    setDeliveryMode(getDefaultMode(selectedCourier));
    setPickupPointLabel('');
    setPickupPointCode('');
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

  const handleOpenDpdFinder = () => {
    window.open('https://www.dpd.com/hu/hu/atvevohely-kereso/', '_blank', 'noopener,noreferrer');
  };

  const handleOpenInpostFinder = () => {
    window.open('https://inpost.hu/automata-kereso', '_blank', 'noopener,noreferrer');
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

                {selectedCourier.type === 'both' && (
                  <div className="courier-picker-box">
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className={`btn-secondary ${deliveryMode === 'address' ? 'active' : ''}`}
                        onClick={() => setDeliveryMode('address')}
                      >
                        Hazhozszallitas
                      </button>
                      <button
                        type="button"
                        className={`btn-secondary ${deliveryMode === 'pickup' ? 'active' : ''}`}
                        onClick={() => setDeliveryMode('pickup')}
                      >
                        Atvevo pont / locker
                      </button>
                    </div>
                  </div>
                )}

                {needsPickup && courier === 'PACKETA' && (
                  <div className="courier-picker-box">
                    <button className="btn-secondary" onClick={handlePickPacketaPoint} disabled={!packetaReady}>
                      {packetaReady ? 'Packeta Z-BOX kivalasztasa' : 'Packeta betoltese...'}
                    </button>
                    {pickupPointLabel && <p className="muted" style={{ marginTop: '8px' }}>📍 {pickupPointLabel}</p>}
                  </div>
                )}

                {needsPickup && courier === 'DPD' && (
                  <div className="courier-picker-box">
                    <button className="btn-secondary" onClick={handleOpenDpdFinder}>
                      DPD pont kereso megnyitasa
                    </button>
                    <input
                      style={{ width: '100%', marginTop: '10px', padding: '10px' }}
                      placeholder="DPD pont neve / cim"
                      value={pickupPointLabel}
                      onChange={(e) => setPickupPointLabel(e.target.value)}
                    />
                    <input
                      style={{ width: '100%', marginTop: '10px', padding: '10px' }}
                      placeholder="DPD pont azonosito"
                      value={pickupPointCode}
                      onChange={(e) => setPickupPointCode(e.target.value)}
                    />
                  </div>
                )}

                {needsPickup && courier === 'INPOST' && (
                  <div className="courier-picker-box">
                    <button className="btn-secondary" onClick={handleOpenInpostFinder}>
                      InPost locker kereso megnyitasa
                    </button>
                    <input
                      style={{ width: '100%', marginTop: '10px', padding: '10px' }}
                      placeholder="InPost locker kod"
                      value={pickupPointCode}
                      onChange={(e) => setPickupPointCode(e.target.value)}
                    />
                    <input
                      style={{ width: '100%', marginTop: '10px', padding: '10px' }}
                      placeholder="Locker cim / varos"
                      value={pickupPointLabel}
                      onChange={(e) => setPickupPointLabel(e.target.value)}
                    />
                  </div>
                )}
              </div>

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
