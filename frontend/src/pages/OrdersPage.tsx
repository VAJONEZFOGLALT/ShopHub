import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { formatPriceHUF } from '../utils/currency';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
type CourierService = 'UPS' | 'PACKETA' | 'DPD' | 'INPOST';

function getStatusConfig(status: OrderStatus, t: any) {
  const configs = {
    PENDING: { label: t('orders.pending'), class: 'status-pending', icon: '⏱' },
    PROCESSING: { label: t('orders.processing'), class: 'status-processing', icon: '⚙️' },
    SHIPPED: { label: t('orders.shipped'), class: 'status-shipped', icon: '🚚' },
    DELIVERED: { label: t('orders.delivered'), class: 'status-delivered', icon: '✓' },
    CANCELLED: { label: t('orders.cancelled'), class: 'status-cancelled', icon: '✕' },
  };
  return configs[status] || configs.PENDING;
}

function getCourierIcon(courier: CourierService): { icon: string; name: string } {
  const couriers: Record<CourierService, { icon: string; name: string }> = {
    'UPS': { icon: '🚚', name: 'UPS Express' },
    'PACKETA': { icon: '📦', name: 'Packeta' },
    'DPD': { icon: '🚛', name: 'DPD' },
    'INPOST': { icon: '📮', name: 'Magyar Posta' },
  };
  return couriers[courier] || { icon: '📦', name: courier };
}

export default function OrdersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const [allOrders, allProducts] = await Promise.all([
          api.getOrders(),
          api.getProducts(),
        ]);

        const userOrders: any[] = [];
        for (let i = 0; i < allOrders.length; i += 1) {
          const order = allOrders[i];
          if (Number(order.userId) === user?.id) {
            userOrders.push(order);
          }
        }

        userOrders.sort((a, b) => {
          const aDate = new Date(a.createdAt || 0).getTime();
          const bDate = new Date(b.createdAt || 0).getTime();
          return bDate - aDate;
        });

        setOrders(userOrders);
        setProducts(allProducts);
      } catch (e) {
        showToast(t('orders.failedToLoadOrders'), 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="view">
        <div className="error">{t('orders.loginRequired')}</div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner fullScreen={true} />;
  }

  const getProductName = (productId: number, fallbackName?: string) => {
    if (fallbackName && fallbackName.trim().length > 0) {
      return fallbackName;
    }
    const product = products.find((item: any) => item.id === productId);
    return product ? product.name : `#${productId}`;
  };

  const formatItemCount = (count: number) => {
    return `${count} ${count === 1 ? t('orders.item') : t('orders.itemsCount')}`;
  };

  return (
    <div className="view">
      <h1>{t('orders.title')}</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>{t('orders.noOrders')}</h2>
          <p>{t('orders.noOrdersDesc')}</p>
          <Link to="/shop/all" className="btn-primary">{t('orders.browseProducts')}</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const items = Array.isArray(order.orderItems) ? order.orderItems : [];
            const itemCount = items.reduce((sum: number, item: any) => sum + Number(item.quantity || 0), 0);
            const hasCourier = Boolean(order.courier);
            const hasTracking = Boolean(order.trackingNumber);
            const hasShippingAddress = Boolean(order.shippingAddress);
            const createdAt = new Date(order.createdAt || Date.now()).toLocaleDateString('hu-HU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
            return (
              <div key={order.id} className="order-card" onClick={() => navigate(`/shop/orders/${order.id}`)} style={{cursor: 'pointer'}}>
                <div className="order-header">
                  <div className="order-id">
                    <span className="order-number">#{order.id}</span>
                    <span className="order-meta">{createdAt}</span>
                  </div>
                  <div className="order-status">
                    {(() => {
                      const status = (order.status || 'PENDING') as OrderStatus;
                      const config = getStatusConfig(status, t);
                      return (
                        <span className={`status-badge ${config.class}`}>
                          {config.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <div className="order-body">
                  <div className="order-info">
                    <div className="order-info-grid">
                      <div className="info-row">
                        <span className="info-label">{t('orders.items')}</span>
                        <span className="info-value">{formatItemCount(itemCount)}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">{t('orders.total')}</span>
                        <span className="info-value" style={{fontWeight: 700, color: 'var(--primary)'}}>{formatPriceHUF(Number(order.totalPrice || 0))}</span>
                      </div>
                      {hasCourier && (
                        <div className="info-row">
                          <span className="info-label">{t('orders.courier')}</span>
                          <span className="info-value">
                            <span style={{ marginRight: '6px' }}>
                              {getCourierIcon(order.courier as CourierService).icon}
                            </span>
                            {getCourierIcon(order.courier as CourierService).name}
                          </span>
                        </div>
                      )}
                      {hasTracking && (
                        <div className="info-row">
                          <span className="info-label">{t('orders.tracking')}</span>
                          <span className="info-value">{order.trackingNumber}</span>
                        </div>
                      )}
                    </div>

                    {items.length > 0 && (
                      <div className="order-items-summary">
                        <div className="items-header">{items.length} {items.length === 1 ? t('orders.item') : t('orders.itemsCount')}</div>
                        <div className="items-inline">
                          {items.map((item: any, idx: number) => (
                            <div key={item.id} className="item-inline">
                              <span className="item-badge">{item.quantity}×</span>
                              <span className="item-name">{getProductName(item.productId, item.product?.name)}</span>
                              {idx < items.length - 1 && <span className="item-sep">•</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {hasShippingAddress && (
                    <div className="order-sidebar">
                      <div className="order-side-panel">
                        <div className="side-panel-title">{t('orders.shippingTo')}</div>
                        <div className="side-panel-value">{order.shippingAddress}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="orders-footer">
        <Link to="/shop/profile" className="btn-secondary">{t('orders.backToProfile')}</Link>
        <Link to="/shop/all" className="btn-primary">{t('orders.continueShopping')}</Link>
      </div>
    </div>
  );
}
