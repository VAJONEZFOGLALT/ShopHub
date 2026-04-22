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
  { id: 'UPS', name: 'UPS Express', price: 15.99, days: '1-2 nap', type: 'address' },
  { id: 'INPOST', name: 'Magyar Posta', price: 6.99, days: '2-4 nap', type: 'address' },
  { id: 'PACKETA', name: 'Packeta', price: 4.99, days: '2-3 nap', type: 'pickup' },
];

type CourierOption = {
  id: 'UPS' | 'PACKETA' | 'INPOST';
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
  const [packetaSelecting, setPacketaSelecting] = useState(false);

  const selectedCourier = couriers.find((c) => c.id === courier) || couriers[0];
  const hasItems = items.length > 0;
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
      navigate('/shop/all', { replace: true });
      return;
    }
    setError('');
  }, [hasItems, navigate]);

  useEffect(() => {
    if (!packetaSelecting) {
      document.body.classList.remove('packeta-modal-open');
      return;
    }

    const forcePacketaDialogLayout = () => {
      const iframe = document.querySelector('iframe[src*="widget.packeta.com"]') as HTMLIFrameElement | null;
      if (!iframe) return;

      let dialog = iframe.parentElement as HTMLElement | null;
      while (dialog && dialog !== document.body) {
        const computed = window.getComputedStyle(dialog);
        if (computed.position === 'fixed' || computed.position === 'absolute') break;
        dialog = dialog.parentElement;
      }

      if (!dialog) return;

      dialog.style.inset = '50% auto auto 50%';
      dialog.style.transform = 'translate(-50%, -50%)';
      dialog.style.width = '75vw';
      dialog.style.maxWidth = '1120px';
      dialog.style.height = '78vh';
      dialog.style.maxHeight = '860px';
      dialog.style.borderRadius = '16px';
      dialog.style.overflow = 'hidden';
      dialog.style.boxShadow = '0 35px 90px rgba(2, 6, 23, 0.52)';
      dialog.style.zIndex = '10002';

      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0';
      const isDarkTheme = document.documentElement.getAttribute('data-theme') !== 'light';
      iframe.style.filter = isDarkTheme ? 'brightness(0.88) contrast(1.05)' : 'none';

      const overlay = dialog.parentElement as HTMLElement | null;
      if (overlay && overlay !== document.body) {
        const computed = window.getComputedStyle(overlay);
        if (computed.position === 'fixed' || computed.position === 'absolute') {
          overlay.style.background = 'rgba(7, 10, 18, 0.72)';
          overlay.style.backdropFilter = 'blur(4px)';
          overlay.style.zIndex = '10001';
        }
      }
    };

    document.body.classList.add('packeta-modal-open');
    forcePacketaDialogLayout();

    const observer = new MutationObserver(() => {
      forcePacketaDialogLayout();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const intervalId = window.setInterval(forcePacketaDialogLayout, 200);

    return () => {
      document.body.classList.remove('packeta-modal-open');
      observer.disconnect();
      window.clearInterval(intervalId);
    };
  }, [packetaSelecting]);

  const handlePickPacketaPoint = () => {
    const apiKey = import.meta.env.VITE_PACKETA_API_KEY || '';
    const widgetLanguage = import.meta.env.VITE_PACKETA_API_LOCALE || 'en_GB';
    const isDarkTheme = document.documentElement.getAttribute('data-theme') !== 'light';

    if (!apiKey) {
      setError('Hianyzik a VITE_PACKETA_API_KEY, add meg .env-ben.');
      return;
    }

    if (!window.Packeta?.Widget?.pick) {
      setError('A Packeta widget nem toltheto be most.');
      return;
    }

    setPacketaSelecting(true);

    window.Packeta.Widget.pick(
      apiKey,
      (point: any) => {
        setPacketaSelecting(false);
        if (!point) return;
        const label = [point.name, point.city, point.street].filter(Boolean).join(', ');
        setPickupPointLabel(label);
        setPickupPointCode(String(point.id || point.code || 'PACKETA-POINT'));
      },
      {
        language: widgetLanguage,
        country: 'hu',
        theme: isDarkTheme ? 'dark' : 'light',
        colorMode: isDarkTheme ? 'dark' : 'light',
        appearance: isDarkTheme ? 'dark' : 'light',
      }
    );
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

  if (!hasItems) {
    return null;
  }

  return (
    <div className="checkout-wrapper">
      <div className={`checkout-container ${hasItems ? '' : 'checkout-container-empty'}`.trim()}>
        <div className="checkout-main">
          <h2>{t('checkout.title')}</h2>
          {error && (
            <div className="error">
              <span>{error}</span>
            </div>
          )}

          <>
              <div className="checkout-section">
                <h3>{t('checkout.items')} ({items.length})</h3>
                <div className="checkout-items">
                  {items.map(it => (
                    <div key={it.productId} className="checkout-item">
                      <div className="checkout-item-info">
                        <strong>{it.name}</strong>
                        <span className="muted">Mennyiseg: {it.quantity}</span>
                        <span>${(it.price * it.quantity).toFixed(2)}</span>
                      </div>
                      <button className="btn-text" onClick={() => remove(it.productId)}>{t('checkout.remove')}</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="checkout-section">
                <h3>{t('checkout.delivery')}</h3>
                {couriers.map(c => (
                  <label key={c.id} className="checkout-courier-option">
                    <input
                      type="radio"
                      value={c.id}
                      checked={courier === c.id}
                      onChange={e => {
                        setCourier(e.target.value as CourierOption['id']);
                      }}
                    />
                    <div className="checkout-courier-content">
                      <div><strong>{c.name}</strong> - ${c.price.toFixed(2)}</div>
                      <div className="muted checkout-courier-days">{c.days}</div>
                    </div>
                  </label>
                ))}

                {needsPickup && courier === 'PACKETA' && (
                  <div className="courier-picker-box">
                    <button className="btn-secondary" onClick={handlePickPacketaPoint} disabled={!packetaReady}>
                      {packetaReady ? 'Packeta pont valasztasa' : 'Packeta betoltese...'}
                    </button>
                    {pickupPointLabel && <p className="muted courier-picked-point">📍 {pickupPointLabel}</p>}
                  </div>
                )}
              </div>

              {needsAddress && user && addresses.length > 0 && (
                <div className="checkout-section">
                  <h3>{t('checkout.address')}</h3>
                  {addresses.map(a => (
                    <label key={a.id} className="checkout-address-option">
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
                    className="checkout-input"
                    placeholder={t('profile.fullName')}
                    value={guestAddress.fullName}
                    onChange={(e) => setGuestAddress((prev) => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                  <input
                    className="checkout-input"
                    placeholder={t('profile.streetAddress')}
                    value={guestAddress.street}
                    onChange={(e) => setGuestAddress((prev) => ({ ...prev, street: e.target.value }))}
                    required
                  />
                  <select
                    className="checkout-input"
                    value={guestAddress.country}
                    onChange={(e) => setGuestAddress((prev) => ({ ...prev, country: e.target.value, state: '' }))}
                  >
                    {COUNTRY_ADDRESS_CONFIGS.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <div className="checkout-grid-two">
                    <input
                      className="checkout-input"
                      placeholder={t('profile.city')}
                      value={guestAddress.city}
                      onChange={(e) => setGuestAddress((prev) => ({ ...prev, city: e.target.value }))}
                      required
                    />
                    {guestCountryConfig.regions ? (
                      <select
                        className="checkout-input"
                        value={guestAddress.state}
                        onChange={(e) => setGuestAddress((prev) => ({ ...prev, state: e.target.value }))}
                        required
                      >
                        <option value="" disabled>{guestCountryConfig.regionLabel}</option>
                        {guestCountryConfig.regions.map((region) => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="checkout-input"
                        placeholder={guestCountryConfig.regionLabel}
                        value={guestAddress.state}
                        onChange={(e) => setGuestAddress((prev) => ({ ...prev, state: e.target.value }))}
                        required
                      />
                    )}
                  </div>
                  <input
                    className="checkout-input"
                    placeholder={guestCountryConfig.postalLabel}
                    value={guestAddress.zipCode}
                    onChange={(e) => setGuestAddress((prev) => ({ ...prev, zipCode: e.target.value }))}
                    required
                  />
                </div>
              )}

              {!user && (
                <div className="checkout-section">
                  <h3>{t('checkout.accountInfo')}</h3>
                  <input className="checkout-input" placeholder={t('common.username')} value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} required />
                  <input className="checkout-input" placeholder={t('auth.email')} type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
                  <input className="checkout-input" placeholder={t('auth.password')} type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
                </div>
              )}
          </>
        </div>

        <div className="checkout-sidebar">
          <h3>{t('checkout.summary')}</h3>
          <div className="checkout-summary">
            <div className="checkout-summary-row">
              <span>{t('checkout.subtotal')}</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="checkout-summary-row">
              <span>{t('checkout.shipping')}</span>
              <span>${ship.toFixed(2)}</span>
            </div>
            <div className="checkout-summary-row total">
              <span>{t('checkout.total')}</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
          <button className="btn-primary btn-block" onClick={handleOrder} disabled={loading || !hasItems}>
            {loading ? t('checkout.processing') : t('checkout.placeOrder')}
          </button>
        </div>
      </div>
    </div>
  );
}
