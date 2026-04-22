import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import { useTranslation } from 'react-i18next';

export default function OrderConfirmationPage({ orderId, onOrderViewed }: { orderId?: number; onOrderViewed?: () => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const [payMessage, setPayMessage] = useState('');

  const statusLabels: Record<string, string> = {
    PENDING: 'Rögzítve',
    PROCESSING: 'Feldolgozás alatt',
    SHIPPED: 'Szállítás alatt',
    DELIVERED: 'Kézbesítve',
    CANCELLED: 'Törölve',
  };

  const resolvedOrderId = useMemo(() => {
    if (orderId) {
      return orderId;
    }
    const raw = searchParams.get('orderId');
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  }, [orderId, searchParams]);

  useEffect(() => {
    if (!resolvedOrderId) {
      navigate('/shop', { replace: true });
    }
  }, [resolvedOrderId, navigate]);

  useEffect(() => {
    if (!resolvedOrderId) {
      return;
    }

    const loadOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.getOrder(resolvedOrderId);
        setOrder(data);
      } catch (e: any) {
        setError(e?.message || 'Nem sikerült betölteni a rendelés részleteit');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [resolvedOrderId]);

  useEffect(() => {
    return () => {
      if (onOrderViewed) {
        onOrderViewed();
      }
    };
  }, [onOrderViewed]);

  const handleContinue = () => {
    if (onOrderViewed) {
      onOrderViewed();
    }
    navigate('/shop');
  };

  const handleViewOrders = () => {
    if (onOrderViewed) {
      onOrderViewed();
    }
    navigate('/shop/orders');
  };

  const handlePayNow = async () => {
    if (!order?.id || paying) {
      return;
    }

    setPaying(true);
    setPayMessage('');
    try {
      const updated = await api.payOrder(order.id);
      setOrder(updated);
      setPayMessage(updated?.emailSent ? 'A fizetés sikeres volt, a visszaigazoló e-mail elküldve.' : 'A fizetés sikeres volt.');
    } catch (e: any) {
      setPayMessage(e?.message || 'A fizetés nem sikerült, próbáld újra.');
    } finally {
      setPaying(false);
    }
  };

  if (!resolvedOrderId) {
    return null;
  }

  if (loading) {
    return (
      <div className="view confirmation-details-page">
        <p>{t('orders.loading')}</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="view confirmation-details-page">
        <div className="error">{error || 'A rendelés nem található'}</div>
        <div className="confirmation-actions">
          <button onClick={handleViewOrders}>{t('common.myOrders')}</button>
        </div>
      </div>
    );
  }

  const totalItems = (order.orderItems || []).reduce(
    (sum: number, item: any) => sum + (item.quantity || 0),
    0,
  );

  const status = order.status || 'PENDING';
  const statusClass = `status-${String(status).toLowerCase()}`;
  const isPaid = Boolean(order.teljesitve);
  const statusLabel = statusLabels[String(status).toUpperCase()] || String(status);

  return (
    <div className="view confirmation-details-page">
      <div className="confirmation-header-card">
        <div className="checkmark">✓</div>
        <div>
          <h1>{t('orders.orderNumber')} #{order.id}</h1>
          <p>{isPaid ? 'A rendelésed ki lett fizetve, a feldolgozás folyamatban van.' : 'A rendelés rögzítve van. A feldolgozáshoz még fizetned kell.'}</p>
        </div>
        <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
      </div>

      <div className="confirmation-details-grid">
        <div className="confirmation-panel">
          <h3>Rendelés állapota</h3>
          <div className="info-row">
            <span className="info-label">Fizetés</span>
            <span className="info-value">{isPaid ? 'Kifizetve' : 'Függőben'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Leadva</span>
            <span className="info-value">
              {new Date(order.createdAt || Date.now()).toLocaleString('hu-HU', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Szállító</span>
            <span className="info-value">{order.courier || 'UPS'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Tételek</span>
            <span className="info-value">{totalItems}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Összesen</span>
            <span className="info-value">${Number(order.totalPrice || 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="confirmation-panel">
          <h3>Szállítási cím</h3>
          <p className="shipping-address">
            {order.shippingAddress || 'Ehhez a rendeléshez nincs rögzített szállítási cím.'}
          </p>
          {order.trackingNumber && (
            <div className="info-row">
              <span className="info-label">Nyomkövetés</span>
              <span className="info-value">{order.trackingNumber}</span>
            </div>
          )}
        </div>
      </div>

      <div className="confirmation-panel">
        <h3>Fizetés</h3>
        {!isPaid ? (
          <div>
            <p className="muted">Kattints a fizetésre a próbarendelés kifizetéséhez és a visszaigazoló e-mail elküldéséhez.</p>
            <button className="btn-primary" onClick={handlePayNow} disabled={paying}>
              {paying ? 'Fizetés feldolgozása...' : `Fizetés most - $${Number(order.totalPrice || 0).toFixed(2)}`}
            </button>
          </div>
        ) : (
          <p className="muted">A fizetés már megtörtént.</p>
        )}
        {payMessage && <p className="muted" style={{ marginTop: '10px' }}>{payMessage}</p>}
      </div>

      <div className="confirmation-panel order-lines-panel">
        <h3>Rendelési tételek</h3>
        {(order.orderItems || []).length === 0 ? (
          <p className="muted">Nem találhatók rendelési tételek.</p>
        ) : (
          <div className="order-lines-list">
            {(order.orderItems || []).map((item: any) => (
              <div className="order-line" key={item.id}>
                <div className="line-main">
                  <strong>Termék #{item.productId}</strong>
                  <span>Mennyiség: {item.quantity}</span>
                </div>
                <div className="line-total">${Number((item.price || 0) * (item.quantity || 0)).toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="confirmation-actions">
        <button onClick={handleContinue}>Tovább a főoldalra</button>
        <button onClick={handleViewOrders}>Rendeléseim megtekintése</button>
      </div>
    </div>
  );
}
