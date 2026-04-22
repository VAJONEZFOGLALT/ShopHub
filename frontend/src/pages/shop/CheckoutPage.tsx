import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

const couriers = [
  {
    id: 'UPS',
    name: 'UPS expressz házhozszállítás',
    price: 15.99,
    days: '1-2 munkanap',
    badge: 'Házhozszállítás',
    kind: 'home',
    description: 'Gyors házhozszállítás sürgős rendelésekhez.',
  },
  {
    id: 'INPOST',
    name: 'Postai házhozszállítás',
    price: 7.99,
    days: '2-3 munkanap',
    badge: 'Házhozszállítás',
    kind: 'home',
    description: 'Normál kézbesítés a profilodban elmentett címedre.',
  },
  {
    id: 'PACKETA',
    name: 'Packeta Z-BOX',
    price: 4.99,
    days: '2-4 munkanap',
    badge: 'Átvételi pont',
    kind: 'pickup',
    description: '0-24-es Z-BOX átvétel érintésmentes csomagfelvétellel.',
  },
  {
    id: 'DPD',
    name: 'DPD átvételi pont',
    price: 5.99,
    days: '2-4 munkanap',
    badge: 'Átvételi pont',
    kind: 'pickup',
    description: 'Vedd át a csomagod egy személyzettel működő DPD ponton.',
  },
];

const pickupPointsByCourier: Record<string, Array<{ id: string; name: string; address: string; note: string; city: string; hours: string; typeLabel: string }>> = {
  PACKETA: [
    {
      id: 'packeta-zbox-arena',
      name: 'Packeta Z-BOX Arena Mall',
      address: 'Kerepesi ut 9, Budapest 1087',
      note: '0-24 elérhető',
      city: 'Budapest',
      hours: '0-24',
      typeLabel: 'Z-BOX',
    },
    {
      id: 'packeta-zbox-ujbuda',
      name: 'Packeta Z-BOX Ujbuda Center',
      address: 'Hengermalom ut 19-21, Budapest 1117',
      note: '0-24 elérhető',
      city: 'Budapest',
      hours: '0-24',
      typeLabel: 'Z-BOX',
    },
    {
      id: 'packeta-zbox-fehervar',
      name: 'Packeta Z-BOX Fehérvár Retail Park',
      address: 'Seregelyesi ut 96, Szekesfehervar 8000',
      note: 'Parkolás elérhető',
      city: 'Szekesfehervar',
      hours: '0-24',
      typeLabel: 'Z-BOX',
    },
    {
      id: 'packeta-zbox-debrecen',
      name: 'Packeta Z-BOX Debrecen Forum',
      address: 'Csapo ut 30, Debrecen 4029',
      note: '0-24 elérhető',
      city: 'Debrecen',
      hours: '0-24',
      typeLabel: 'Z-BOX',
    },
    {
      id: 'packeta-zbox-szeged',
      name: 'Packeta Z-BOX Szeged Plaza',
      address: 'Kossuth Lajos sgrt. 119, Szeged 6724',
      note: '0-24 elérhető',
      city: 'Szeged',
      hours: '0-24',
      typeLabel: 'Z-BOX',
    },
  ],
  DPD: [
    {
      id: 'dpd-westend',
      name: 'DPD átvételi pont Westend',
      address: 'Vaci ut 1-3, Budapest 1062',
      note: '20:00-ig nyitva',
      city: 'Budapest',
      hours: '10:00-20:00',
      typeLabel: 'Csomagpont',
    },
    {
      id: 'dpd-allee',
      name: 'DPD átvételi pont Allee',
      address: 'Oktober huszonharmadika utca 8-10, Budapest 1117',
      note: 'Bevásárlóközponti átvétel',
      city: 'Budapest',
      hours: '09:00-21:00',
      typeLabel: 'Csomagpont',
    },
    {
      id: 'dpd-gyor-plaza',
      name: 'DPD átvételi pont Győr Plaza',
      address: 'Vasvari Pal ut 1/A, Gyor 9024',
      note: 'Gyors csomagátvétel',
      city: 'Gyor',
      hours: '10:00-20:00',
      typeLabel: 'Csomagpont',
    },
    {
      id: 'dpd-debrecen',
      name: 'DPD átvételi pont Debrecen Plaza',
      address: 'Pesti utca 2, Debrecen 4026',
      note: 'A belváros közelében',
      city: 'Debrecen',
      hours: '09:00-20:00',
      typeLabel: 'Csomagpont',
    },
    {
      id: 'dpd-pecs',
      name: 'DPD átvételi pont Pécs Arcade',
      address: 'Bajcsy-Zsilinszky ut 11, Pecs 7622',
      note: 'Hosszabb esti nyitvatartás',
      city: 'Pecs',
      hours: '09:00-20:00',
      typeLabel: 'Csomagpont',
    },
  ],
};

