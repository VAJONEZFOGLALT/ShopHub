import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

type ConfirmedOrder = {
  id: number;
  status?: string;
  totalPrice?: number;
  courier?: string;
  shippingAddress?: string | null;
  trackingNumber?: string | null;
  createdAt?: string;
  emailStatus?: { emailSent: boolean; reason?: string };
  orderItems?: Array<{
    id: number;
    quantity: number;
    price: number;
    product?: {
      id: number;
      name: string;
      price?: number;
      image?: string | null;
      category?: string | null;
    };
  }>;
};

export default function OrderConfirmationPage({ orderId, onOrderViewed }: { orderId?: number; onOrderViewed?: () => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const locationOrderId = Number((location.state as { orderId?: number } | null)?.orderId);
  const [resolvedOrderId, setResolvedOrderId] = useState<number | undefined>(() => {
    if (orderId) {
      return orderId;
    }

    if (Number.isFinite(locationOrderId) && locationOrderId > 0) {
      return locationOrderId;
    }

    const stored = localStorage.getItem('lastConfirmedOrderId');
    const parsed = Number(stored);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  });
  
  useEffect(() => {
    if (orderId && orderId !== resolvedOrderId) {
      setResolvedOrderId(orderId);
      return;
    }

    if (!orderId && Number.isFinite(locationOrderId) && locationOrderId > 0 && locationOrderId !== resolvedOrderId) {
      setResolvedOrderId(locationOrderId);
    }
  }, [orderId, locationOrderId, resolvedOrderId]);
  const [order, setOrder] = useState<ConfirmedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadOrder = async () => {
      if (!resolvedOrderId) {
        navigate('/shop', { replace: true });
        return;
      }

      setLoading(true);
      try {
        const data = await api.getOrder(resolvedOrderId);
        if (!active) return;
        setOrder(data);
      } catch {
        if (active) {
          setError(t('orders.failedToLoadOrders'));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      active = false;
    };
  }, [navigate, resolvedOrderId, t]);

  const itemCount = useMemo(() => {
    return (order?.orderItems || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }, [order]);

  const statusLabel = useMemo(() => {
    const status = (order?.status || 'PENDING').toUpperCase();
    const map: Record<string, string> = {
      PENDING: t('orders.pending'),
      PROCESSING: t('orders.processing'),
      SHIPPED: t('orders.shipped'),
      DELIVERED: t('orders.delivered'),
      CANCELLED: t('orders.cancelled'),
    };
    return map[status] || status;
  }, [order?.status, t]);

  const handleContinue = () => {
    if (onOrderViewed) {
      onOrderViewed();
    }
    localStorage.removeItem('lastConfirmedOrderId');
    navigate('/shop');
  };

  const handleViewOrders = () => {
    if (onOrderViewed) {
      onOrderViewed();
    }
    localStorage.removeItem('lastConfirmedOrderId');
    navigate('/shop/orders');
  };

  const handleViewProducts = () => {
    if (onOrderViewed) {
      onOrderViewed();
    }
    localStorage.removeItem('lastConfirmedOrderId');
    navigate('/shop/all');
  };

  useEffect(() => {
    return () => {
      if (onOrderViewed) {
        onOrderViewed();
      }
    };
  }, [onOrderViewed]);

  if (loading) {
    return <LoadingSpinner fullScreen={true} />;
  }

  if (!resolvedOrderId) {
    return null;
  }

  return (
    <div className="view confirmation confirmation-page">
      <div className="confirmation-shell">
        <div className="confirmation-hero">
          <div className="checkmark">✓</div>
          <div className="confirmation-hero-copy">
            <div className="confirmation-kicker">{t('confirmation.kicker')}</div>
            <h1>{t('confirmation.title')}</h1>
            <p>{t('confirmation.subtitle')}</p>
          </div>
        </div>

        {error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="confirmation-grid">
            <section className="confirmation-card confirmation-order-summary">
              <div className="confirmation-card-header">
                <h2>{t('confirmation.orderNumber', { id: resolvedOrderId })}</h2>
                <span className={`status-badge status-${(order?.status || 'PENDING').toLowerCase()}`}>{statusLabel}</span>
              </div>
              <div className="confirmation-order-meta">
                <div>
                  <span className="confirmation-label">{t('checkout.total')}</span>
                  <strong>${Number(order?.totalPrice || 0).toFixed(2)}</strong>
                </div>
                <div>
                  <span className="confirmation-label">{t('orders.courier')}</span>
                  <strong>{order?.courier || 'UPS'}</strong>
                </div>
                <div>
                  <span className="confirmation-label">{t('checkout.items')}</span>
                  <strong>{itemCount}</strong>
                </div>
                <div>
                  <span className="confirmation-label">{t('orders.tracking')}</span>
                  <strong>{order?.trackingNumber || '—'}</strong>
                </div>
              </div>

              <div className="confirmation-address">
                <span className="confirmation-label">{t('checkout.shipping')}</span>
                <p>{order?.shippingAddress || '—'}</p>
              </div>
            </section>

            <section className="confirmation-card confirmation-items-card">
              <h2>{t('confirmation.orderItems')}</h2>
              <div className="confirmation-items-list">
                {(order?.orderItems || []).map((item) => (
                  <div key={item.id} className="confirmation-item-row">
                    <div className="confirmation-item-main">
                      <strong>{item.product?.name || `#${item.product?.id || item.id}`}</strong>
                      <span>x{item.quantity}</span>
                    </div>
                    <div className="confirmation-item-price">${Number(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="confirmation-card confirmation-next-steps">
              <h2>{t('confirmation.nextStepsTitle')}</h2>
              <ul>
                <li>{t('confirmation.nextStep1')}</li>
                <li>{t('confirmation.nextStep2')}</li>
                <li>{t('confirmation.nextStep3')}</li>
              </ul>
            </section>
          </div>
        )}

        <div className="confirmation-actions">
          <button className="btn-primary" onClick={handleViewProducts}>{t('profile.continueShopping')}</button>
          <button className="btn-secondary" onClick={handleViewOrders}>{t('profile.viewMyOrders')}</button>
          <button className="btn-secondary" onClick={handleContinue}>{t('common.home')}</button>
        </div>
      </div>
    </div>
  );
}
