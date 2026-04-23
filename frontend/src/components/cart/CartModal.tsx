import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';
import { formatPriceHUF } from '../../utils/currency';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { t } = useTranslation();
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
    const ok = confirm(t('cart.clearConfirm'));
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
          <h2>{t('cart.yourCart')}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
              <p style={{ fontSize: '4em', margin: '0 0 16px 0', lineHeight: '1' }}>🛒</p>
              <p style={{ fontSize: '1.2em', fontWeight: '600', marginBottom: '8px' }}>{t('cart.empty')}</p>
              <p style={{ fontSize: '0.9em', marginBottom: '24px' }}>{t('cart.getStarted')}</p>
              <button 
                className="btn-primary"
                onClick={() => {
                  onClose();
                  // Navigate to shop - you might need to use navigate hook
                  window.location.href = '/shop/all';
                }}
              >
                {t('profile.continueShopping')}
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {items.map(item => (
                <div key={item.productId} className="cart-item">
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">{formatPriceHUF(item.price)}</div>
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
                    <div className="cart-item-subtotal">{formatPriceHUF(item.price * item.quantity)}</div>
                    <button 
                      className="cart-item-remove" 
                      onClick={() => handleRemove(item.productId)}
                      title={t('cart.removeTitle')}
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
                <span>{t('cart.total')}</span>
                <span className="cart-total-amount">{formatPriceHUF(total)}</span>
              </div>

              <div className="cart-actions">
                <button 
                  className="btn-primary cart-checkout-btn" 
                  onClick={handleCheckout}
                >
                  {t('cart.proceedToCheckout')}
                </button>
                <button 
                  className="cart-clear-btn" 
                  onClick={handleClear}
                >
                  {t('cart.clear')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
