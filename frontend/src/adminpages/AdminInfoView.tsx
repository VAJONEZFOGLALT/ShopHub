import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api, getApiErrorMessage } from '../services/api';
import { formatPriceHUF } from '../utils/currency';

type UserSummary = {
  id: number;
};

type ProductSummary = {
  id: number;
  stock?: number;
  price?: number;
};

type OrderSummary = {
  id: number;
  userId?: number;
  status?: string;
  totalPrice?: number;
  createdAt?: string;
};

type AdminInfoViewProps = {
  onNavigateToTab: (tab: 'users' | 'orders' | 'products') => void;
};

export default function AdminInfoView({ onNavigateToTab }: AdminInfoViewProps) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [usersData, productsData, ordersData] = await Promise.all([
        api.getUsers(),
        api.getProducts(),
        api.getOrders(),
      ]);
      setUsers(Array.isArray(usersData) ? (usersData as UserSummary[]) : []);
      setProducts(Array.isArray(productsData) ? (productsData as ProductSummary[]) : []);
      setOrders(Array.isArray(ordersData) ? (ordersData as OrderSummary[]) : []);
    } catch (e: unknown) {
      setError(getApiErrorMessage(e, t('admin.loadFailed')));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const stats = useMemo(() => {
    let lowStock = 0;
    let outOfStock = 0;
    let inventoryValue = 0;
    let totalRevenue = 0;
    let pendingOrders = 0;

    for (let i = 0; i < products.length; i += 1) {
      const product = products[i];
      const stock = Number(product.stock) || 0;
      const price = Number(product.price) || 0;
      inventoryValue += stock * price;

      if (stock <= 0) {
        outOfStock += 1;
      } else if (stock <= 5) {
        lowStock += 1;
      }
    }

    for (let i = 0; i < orders.length; i += 1) {
      const order = orders[i];
      totalRevenue += Number(order.totalPrice) || 0;
      if (String(order.status || '').toUpperCase() === 'PENDING') {
        pendingOrders += 1;
      }
    }

    return {
      userCount: users.length,
      productCount: products.length,
      orderCount: orders.length,
      lowStock,
      outOfStock,
      inventoryValue,
      totalRevenue,
      pendingOrders,
    };
  }, [users, products, orders]);

  const recentOrders = useMemo(() => {
    const cloned = orders.slice();
    cloned.sort((a: OrderSummary, b: OrderSummary) => {
      const aTime = new Date(a?.createdAt || 0).getTime();
      const bTime = new Date(b?.createdAt || 0).getTime();
      return bTime - aTime;
    });
    return cloned.slice(0, 5);
  }, [orders]);

  return (
    <div className="view">
      <h2>{t('admin.overview')}</h2>
      {error && <div className="error">{error}</div>}

      <div className="stats-grid products-stats">
        <button type="button" className="stat-item stat-item-action" onClick={() => onNavigateToTab('users')}>
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.userCount}</div>
            <div className="stat-label">{t('admin.common.usersOpen')}</div>
          </div>
        </button>
        <button type="button" className="stat-item stat-item-action" onClick={() => onNavigateToTab('products')}>
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <div className="stat-value">{stats.productCount}</div>
            <div className="stat-label">{t('admin.common.productsOpen')}</div>
          </div>
        </button>
        <button type="button" className="stat-item stat-item-action" onClick={() => onNavigateToTab('orders')}>
          <div className="stat-icon">🧾</div>
          <div className="stat-info">
            <div className="stat-value">{stats.orderCount}</div>
            <div className="stat-label">{t('admin.common.ordersOpen')}</div>
          </div>
        </button>
        <div className="stat-item">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats.pendingOrders}</div>
            <div className="stat-label">{t('admin.common.pendingOrders')}</div>
          </div>
        </div>
      </div>

      <div className="stats-grid products-stats">
        <div className="stat-item">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.lowStock + stats.outOfStock}</div>
            <div className="stat-label">{t('admin.common.needAttention')}</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🚫</div>
          <div className="stat-info">
            <div className="stat-value">{stats.outOfStock}</div>
            <div className="stat-label">{t('admin.common.outOfStock')}</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-value">${stats.inventoryValue.toFixed(0)}</div>
            <div className="stat-label">{t('admin.common.inventoryValue')}</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🏦</div>
          <div className="stat-info">
            <div className="stat-value">${stats.totalRevenue.toFixed(0)}</div>
            <div className="stat-label">{t('admin.common.totalOrderValue')}</div>
          </div>
        </div>
      </div>

      <div className="list">
        <h3 style={{ marginTop: 0 }}>{t('admin.common.recentOrders')}</h3>
        {loading ? (
          <p className="muted">{t('admin.common.loading')}</p>
        ) : recentOrders.length === 0 ? (
          <p className="muted">{t('admin.common.noOrdersFound')}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{t('admin.common.id')}</th>
                <th>{t('admin.common.userId')}</th>
                <th>{t('admin.common.status')}</th>
                <th>{t('admin.common.total')}</th>
                <th>{t('admin.common.created')}</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order: OrderSummary) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.userId ?? '-'}</td>
                  <td>{order.status || '-'}</td>
                  <td>{typeof order.totalPrice === 'number' ? formatPriceHUF(order.totalPrice) : '-'}</td>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
