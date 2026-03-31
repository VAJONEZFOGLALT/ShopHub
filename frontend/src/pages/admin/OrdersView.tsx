import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ADMIN_UI, formatPageLabel } from './adminUiText';

type OrderItemInput = { productId: number; quantity: number };

export default function OrdersView() {
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
      setError('A felhasználó azonosítója legyen 0-nál nagyobb');
      return;
    }
    if (items.length === 0) {
      setError('Adj hozzá legalább egy tételt');
      return;
    }
    try {
      const mappedItems: { productId: number; quantity: number }[] = [];
      for (let i = 0; i < items.length; i += 1) {
        const it = items[i];
        if (Number(it.productId) <= 0) {
          setError('A termék azonosítója legyen 0-nál nagyobb');
          return;
        }
        if (Number(it.quantity) < 1) {
          setError('A mennyiség legalább 1 legyen');
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
    const message = 'Biztosan törlöd a rendelést? #' + id;
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
      <h2>Rendelések</h2>
      {error && <div className="error">{error}</div>}
      <form className="form" onSubmit={onCreate}>
        <div className="grid">
          <label>
            <span>Felhasználó ID</span>
            <input type="number" value={userId} onChange={e => setUserId(Number(e.target.value))} required />
          </label>
        </div>
        <div className="items">
          <h3>Tételek</h3>
          {items.map((it, idx) => (
            <div key={idx} className="item-row">
              <label>
                <span>Termék ID</span>
                <input type="number" value={it.productId} onChange={e => updateItem(idx, { productId: Number(e.target.value) })} required />
              </label>
              <label>
                <span>Mennyiség</span>
                <input type="number" min={1} value={it.quantity} onChange={e => updateItem(idx, { quantity: Number(e.target.value) })} required />
              </label>
              <button type="button" className="danger" onClick={() => removeItem(idx)}>Eltávolítás</button>
            </div>
          ))}
          <button type="button" onClick={addItem}>Tétel hozzáadása</button>
        </div>
        <button type="submit" disabled={loading}>Rendelés létrehozása</button>
      </form>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Keresés rendelés ID vagy felhasználó ID alapján"
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
                <th>Felhasználó ID</th>
                <th>Felhasználónév</th>
                <th>Termékek</th>
                <th>Összesen</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        ) : pagedOrders.length === 0 ? (
          <p className="muted">{ADMIN_UI.empty}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Felhasználó ID</th>
                <th>Felhasználónév</th>
                <th>Termékek</th>
                <th>Összesen</th>
                <th>Teljesítve</th>
                <th>{ADMIN_UI.actions}</th>
              </tr>
            </thead>
            <tbody>
              {pagedOrders.map((o: any) => {
                const user = users.find((u: any) => u.id === o.userId);
                return (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.userId}</td>
                    <td>{user ? user.name : '-'}</td>
                    <td>
                      {Array.isArray(o.orderItems) && o.orderItems.length > 0 ? (
                        <ul style={{margin:0,padding:0,listStyle:'none'}}>
                          {o.orderItems.map((item: any) => {
                            const product = products.find((p: any) => p.id === item.productId);
                            return (
                              <li key={item.id}>
                                {product ? product.name : `ID: ${item.productId}`} (x{item.quantity})
                              </li>
                            );
                          })}
                        </ul>
                      ) : <span className="muted">Nincsenek tételek</span>}
                    </td>
                    <td>{typeof o.totalPrice === 'number' ? o.totalPrice.toFixed(2) : '-'}</td>
                    <td>
                      <button
                        className={o.teljesitve ? "fulfilled" : "danger"}
                        style={{
                          marginLeft: 4,
                          backgroundColor: o.teljesitve ? '#2ecc40' : '#ffeb3b',
                          color: o.teljesitve ? 'white' : '#333',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                        }}
                        onClick={async () => {
                          await api.fulfillOrder(o.id, !o.teljesitve);
                          await load();
                        }}
                      >
                        {o.teljesitve ? 'Vond vissza' : 'Teljesítsd'}
                      </button>
                    </td>
                    <td><button className="danger" onClick={() => onDelete(o.id)}>Törlés</button></td>
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
