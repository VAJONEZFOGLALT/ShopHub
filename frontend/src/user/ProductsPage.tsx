import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import ProductCard from './components/ProductCard';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const handleNavigate = (id: number) => {
    navigate(`/shop/product/${id}`);
  };

  return (
    <div className="view">
      <h2>Products</h2>
      {error && <div className="error">{error}</div>}

      {loading ? <p>Loading…</p> : (
        <div className="grid-products">
          {products.map((p: any) => (
            <div key={p.id} onClick={() => handleNavigate(p.id)} style={{ cursor: 'pointer' }}>
              <ProductCard product={p} disableNav={true} />
            </div>
          ))}
          {products.length === 0 && <p>No products found.</p>}
        </div>
      )}
    </div>
  );
}
