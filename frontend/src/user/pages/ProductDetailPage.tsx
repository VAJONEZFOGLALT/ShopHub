import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { useCart } from '../CartContext';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { add } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const products = await api.getProducts();
        let found: any = null;
        const targetId = Number(id);
        for (let i = 0; i < products.length; i += 1) {
          if (products[i].id === targetId) {
            found = products[i];
            break;
          }
        }
        if (!found) {
          throw new Error('Product not found');
        }
        setProduct(found);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  function handleAdd() {
    if (product) {
      const payload = { productId: product.id, name: product.name, price: Number(product.price) };
      add(payload, quantity);
      navigate('/shop/cart');
    }
  }

  if (loading) return <div className="view"><p>Loading…</p></div>;
  if (error) return <div className="view"><div className="error">{error}</div></div>;
  if (!product) return <div className="view"><p>Product not found.</p></div>;

  return (
    <div className="view product-detail">
      <button onClick={() => navigate('/shop')}>← Back</button>
      <div className="detail-content">
        <div className="detail-left">
          {product.image ? <img src={product.image} alt={product.name} className="product-image" /> : <div className="product-image">{product.name}</div>}
        </div>
        <div className="detail-right">
          <h1>{product.name}</h1>
          <div className="detail-meta">
            <span className="category">Category: {product.category}</span>
            <span className="stock">Stock: {product.stock}</span>
          </div>
          <p className="description">{product.description || 'No description available.'}</p>
          <div className="detail-footer">
            <div className="price-large">{Number(product.price).toFixed(2)}</div>
            <div className="qty-selector">
              <label>Quantity:</label>
              <input type="number" min={1} max={product.stock || 999} value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
            </div>
            <button onClick={handleAdd} className="btn-primary">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
