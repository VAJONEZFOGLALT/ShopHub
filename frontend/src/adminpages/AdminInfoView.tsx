import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

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

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
};

export default function AdminInfoView({ onNavigateToTab }: AdminInfoViewProps) {
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
      setError(getErrorMessage(e));
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
      <h2>Overview</h2>
      {error && <div className="error">{error}</div>}

      <div className="stats-grid products-stats">
        <button type="button" className="stat-item stat-item-action" onClick={() => onNavigateToTab('users')}>
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.userCount}</div>
            <div className="stat-label">Users (open users page)</div>
          </div>
        </button>
        <button type="button" className="stat-item stat-item-action" onClick={() => onNavigateToTab('products')}>
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <div className="stat-value">{stats.productCount}</div>
            <div className="stat-label">Products (open products page)</div>
          </div>
        </button>
        <button type="button" className="stat-item stat-item-action" onClick={() => onNavigateToTab('orders')}>
          <div className="stat-icon">🧾</div>
          <div className="stat-info">
            <div className="stat-value">{stats.orderCount}</div>
            <div className="stat-label">Orders (open orders page)</div>
          </div>
        </button>
        <div className="stat-item">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats.pendingOrders}</div>
            <div className="stat-label">Pending orders</div>
          </div>
        </div>
      </div>

      <div className="stats-grid products-stats">
        <div className="stat-item">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.lowStock + stats.outOfStock}</div>
            <div className="stat-label">Need attention (low/out)</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🚫</div>
          <div className="stat-info">
            <div className="stat-value">{stats.outOfStock}</div>
            <div className="stat-label">Out of stock</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-value">${stats.inventoryValue.toFixed(0)}</div>
            <div className="stat-label">Inventory value</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🏦</div>
          <div className="stat-info">
            <div className="stat-value">${stats.totalRevenue.toFixed(0)}</div>
            <div className="stat-label">Total order value</div>
          </div>
        </div>
      </div>

      <div className="list">
        <h3 style={{ marginTop: 0 }}>Recent Orders</h3>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : recentOrders.length === 0 ? (
          <p className="muted">No orders found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Status</th>
                <th>Total</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order: OrderSummary) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.userId ?? '-'}</td>
                  <td>{order.status || '-'}</td>
                  <td>{typeof order.totalPrice === 'number' ? `$${order.totalPrice.toFixed(2)}` : '-'}</td>
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
