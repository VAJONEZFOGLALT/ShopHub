import { useCart } from '../CartContext';

export default function CartPage({ goCheckout }: { goCheckout: () => void }) {
  const { items, update, remove, total, clear } = useCart();

  const handleUpdate = (productId: number, value: string) => {
    const qty = Number(value);
    update(productId, qty);
  };

  const handleRemove = (productId: number) => {
    remove(productId);
  };

  const handleProceed = () => {
    goCheckout();
  };

  const handleClear = () => {
    clear();
  };

  return (
    <div className="view">
      <h2>Your Cart</h2>
      <div className="list">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Subtotal</th>
              <th></th>
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
                  <input type="number" min={1} value={it.quantity} onChange={e => handleUpdate(it.productId, e.target.value)} />
                </td>
                <td>{(it.price * it.quantity).toFixed(2)}</td>
                <td><button className="danger" onClick={() => handleRemove(it.productId)}>Remove</button></td>
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
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleProceed} disabled={items.length === 0}>Proceed to Checkout</button>
        <button className="danger" onClick={handleClear} disabled={items.length === 0}>Clear Cart</button>
      </div>
    </div>
  );
}
