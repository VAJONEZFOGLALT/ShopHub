import { useEffect, useState } from 'react';
import { api } from '../api';

export default function OrderItemsView() {
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ orderId: 0, productId: 0, quantity: 1, price: 0 });

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

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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

      <div className="list">
        {loading ? <p>Loading…</p> : (
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
              {orderItems?.map((oi: any) => (
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
    </div>
  );
}
