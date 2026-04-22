import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { api } from '../api';

export default function CheckoutPage({ onSuccess }: { onSuccess?: (id: number) => void }) {
  const { items, update, remove, clear, total } = useCart();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [userId, setUserId] = useState<number>(0);
  const [userForm, setUserForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModeExisting = () => {
    setMode('existing');
  };

  const handleModeNew = () => {
    setMode('new');
  };

  const handleUserIdChange = (value: string) => {
    const num = Number(value);
    setUserId(num);
  };

  const handleUserFormChange = (patch: Partial<typeof userForm>) => {
    setUserForm(prev => ({ ...prev, ...patch }));
  };

  async function placeOrder() {
    setLoading(true);
    setError(null);
    try {
      let uid = userId;
      if (mode === 'new') {
        const created = await api.createUser(userForm);
        if (created && typeof created.id !== 'undefined') {
          uid = created.id;
        }
      }

      const itemPayload: { productId: number; quantity: number }[] = [];
      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        itemPayload.push({ productId: item.productId, quantity: item.quantity });
      }
      const payload = { userId: Number(uid), items: itemPayload };
      const order = await api.createOrder(payload);
      clear();
      if (onSuccess) {
        const orderId = order?.id ?? order;
        onSuccess(orderId);
      }
      navigate('/shop/confirmation');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="checkout-wrapper">
      <div className="view">
        <h2>Checkout</h2>
        {error && <div className="error">{error}</div>}

        <div className="list">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={5}>Your cart is empty.</td></tr>
              ) : items.map(it => (
                <tr key={it.productId}>
                  <td>{it.name}</td>
                  <td>{it.price.toFixed(2)}</td>
                  <td style={{ width: 100 }}>
                    <input type="number" min={1} value={it.quantity} onChange={e => update(it.productId, Number(e.target.value))} />
                  </td>
                  <td>{(it.price * it.quantity).toFixed(2)}</td>
                  <td><button className="danger" onClick={() => remove(it.productId)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right' }}>Total</td>
                <td>{total.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="form">
        <div className="nav" style={{ marginBottom: 12 }}>
          <button className={mode === 'existing' ? 'active' : ''} onClick={handleModeExisting}>Existing User</button>
          <button className={mode === 'new' ? 'active' : ''} onClick={handleModeNew}>New User</button>
        </div>
        {mode === 'existing' ? (
          <div className="grid">
            <label>
              <span>User ID</span>
              <input type="number" value={userId} onChange={e => handleUserIdChange(e.target.value)} required />
            </label>
          </div>
        ) : (
          <div className="grid">
            <label>
              <span>Username</span>
              <input value={userForm.username} onChange={e => handleUserFormChange({ username: e.target.value })} required />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={userForm.email} onChange={e => handleUserFormChange({ email: e.target.value })} required />
            </label>
            <label>
              <span>Password</span>
              <input type="password" value={userForm.password} onChange={e => handleUserFormChange({ password: e.target.value })} required />
            </label>
          </div>
        )}
        <button onClick={placeOrder} disabled={loading || items.length === 0}>Place Order</button>
      </div>
    </div>
  );
}
