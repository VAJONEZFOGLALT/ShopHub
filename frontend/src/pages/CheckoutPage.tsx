import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { CourierOption } from '../components/checkout/CourierSelectionModal';

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
  { id: 'MAGYAR_POSTA', name: '🇭🇺 Magyar Posta', price: 2.99, days: '2-3 days', type: 'address' as const },
  { id: 'UPS', name: 'UPS Express', price: 15.99, days: '1-2 days', type: 'address' as const },
  { id: 'DPD', name: 'DPD Express', price: 12.99, days: '1-2 days', type: 'address' as const },
  { id: 'PACKETA', name: 'Packeta (Z-box)', price: 4.99, days: '2-3 days', type: 'pickup' as const },
  { id: 'GLS', name: 'GLS (Box/Pickup)', price: 5.99, days: '2-4 days', type: 'both' as const },
];

export default function CheckoutPage({ onSuccess }: { onSuccess?: (id: number) => void }) {
  const { t } = useTranslation();
  const { items, remove, clear, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courier, setCourier] = useState('UPS');
  const [courierLocation, setCourierLocation] = useState('');
  const [packetaReady, setPacketaReady] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddr, setSelectedAddr] = useState<number | null>(null);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      api.getAddresses(user.id).then(setAddresses).catch(() => {});
    }
  }, [user]);

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
        setCourierLocation(label);
      },
      {
        language: 'hu',
        country: 'hu',
      }
    );
  };

  const handleOpenGlsFinder = () => {
    window.open('https://gls-group.com/HU/hu/depo-csomagpont-kereses/', '_blank', 'noopener,noreferrer');
  };

  const ship = couriers.find(c => c.id === courier)?.price || 0;
  const finalTotal = total + ship;

  const handleOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const selectedCourier = couriers.find((c) => c.id === courier);
      const needsPickupPoint = selectedCourier?.type !== 'address';

      if (needsPickupPoint && !courierLocation.trim()) {
        setError('Valassz atvevo pontot/boxot a kivalasztott futarhoz.');
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
      const addr = addresses.find(a => a.id === selectedAddr);
      const addressText = addr ? `${addr.fullName}, ${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}` : '';
      const pickupText = courierLocation ? `Atvevo pont: ${courierLocation}` : '';
      const shipping = [addressText, pickupText].filter(Boolean).join(' | ') || undefined;

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
      <div className="checkout-container">
        <div className="checkout-main">
          <h2>{t('checkout.title')}</h2>
          {error && <div className="error">{error}</div>}

          {items.length === 0 ? (
            <div className="empty-checkout">
              <div className="empty-state">
                <p style={{ fontSize: '4em', margin: '0 0 16px 0' }}>🛒</p>
                <h3>{t('cart.empty')}</h3>
                <p className="muted">{t('checkout.addItemsFirst')}</p>
                <button 
                  className="btn-primary" 
                  onClick={() => navigate('/shop/all')}
                  style={{ marginTop: '20px' }}
                >
                  Continue Shopping
                </button>
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
                        setCourier(e.target.value);
                        setCourierLocation('');
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div><strong>{c.name}</strong> - ${c.price.toFixed(2)}</div>
                      <div className="muted" style={{ fontSize: '0.9em' }}>{c.days}</div>
                    </div>
                  </label>
                ))}

                {courier === 'PACKETA' && (
                  <div className="courier-picker-box">
                    <button className="btn-secondary" onClick={handlePickPacketaPoint} disabled={!packetaReady}>
                      {packetaReady ? 'Packeta Z-BOX kivalasztasa' : 'Packeta betoltese...'}
                    </button>
                    {courierLocation && <p className="muted" style={{ marginTop: '8px' }}>📍 {courierLocation}</p>}
                  </div>
                )}

                {courier === 'GLS' && (
                  <div className="courier-picker-box">
                    <button className="btn-secondary" onClick={handleOpenGlsFinder}>
                      GLS csomagpont kereso megnyitasa
                    </button>
                    <input
                      style={{ width: '100%', marginTop: '10px', padding: '10px' }}
                      placeholder="Kivalasztott GLS pont neve vagy kodja"
                      value={courierLocation}
                      onChange={(e) => setCourierLocation(e.target.value)}
                    />
                  </div>
                )}

                {courierLocation && courier !== 'PACKETA' && courier !== 'GLS' && (
                  <p className="muted" style={{ fontSize: '0.85em' }}>📍 {courierLocation}</p>
                )}
              </div>

              {user && addresses.length > 0 && (
                <div className="checkout-section">
                  <h3>{t('checkout.address')}</h3>
                  {addresses.map(a => (
                    <label key={a.id} style={{ display: 'flex', gap: '10px', margin: '10px 0', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px' }}>
                      <input type="radio" checked={selectedAddr === a.id} onChange={() => setSelectedAddr(a.id)} />
                      <div>
                        <strong>{a.label}</strong><br />
                        {a.fullName}, {a.street}, {a.city}, {a.state} {a.zipCode}
                      </div>
                    </label>
                  ))}
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
          <button className="btn-primary btn-block" onClick={handleOrder} disabled={loading || items.length === 0}>
            {loading ? t('checkout.processing') : t('checkout.placeOrder')}
          </button>
        </div>
      </div>
    </div>
  );
}