export default function CheckoutPage({ onSuccess }: { onSuccess?: (id: number) => void }) {
  const { t } = useTranslation();
  const { items, remove, clear, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [courier, setCourier] = useState('UPS');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddr, setSelectedAddr] = useState<number | null>(null);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<string>('');
  const [pickupSearch, setPickupSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      api.getAddresses(user.id).then(setAddresses).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (addresses.length === 0) {
      setSelectedAddr(null);
      return;
    }

    const preferred = addresses.find((address) => address.isDefault) || addresses[0];
    setSelectedAddr((current) => current ?? preferred.id);
  }, [addresses]);

  useEffect(() => {
    const pickupPoints = pickupPointsByCourier[courier] || [];
    if (pickupPoints.length === 0) {
      setSelectedPickupPoint('');
      return;
    }

    setSelectedPickupPoint((current) => {
      if (current && pickupPoints.some((point) => point.id === current)) {
        return current;
      }
      return pickupPoints[0].id;
    });
  }, [courier]);

  const ship = couriers.find(c => c.id === courier)?.price || 0;
  const finalTotal = total + ship;
  const hasSavedAddresses = addresses.length > 0;
  const selectedCourier = couriers.find((option) => option.id === courier) || couriers[0];
  const requiresPickupPoint = selectedCourier.kind === 'pickup';
  const selectedAddress = addresses.find((address) => address.id === selectedAddr) || null;
  const addressSearchTerms = selectedAddress
    ? [selectedAddress.city, selectedAddress.state, selectedAddress.zipCode]
        .map((value) => String(value || '').trim().toLowerCase())
        .filter(Boolean)
    : [];
  const allPickupPoints = pickupPointsByCourier[courier] || [];
  const pickupPoints = addressSearchTerms.length === 0
    ? allPickupPoints
    : (() => {
        const matched = allPickupPoints.filter((point) => {
          const haystack = `${point.name} ${point.address}`.toLowerCase();
          return addressSearchTerms.some((term) => haystack.includes(term));
        });
        return matched.length > 0 ? matched : allPickupPoints;
      })();
  const filteredPickupPoints = pickupSearch.trim().length === 0
    ? pickupPoints
    : pickupPoints.filter((point) => {
        const haystack = `${point.name} ${point.address} ${point.city} ${point.note}`.toLowerCase();
        return haystack.includes(pickupSearch.trim().toLowerCase());
      });

  const handleOrder = async () => {
    setLoading(true);
    setError('');
    try {
      if (!user?.id) {
        throw new Error('A rendelés leadásához előbb jelentkezz be.');
      }

      if (!selectedAddr) {
        throw new Error('Adj meg egy szallitasi cimet a profilodban, es valaszd ki rendeles elott.');
      }

      if (requiresPickupPoint && !selectedPickupPoint) {
        throw new Error('Valassz egy atveteli pontot a rendelés leadasahoz.');
      }

      const userId = user.id;

      const orderItems = items.map(i => ({ productId: i.productId, quantity: i.quantity }));
      const addr = addresses.find(a => a.id === selectedAddr);
      const baseAddress = addr
        ? `${addr.fullName}, ${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`
        : '';
      const pickupPoint = allPickupPoints.find((point) => point.id === selectedPickupPoint);
      const shipping = requiresPickupPoint && pickupPoint
        ? `Átvételi pont: ${pickupPoint.name}, ${pickupPoint.address} | Vásárlói cím: ${baseAddress}`
        : baseAddress;

      if (!shipping) {
        throw new Error('Adj meg egy szallitasi cimet a profilodban a rendeleshez.');
      }

      const order = await api.createOrder({ userId, items: orderItems, courier, shippingAddress: shipping });
      clear();
      onSuccess?.(order.id);
      const params = new URLSearchParams(location.search);
      const langParam = params.get('lang') || 'hu';
      navigate(`/shop/confirmation?orderId=${order.id}&lang=${langParam}`);
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

          <div className="checkout-section">
            <h3>{t('checkout.items')} ({items.length})</h3>
            {items.length === 0 ? (
              <p className="muted">{t('cart.empty')}</p>
            ) : (
              items.map(it => (
                <div key={it.productId} className="checkout-item">
                  <div className="checkout-item-info">
                    <strong>{it.name}</strong> x {it.quantity}
                    <span>${(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                  <button className="btn-text" onClick={() => remove(it.productId)}>{t('checkout.remove')}</button>
                </div>
              ))
            )}
          </div>

          <div className="checkout-section">
            <h3>{t('checkout.delivery')}</h3>
            <div className="courier-options">
              {couriers.map(c => (
                <label key={c.id} className={`courier-option ${courier === c.id ? 'selected' : ''}`}>
                  <input type="radio" value={c.id} checked={courier === c.id} onChange={e => setCourier(e.target.value)} />
                  <div className="courier-info">
                    <div className="courier-header">
                      <strong>{c.name}</strong>
                      <span className="courier-price">${c.price.toFixed(2)}</span>
                    </div>
                    <div className="courier-eta">{c.days}</div>
                    <div className="courier-description">{c.description}</div>
                    <div className="courier-badge">{c.badge}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="checkout-section">
            <div className="checkout-section-header">
              <h3>{t('checkout.address')}</h3>
              <button className="btn-text" onClick={() => navigate('/shop/profile')} type="button">
                Cimek kezelese
              </button>
            </div>
            {!hasSavedAddresses ? (
              <div className="checkout-empty-state">
                <p className="muted">A rendeleshez elobb adj meg legalabb egy cimet a profilodban.</p>
                <button className="btn-secondary" onClick={() => navigate('/shop/profile')} type="button">
                  Ugras a profilhoz
                </button>
              </div>
            ) : (
              <div className="saved-address-options">
                {addresses.map(a => (
                  <label key={a.id} className={`saved-address-option ${selectedAddr === a.id ? 'selected' : ''}`}>
                    <input type="radio" checked={selectedAddr === a.id} onChange={() => setSelectedAddr(a.id)} />
                    <div className="saved-address-content">
                      <div className="saved-address-title-row">
                        <strong>{a.label}</strong>
                        {a.isDefault && <span className="default-badge">Alapertelmezett</span>}
                      </div>
                      <div>{a.fullName}</div>
                      <div>{a.street}</div>
                      <div>{a.city}, {a.state} {a.zipCode}</div>
                      <div>{a.country}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {requiresPickupPoint && (
            <div className="checkout-section">
              <div className="checkout-section-header">
                <h3>Atveteli pont</h3>
                <a
                  className="btn-text"
                  href={courier === 'PACKETA' ? 'https://www.packeta.hu/atvevohelyek' : 'https://www.dpdgroup.com/hu/mydpd/parcel-shops'}
                  target="_blank"
                  rel="noreferrer"
                >
                  Hivatalos kereso megnyitasa
                </a>
              </div>
              {selectedAddress && (
                <p className="muted" style={{ marginTop: 0 }}>
                  A listat a profilcimed alapjan szurtuk: {selectedAddress.city}, {selectedAddress.state}
                </p>
              )}
              <div className="pickup-locator-shell">
                <div className="pickup-locator-toolbar">
                  <div className="pickup-locator-summary">
                    <strong>{filteredPickupPoints.length} atveteli pont</strong>
                    <span>{selectedCourier.name}</span>
                  </div>
                  <input
                    className="pickup-search-input"
                    value={pickupSearch}
                    onChange={(e) => setPickupSearch(e.target.value)}
                    placeholder="Kereses varosra, cimre vagy pontra"
                  />
                </div>
                <div className="pickup-point-options">
                  {filteredPickupPoints.map((point) => (
                    <label key={point.id} className={`pickup-point-option ${selectedPickupPoint === point.id ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        checked={selectedPickupPoint === point.id}
                        onChange={() => setSelectedPickupPoint(point.id)}
                      />
                      <div className="pickup-point-marker">{courier === 'PACKETA' ? 'Z' : 'P'}</div>
                      <div className="pickup-point-content">
                        <div className="pickup-point-topline">
                          <strong>{point.name}</strong>
                          <span className="pickup-point-city">{point.city}</span>
                        </div>
                        <div className="pickup-point-address">{point.address}</div>
                        <div className="pickup-point-meta">
                          <span>{point.typeLabel}</span>
                          <span>{point.hours}</span>
                          <span>{point.note}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                  {filteredPickupPoints.length === 0 && (
                    <div className="pickup-empty-state">
                      Nincs talalat erre a keresesi kifejezesre. Nyisd meg a hivatalos keresot, vagy torold a szurot.
                    </div>
                  )}
                </div>
              </div>
            </div>
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
