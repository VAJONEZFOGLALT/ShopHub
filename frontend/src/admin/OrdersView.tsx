import { useEffect, useState } from 'react';
import { api } from '../api';

type OrderItemInput = { productId: number; quantity: number };

export default function OrdersView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<number>(0);
  const [items, setItems] = useState<OrderItemInput[]>([{ productId: 0, quantity: 1 }]);

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
    try {
      const mappedItems: { productId: number; quantity: number }[] = [];
      for (let i = 0; i < items.length; i += 1) {
        const it = items[i];
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

      <div className="list">
        {loading ? <p>Loading…</p> : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((o: any) => (
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
    </div>
  );
}
