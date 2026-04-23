import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
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

export default function OrderDetailPage() {
  const { t } = useTranslation();
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderDetail = async () => {
      try {
        if (!orderId) {
          showToast(t('toasts.orderInvalidId'), 'error');
          navigate('/shop/orders');
          return;
        }

        const orderIdNum = Number(orderId);
        if (!Number.isFinite(orderIdNum) || orderIdNum <= 0) {
          showToast(t('toasts.orderInvalidId'), 'error');
          navigate('/shop/orders');
          return;
        }

        const [foundOrder, allProducts] = await Promise.all([
          api.getOrder(orderIdNum),
          api.getProducts(),
        ]);

        if (!foundOrder || Number(foundOrder.id) !== orderIdNum) {
          showToast(t('toasts.orderNotFound'), 'error');
          navigate('/shop/orders');
          return;
        }

        if (user && Number(foundOrder.userId) !== user.id) {
          showToast(t('toasts.orderNotFound'), 'error');
          navigate('/shop/orders');
          return;
        }

        setOrder(foundOrder);
        setProducts(allProducts);
      } catch (error) {
        console.error('Failed to load order:', error);
        showToast(t('toasts.orderLoadFailed'), 'error');
        navigate('/shop/orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetail();
  }, [orderId, navigate, showToast, user]);

  if (loading) return <LoadingSpinner />;
  if (!order) return null;

  const items = Array.isArray(order.orderItems) ? order.orderItems : [];
  const createdAt = new Date(order.createdAt || Date.now()).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    return product?.name || `Product #${productId}`;
  };

  const status = (order.status || 'PENDING') as OrderStatus;
  const config = getStatusConfig(status, t);

  return (
    <div className="order-detail-page">
      <Link to="/shop/orders" className="back-link">← {t('orders.backToOrders') || 'Back to Orders'}</Link>
      
      <div className="order-detail-header">
        <div>
          <h1>{t('orders.orderDetails') || 'Order Details'}</h1>
          <p className="order-id-detail">#{order.id}</p>
        </div>
        <span className={`status-badge ${config.class}`}>{config.label}</span>
      </div>

      <div className="order-detail-container">
        {/* Order Summary */}
        <section className="detail-section">
          <h2>{t('orders.orderSummary') || 'Order Summary'}</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">{t('orders.orderDate') || 'Order Date'}</span>
              <span className="detail-value">{createdAt}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t('orders.total') || 'Total'}</span>
              <span className="detail-value" style={{fontWeight: 700, color: 'var(--primary)', fontSize: '18px'}}>
                {formatPriceHUF(Number(order.totalPrice || 0))}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t('orders.items') || 'Items'}</span>
              <span className="detail-value">{items.reduce((sum: number, item: any) => sum + Number(item.quantity || 0), 0)}</span>
            </div>
            {order.courier && (
              <div className="detail-item">
                <span className="detail-label">{t('orders.courier') || 'Courier'}</span>
                <span className="detail-value">
                  {getCourierIcon(order.courier as CourierService).icon} {getCourierIcon(order.courier as CourierService).name}
                </span>
              </div>
            )}
            {order.trackingNumber && (
              <div className="detail-item">
                <span className="detail-label">{t('orders.tracking') || 'Tracking Number'}</span>
                <span className="detail-value" style={{fontFamily: 'monospace'}}>{order.trackingNumber}</span>
              </div>
            )}
          </div>
        </section>

        {/* Order Items */}
        {items.length > 0 && (
          <section className="detail-section">
            <h2>{t('orders.orderItems') || 'Order Items'}</h2>
            <table className="items-table">
              <thead>
                <tr>
                  <th>{t('products.product') || 'Product'}</th>
                  <th>{t('products.quantity') || 'Quantity'}</th>
                  <th>{t('products.price') || 'Price'}</th>
                  <th>{t('products.subtotal') || 'Subtotal'}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id}>
                    <td className="product-name">{getProductName(item.productId)}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">{formatPriceHUF(Number(item.price || 0))}</td>
                    <td className="text-right" style={{fontWeight: 600}}>
                      {formatPriceHUF(Number(item.price || 0) * Number(item.quantity || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Shipping Address */}
        {order.shippingAddress && (
          <section className="detail-section">
            <h2>{t('orders.shippingTo') || 'Shipping To'}</h2>
            <div className="address-box">
              {order.shippingAddress}
            </div>
          </section>
        )}
      </div>

      <div className="detail-footer">
        <Link to="/shop/orders" className="btn-secondary">{t('orders.backToOrders') || 'Back to Orders'}</Link>
        <Link to="/shop/all" className="btn-primary">{t('orders.continueShopping') || 'Continue Shopping'}</Link>
      </div>
    </div>
  );
}
