import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../api';
import ProductCard from '../components/ProductCard';

export default function AllProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rawSearch = searchParams.get('search');
  let searchQuery = '';
  if (rawSearch) {
    searchQuery = rawSearch.toLowerCase();
  }

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

  const filteredProducts = useMemo(() => {
    if (!searchQuery) {
      return products;
    }
    const result: any[] = [];
    for (let i = 0; i < products.length; i += 1) {
      const p = products[i];
      const nameMatch = p.name.toLowerCase().includes(searchQuery);
      const descriptionMatch = p.description && p.description.toLowerCase().includes(searchQuery);
      const categoryMatch = p.category.toLowerCase().includes(searchQuery);
      if (nameMatch || descriptionMatch || categoryMatch) {
        result.push(p);
      }
    }
    return result;
  }, [products, searchQuery]);

  return (
    <div className="view">
      <h2>{searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}</h2>
      {error && <div className="error">{error}</div>}

      {loading ? <p>Loading…</p> : (
        <div className="grid-products">
          {filteredProducts.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {filteredProducts.length === 0 && <p>{searchQuery ? 'No products found matching your search.' : 'No products found.'}</p>}
        </div>
      )}
    </div>
  );
}
