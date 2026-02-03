import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, update, remove, total, clear } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/shop/checkout');
  };

  const handleDecrease = (productId: number, quantity: number) => {
    const next = Math.max(1, quantity - 1);
    update(productId, next);
  };

  const handleIncrease = (productId: number, quantity: number) => {
    const next = quantity + 1;
    update(productId, next);
  };

  const handleRemove = (productId: number) => {
    remove(productId);
  };

  const handleClear = () => {
    const ok = confirm('Clear all items from cart?');
    if (ok) {
      clear();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content cart-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🛒 Your Cart</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
              <p style={{ fontSize: '3em', margin: '0 0 16px 0' }}>🛒</p>
              <p style={{ fontSize: '1.1em' }}>Your cart is empty</p>
            </div>
          ) : (
            <div className="cart-items">
              {items.map(item => (
                <div key={item.productId} className="cart-item">
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">${item.price.toFixed(2)}</div>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-item-quantity">
                      <button 
                        className="qty-btn" 
                        onClick={() => handleDecrease(item.productId, item.quantity)}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button 
                        className="qty-btn" 
                        onClick={() => handleIncrease(item.productId, item.quantity)}
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</div>
                    <button 
                      className="cart-item-remove" 
                      onClick={() => handleRemove(item.productId)}
                      title="Remove"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <>
              <div className="cart-total">
                <span>Total:</span>
                <span className="cart-total-amount">${total.toFixed(2)}</span>
              </div>

              <div className="cart-actions">
                <button 
                  className="btn-primary cart-checkout-btn" 
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
                <button 
                  className="cart-clear-btn" 
                  onClick={handleClear}
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
