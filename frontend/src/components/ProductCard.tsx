import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { getProductImageUrl } from '../utils/imageOptimization';

type ProductCardProps = {
  product: any;
  disableNav?: boolean;
  showWishlist?: boolean;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: number) => void;
  showCompare?: boolean;
  isCompared?: boolean;
  onToggleCompare?: (productId: number) => void;
  showStockBadge?: boolean;
};

export default function ProductCard({
  product,
  disableNav,
  showWishlist,
  isWishlisted,
  onToggleWishlist,
  showCompare,
  isCompared,
  onToggleCompare,
  showStockBadge,
}: ProductCardProps) {
  const { add } = useCart();
  const navigate = useNavigate();

  const canNavigate = !disableNav;

  const handleOpen = () => {
    if (canNavigate) {
      navigate(`/shop/product/${product.id}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const payload = { productId: product.id, name: product.name, price: Number(product.price) };
    add(payload, 1);
  };

  const cursorStyle = canNavigate ? 'pointer' : 'default';
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="card product-card" onClick={handleOpen} style={{ cursor: cursorStyle }}>
      <div className="product-media">
        {product.image ? (
          <img 
            src={getProductImageUrl(product.image)} 
            alt={product.name} 
            className="product-image"
            loading="lazy"
          />
        ) : (
          <div className="product-image-placeholder">{product.name}</div>
        )}
        {showStockBadge && (
          <span className={`stock-badge ${isOutOfStock ? 'out' : isLowStock ? 'low' : 'in'}`}>
            {isOutOfStock ? 'Out of stock' : isLowStock ? `Only ${product.stock} left` : 'In stock'}
          </span>
        )}
        {showWishlist && (
          <button
            type="button"
            className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(product.id); }}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            ♥
          </button>
        )}
        {showCompare && (
          <label
            className={`compare-toggle ${isCompared ? 'active' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={!!isCompared}
              onChange={() => onToggleCompare?.(product.id)}
            />
            Compare
          </label>
        )}
      </div>
      <div className="product-header">
        <h3>{product.name}</h3>
        <span className="product-category">{product.category}</span>
      </div>
      <div className="product-body">
        <div className="price">{Number(product.price).toFixed(2)}</div>
        {typeof product.stock === 'number' && <div className="stock">{isOutOfStock ? 'Out of stock' : `Stock: ${product.stock}`}</div>}
      </div>
      <div className="product-actions">
        <button onClick={handleAddToCart} disabled={isOutOfStock}>Add to Cart</button>
      </div>
    </div>
  );
}
