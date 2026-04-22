import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';

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
    'INPOST': { icon: '🏤', name: 'InPost' },
  };
  return couriers[courier] || { icon: '📦', name: courier };
}

export default function OrdersPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const requests = [api.getOrders()];
        let itemsPromise: Promise<any[]> = Promise.resolve([]);
        if (api.getOrderItems) {
          itemsPromise = api.getOrderItems();
        }
        requests.push(itemsPromise as unknown as Promise<any[]>);

        const results = await Promise.all(requests);
        const allOrders = results[0] as any[];
        const items = results[1] as any[];

        const userOrders: any[] = [];
        for (let i = 0; i < allOrders.length; i += 1) {
          const order = allOrders[i];
          if (order.userId === user?.id) {
            userOrders.push(order);
          }
        }
        userOrders.reverse(); // Show newest first
        setOrders(userOrders);
        setOrderItems(items);
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
    return <div className="view"><p>{t('orders.loading')}</p></div>;
  }

  const getOrderItems = (orderId: number) => {
    const matched: any[] = [];
    for (let i = 0; i < orderItems.length; i += 1) {
      const item = orderItems[i];
      if (item.orderId === orderId) {
        matched.push(item);
      }
    }
    return matched;
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
            const items = getOrderItems(order.id);
            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    <span className="order-label">{t('orders.orderNumber')}</span>
                    <span className="order-number">#{order.id}</span>
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
                    <div className="info-row">
                      <span className="info-label">{t('orders.date')}</span>
                      <span className="info-value">{new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">{t('orders.items')}</span>
                      <span className="info-value">{items.length} {items.length === 1 ? t('orders.item') : t('orders.itemsCount')}</span>
                    </div>
                    {order.courier && (
                      <div className="info-row">
                        <span className="info-label">{t('orders.courier')}</span>
                        <span className="info-value">
                          <span style={{ marginRight: '8px', fontSize: '1.2em' }}>
                            {getCourierIcon(order.courier as CourierService).icon}
                          </span>
                          {order.courier}
                        </span>
                      </div>
                    )}
                    {order.trackingNumber && (
                      <div className="info-row">
                        <span className="info-label">{t('orders.tracking')}</span>
                        <span className="info-value">{order.trackingNumber}</span>
                      </div>
                    )}
                    {order.shippingAddress && (
                      <div className="info-row">
                        <span className="info-label">{t('orders.shippingTo')}</span>
                        <span className="info-value">{order.shippingAddress}</span>
                      </div>
                    )}
                  </div>
                  <div className="order-total">
                    <span className="total-label">{t('orders.total')}</span>
                    <span className="total-amount">${order.totalPrice?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                {items.length > 0 && (
                  <div className="order-items">
                    <div className="items-label">{t('orders.items')}:</div>
                    <div className="items-grid">
                      {items.map((item: any) => (
                        <div key={item.id} className="item-summary">
                          <span className="item-name">{item.productName}</span>
                          <span className="item-qty">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
