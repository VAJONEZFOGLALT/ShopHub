import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function OrderItemsView() {
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ orderId: 0, productId: 0, quantity: 1, price: 0 });
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const skeletonRows = Array.from({ length: 5 });

  const updateForm = (patch: Partial<typeof form>) => {
    setForm(prev => ({ ...prev, ...patch }));
  };

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getOrderItems();
      setOrderItems(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);
  useEffect(() => { setPage(1); }, [query]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (Number(form.orderId) <= 0) {
      setError('Order ID must be greater than 0');
      return;
    }
    if (Number(form.productId) <= 0) {
      setError('Product ID must be greater than 0');
      return;
    }
    if (Number(form.quantity) < 1) {
      setError('Quantity must be at least 1');
      return;
    }
    if (Number(form.price) < 0) {
      setError('Price must be 0 or more');
      return;
    }
    try {
      const payload = {
        orderId: Number(form.orderId),
        productId: Number(form.productId),
        quantity: Number(form.quantity),
        price: Number(form.price),
      };
      await api.createOrderItem(payload);
      setForm({ orderId: 0, productId: 0, quantity: 1, price: 0 });
      await load();
    } catch (e: any) { setError(e.message); }
  }

  async function onDelete(id: number) {
    const message = 'Delete item #' + id + '?';
    const ok = confirm(message);
    if (!ok) {
      return;
    }
    try {
      await api.deleteOrderItem(id);
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  const trimmed = query.trim().toLowerCase();
  const filtered = trimmed
    ? orderItems.filter((oi: any) =>
        String(oi.id || '').toLowerCase().includes(trimmed) ||
        String(oi.orderId || '').toLowerCase().includes(trimmed) ||
        String(oi.productId || '').toLowerCase().includes(trimmed)
      )
    : orderItems;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedItems = filtered.slice(start, start + pageSize);

  return (
    <div className="view">
      <h2>Order Items</h2>
      {error && <div className="error">{error}</div>}
      <form className="form" onSubmit={onCreate}>
        <div className="grid">
          <label>
            <span>Order ID</span>
            <input type="number" value={form.orderId} onChange={e => updateForm({ orderId: Number(e.target.value) })} required />
          </label>
          <label>
            <span>Product ID</span>
            <input type="number" value={form.productId} onChange={e => updateForm({ productId: Number(e.target.value) })} required />
          </label>
          <label>
            <span>Quantity</span>
            <input type="number" min={1} value={form.quantity} onChange={e => updateForm({ quantity: Number(e.target.value) })} required />
          </label>
          <label>
            <span>Price</span>
            <input type="number" step="0.01" min={0} value={form.price} onChange={e => updateForm({ price: Number(e.target.value) })} required />
          </label>
        </div>
        <button type="submit" disabled={loading}>Create Order Item</button>
      </form>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by id, order id, product id"
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
                <th>Order ID</th>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skeletonRows.map((_, idx) => (
                <tr key={`s-${idx}`}>
                  <td><div className="skeleton-line" /></td>
                  <td><div className="skeleton-line" /></td>
                  <td><div className="skeleton-line" /></td>
                  <td><div className="skeleton-line" /></td>
                  <td><div className="skeleton-line" /></td>
                  <td><div className="skeleton-line" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : pagedItems.length === 0 ? (
          <p className="muted">No order items found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Order ID</th>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedItems.map((oi: any) => (
                <tr key={oi.id}>
                  <td>{oi.id}</td>
                  <td>{oi.orderId}</td>
                  <td>{oi.productId}</td>
                  <td>{oi.quantity}</td>
                  <td>{oi.price}</td>
                  <td><button className="danger" onClick={() => onDelete(oi.id)}>Delete</button></td>
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
