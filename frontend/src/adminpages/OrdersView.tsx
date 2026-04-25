import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { formatPriceHUF } from '../utils/currency';

type OrderItemInput = { productId: number; quantity: number };

export default function OrdersView() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<number>(0);
  const [items, setItems] = useState<OrderItemInput[]>([{ productId: 0, quantity: 1 }]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const skeletonRows = Array.from({ length: 5 });

  const getProductLabel = (productId: number, fallbackName?: string) => {
    if (fallbackName && fallbackName.trim().length > 0) {
      return fallbackName;
    }
    const product = products.find((p: any) => p.id === productId);
    if (product?.name) {
      return product.name;
    }
    return `#${productId}`;
  };

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [ordersData, productsData, usersData] = await Promise.all([
        api.getOrders(),
        api.getProducts(),
        api.getUsers()
      ]);
      setOrders(ordersData);
      setProducts(productsData);
      setUsers(usersData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);
  useEffect(() => { setPage(1); }, [query]);

  function addItem() {
    const next = items.slice();
    next.push({ productId: 0, quantity: 1 });
    setItems(next);
  }
  function updateItem(index: number, patch: Partial<OrderItemInput>) {
    const next = items.slice();
    for (let i = 0; i < next.length; i += 1) {
      if (i === index) {
        next[i] = { ...next[i], ...patch };
      }
    }
    setItems(next);
  }
  function removeItem(index: number) {
    const next: OrderItemInput[] = [];
    for (let i = 0; i < items.length; i += 1) {
      if (i !== index) {
        next.push(items[i]);
      }
    }
    setItems(next);
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (Number(userId) <= 0) {
      setError(t('admin.common.userIdPositive'));
      return;
    }
    if (items.length === 0) {
      setError(t('admin.common.addAtLeastOneItem'));
      return;
    }
    try {
      const mappedItems: { productId: number; quantity: number }[] = [];
      for (let i = 0; i < items.length; i += 1) {
        const it = items[i];
        if (Number(it.productId) <= 0) {
          setError(t('admin.common.productIdPositive'));
          return;
        }
        if (Number(it.quantity) < 1) {
          setError(t('admin.common.quantityAtLeastOne'));
          return;
        }
        mappedItems.push({ productId: Number(it.productId), quantity: Number(it.quantity) });
      }
      const payload = { userId: Number(userId), items: mappedItems };
      await api.createOrder(payload);
      setUserId(0);
      setItems([{ productId: 0, quantity: 1 }]);
      await load();
    } catch (e: any) { setError(e.message); }
  }

  async function onDelete(id: number) {
    const message = t('admin.common.confirmDeleteOrder', { id });
    const ok = confirm(message);
    if (!ok) {
      return;
    }
    try {
      await api.deleteOrder(id);
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  const trimmed = query.trim().toLowerCase();
  const filtered = trimmed
    ? orders.filter((o: any) =>
        String(o.id || '').toLowerCase().includes(trimmed) ||
        String(o.userId || '').toLowerCase().includes(trimmed)
      )
    : orders;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedOrders = filtered.slice(start, start + pageSize);

  return (
    <div className="view">
      <h2>{t('admin.orders')}</h2>
      {error && <div className="error">{error}</div>}
      <form className="form" onSubmit={onCreate}>
        <div className="grid">
          <label>
            <span>{t('admin.common.userId')}</span>
            <input type="number" value={userId} onChange={e => setUserId(Number(e.target.value))} required />
          </label>
        </div>
        <div className="items">
          <h3>{t('admin.common.items')}</h3>
          {items.map((it, idx) => (
            <div key={idx} className="item-row">
              <label>
                <span>{t('admin.common.productId')}</span>
                <select value={it.productId > 0 ? it.productId : ''} onChange={e => updateItem(idx, { productId: Number(e.target.value) })} required>
                  <option value="" disabled>{t('admin.common.productId')}</option>
                  {products.map((product: any) => (
                    <option key={product.id} value={product.id}>
                      {product.id} - {product.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{t('admin.common.quantity')}</span>
                <input type="number" min={1} value={it.quantity} onChange={e => updateItem(idx, { quantity: Number(e.target.value) })} required />
              </label>
              <button type="button" className="danger" onClick={() => removeItem(idx)}>{t('admin.common.remove')}</button>
            </div>
          ))}
          <button type="button" onClick={addItem}>{t('admin.common.addItem')}</button>
        </div>
        <button type="submit" disabled={loading}>{t('admin.common.createOrder')}</button>
      </form>
      <div className="search-bar">
        <input
          type="text"
          placeholder={t('admin.common.searchByOrderIdOrUserId')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="list">
        {loading ? (
          <table>
            <thead>
              <tr>
                <th>{t('admin.common.id')}</th>
                <th>{t('admin.common.userId')}</th>
                <th>{t('admin.common.userName')}</th>
                <th>{t('admin.common.products')}</th>
                <th>{t('admin.common.total')}</th>
                <th>{t('admin.common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {skeletonRows.map((_, idx) => (
                <tr key={`s-${idx}`}>
                  <td><div className="skeleton-line" /></td>
                  <td><div className="skeleton-line" /></td>
                  <td><div className="skeleton-line" /></td>
                  <td><div className="skeleton-line" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : pagedOrders.length === 0 ? (
          <p className="muted">{t('admin.common.noOrdersFound')}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{t('admin.common.id')}</th>
                <th>{t('admin.common.userId')}</th>
                <th>{t('admin.common.userName')}</th>
                <th>{t('admin.common.products')}</th>
                <th>{t('admin.common.total')}</th>
                <th>{t('admin.common.status')}</th>
                <th>{t('admin.common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {pagedOrders.map((o: any) => {
                const user = users.find((u: any) => u.id === o.userId);
                const statusUpper = String(o.status || '').toUpperCase();
                return (
                  <tr key={o.id} className={statusUpper === 'DELIVERED' ? 'order-row-fulfilled' : ''}>
                    <td>{o.id}</td>
                    <td>{o.userId}</td>
                    <td>{user ? user.name : '-'}</td>
                    <td>
                      {Array.isArray(o.orderItems) && o.orderItems.length > 0 ? (
                        <ul style={{margin:0,padding:0,listStyle:'none'}}>
                          {o.orderItems.map((item: any) => {
                            return (
                              <li key={item.id}>
                                {getProductLabel(item.productId, item.product?.name)} (x{item.quantity})
                              </li>
                            );
                          })}
                        </ul>
                      ) : <span className="muted">{t('admin.common.noItems')}</span>}
                    </td>
                    <td>{typeof o.totalPrice === 'number' ? formatPriceHUF(Number(o.totalPrice)) : '-'}</td>
                    <td>
                      <select
                        value={(o.status || 'PENDING').toUpperCase()}
                        onChange={async (e) => {
                          const next = e.target.value;
                          try {
                            await api.updateOrderStatus(o.id, next);
                            await load();
                          } catch (err: any) {
                            setError(err?.message || String(err));
                          }
                        }}
                      >
                        <option value="PENDING">{t('admin.status.pending')}</option>
                        <option value="PROCESSING">{t('admin.status.processing')}</option>
                        <option value="SHIPPED">{t('admin.status.shipped')}</option>
                        <option value="DELIVERED">{t('admin.status.delivered')}</option>
                        <option value="CANCELLED">{t('admin.status.cancelled')}</option>
                      </select>
                    </td>
                    <td><button className="danger" onClick={() => onDelete(o.id)}>{t('admin.common.delete')}</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {!loading && filtered.length > pageSize && (
        <div className="pager">
          <button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
            {t('admin.common.prev')}
          </button>
          <span className="muted">{t('admin.common.page', { current: currentPage, total: totalPages })}</span>
          <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>
            {t('admin.common.next')}
          </button>
        </div>
      )}
    </div>
  );
}
