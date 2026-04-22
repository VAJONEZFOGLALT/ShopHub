import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

export default function OrderConfirmationPage({ orderId }: { orderId?: number }) {
  const navigate = useNavigate();
  const { clear } = useCart();

  const handleContinue = () => {
    clear();
    navigate('/shop');
  };

  const handleViewCart = () => {
    navigate('/shop/cart');
  };

  return (
    <div className="view confirmation">
      <div className="confirmation-content">
        <div className="checkmark">✓</div>
        <h1>Order Placed Successfully!</h1>
        {orderId && <p>Order ID: <strong>#{orderId}</strong></p>}
        <p>Thank you for your purchase. Your order has been confirmed and will be processed shortly.</p>
        <div className="confirmation-actions">
          <button onClick={handleContinue}>Continue Shopping</button>
          <button onClick={handleViewCart}>View Cart</button>
        </div>
      </div>
    </div>
  );
}
