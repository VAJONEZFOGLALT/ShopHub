import { useEffect, useState } from 'react';
import { api } from '../services/api';

type OrderItemInput = { productId: number; quantity: number };

export default function OrdersView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<number>(0);
  const [items, setItems] = useState<OrderItemInput[]>([{ productId: 0, quantity: 1 }]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const skeletonRows = Array.from({ length: 5 });

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getOrders();
      setOrders(data);
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
      setError('User ID must be greater than 0');
      return;
    }
    if (items.length === 0) {
      setError('Add at least one item');
      return;
    }
    try {
      const mappedItems: { productId: number; quantity: number }[] = [];
      for (let i = 0; i < items.length; i += 1) {
        const it = items[i];
        if (Number(it.productId) <= 0) {
          setError('Product ID must be greater than 0');
          return;
        }
        if (Number(it.quantity) < 1) {
          setError('Quantity must be at least 1');
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
    const message = 'Delete order #' + id + '?';
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
      <h2>Orders</h2>
      {error && <div className="error">{error}</div>}
      <form className="form" onSubmit={onCreate}>
        <div className="grid">
          <label>
            <span>User ID</span>
            <input type="number" value={userId} onChange={e => setUserId(Number(e.target.value))} required />
          </label>
        </div>
        <div className="items">
          <h3>Items</h3>
          {items.map((it, idx) => (
            <div key={idx} className="item-row">
              <label>
                <span>Product ID</span>
                <input type="number" value={it.productId} onChange={e => updateItem(idx, { productId: Number(e.target.value) })} required />
              </label>
              <label>
                <span>Quantity</span>
                <input type="number" min={1} value={it.quantity} onChange={e => updateItem(idx, { quantity: Number(e.target.value) })} required />
              </label>
              <button type="button" className="danger" onClick={() => removeItem(idx)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addItem}>Add Item</button>
        </div>
        <button type="submit" disabled={loading}>Create Order</button>
      </form>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by order id or user id"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="list">
        {loading ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skeletonRows.map((_, idx) => (
                <tr key={`s-${idx}`}>
                  <td><div className="skeleton-line" /></td>
                  <td><div className="skeleton-line" /></td>
                  <td><div className="skeleton-line" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : pagedOrders.length === 0 ? (
          <p className="muted">No orders found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedOrders.map((o: any) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.userId}</td>
                  <td><button className="danger" onClick={() => onDelete(o.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && filtered.length > pageSize && (
        <div className="pager">
          <button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
            Prev
          </button>
          <span className="muted">Page {currentPage} of {totalPages}</span>
          <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
