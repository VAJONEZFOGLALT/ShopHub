import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function OrderConfirmationPage({ orderId, onOrderViewed }: { orderId?: number; onOrderViewed?: () => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    // If no orderId is provided, redirect immediately
    if (!orderId) {
      navigate('/shop', { replace: true });
    }
  }, [orderId, navigate]);

  useEffect(() => {
    // Clear the orderId after the page is displayed
    return () => {
      if (onOrderViewed) {
        onOrderViewed();
      }
    };
  }, [onOrderViewed]);

  const handleContinue = () => {
    if (onOrderViewed) {
      onOrderViewed();
    }
    navigate('/shop');
  };

  const handleViewOrders = () => {
    if (onOrderViewed) {
      onOrderViewed();
    }
    navigate('/shop/orders');
  };

  // Don't render anything if no orderId
  if (!orderId) {
    return null;
  }

  return (
    <div className="view confirmation">
      <div className="confirmation-content">
        <div className="checkmark">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p>Order ID: <strong>#{orderId}</strong></p>
        <p>Thank you for your purchase. Your order has been confirmed and will be processed shortly.</p>
        <div className="confirmation-actions">
          <button onClick={handleContinue}>Go to Homepage</button>
          <button onClick={handleViewOrders}>View My Orders</button>
        </div>
      </div>
    </div>
  );
}
