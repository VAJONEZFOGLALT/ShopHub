import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const prods = await api.getProducts();

        const featured = prods.slice(0, 8); // Show first 8 products
        setProducts(featured);

        const unique: Record<string, boolean> = {};
        const collected: string[] = [];
        for (let i = 0; i < prods.length; i += 1) {
          const cat = prods[i]?.category;
          if (cat && !unique[cat]) {
            unique[cat] = true;
            collected.push(cat);
          }
        }
        collected.sort();
        setCategories(collected);
      } catch (e) {
        console.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleShopNow = () => {
    navigate('/shop/all');
  };

  const handleViewAll = () => {
    navigate('/shop/all');
  };

  return (
    <div className="view">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Welcome to ShopHub</h1>
          <p>Discover amazing products across all categories</p>
          <button onClick={handleShopNow} className="btn-primary">Shop Now</button>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="categories-showcase">
        <h2>Featured Categories</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat} className="category-card" onClick={() => navigate(`/shop/category/${cat}`)}>
              <div className="category-card-icon">📦</div>
              <h3>{cat}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h2>Featured Products</h2>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="grid-products">
            {products.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        <div className="featured-footer">
          <button onClick={handleViewAll} className="btn-secondary">View All Products</button>
        </div>
      </section>
    </div>
  );
}
