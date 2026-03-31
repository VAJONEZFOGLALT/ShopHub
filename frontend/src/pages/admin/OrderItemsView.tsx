import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ADMIN_UI, formatPageLabel } from './adminUiText';

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
      setError('A rendelés azonosítója legyen 0-nál nagyobb');
      return;
    }
    if (Number(form.productId) <= 0) {
      setError('A termék azonosítója legyen 0-nál nagyobb');
      return;
    }
    if (Number(form.quantity) < 1) {
      setError('A mennyiség legalább 1 legyen');
      return;
    }
    if (Number(form.price) < 0) {
      setError('Az ár nem lehet negatív');
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
    const message = 'Biztosan törlöd a tételt? #' + id;
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
      <h2>Rendelési tételek</h2>
      {error && <div className="error">{error}</div>}
      <form className="form" onSubmit={onCreate}>
        <div className="grid">
          <label>
            <span>Rendelés ID</span>
            <input type="number" value={form.orderId} onChange={e => updateForm({ orderId: Number(e.target.value) })} required />
          </label>
          <label>
            <span>Termék ID</span>
            <input type="number" value={form.productId} onChange={e => updateForm({ productId: Number(e.target.value) })} required />
          </label>
          <label>
            <span>Mennyiség</span>
            <input type="number" min={1} value={form.quantity} onChange={e => updateForm({ quantity: Number(e.target.value) })} required />
          </label>
          <label>
            <span>Ár</span>
            <input type="number" step="0.01" min={0} value={form.price} onChange={e => updateForm({ price: Number(e.target.value) })} required />
          </label>
        </div>
        <button type="submit" disabled={loading}>Tétel létrehozása</button>
      </form>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Keresés ID, rendelés ID vagy termék ID alapján"
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
                <th>Rendelés ID</th>
                <th>Termék ID</th>
                <th>Mennyiség</th>
                <th>Ár</th>
                <th>{ADMIN_UI.actions}</th>
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
          <p className="muted">{ADMIN_UI.empty}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Rendelés ID</th>
                <th>Termék ID</th>
                <th>Mennyiség</th>
                <th>Ár</th>
                <th>{ADMIN_UI.actions}</th>
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
                  <td><button className="danger" onClick={() => onDelete(oi.id)}>Törlés</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && filtered.length > pageSize && (
        <div className="pager">
          <button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
            {ADMIN_UI.previous}
          </button>
          <span className="muted">{formatPageLabel(currentPage, totalPages)}</span>
          <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>
            {ADMIN_UI.next}
          </button>
        </div>
      )}
    </div>
  );
}
