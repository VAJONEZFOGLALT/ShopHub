import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, disableNav }: { product: any; disableNav?: boolean }) {
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
  return (
    <div className="card product-card" onClick={handleOpen} style={{ cursor: cursorStyle }}>
      {product.image && <img src={product.image} alt={product.name} className="product-image" />}
      <div className="product-header">
        <h3>{product.name}</h3>
        <span className="product-category">{product.category}</span>
      </div>
      <div className="product-body">
        <div className="price">{Number(product.price).toFixed(2)}</div>
        {typeof product.stock === 'number' && <div className="stock">In stock: {product.stock}</div>}
      </div>
      <div className="product-actions">
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}
