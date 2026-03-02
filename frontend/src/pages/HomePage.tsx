import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useToast } from '../contexts/ToastContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const prods = await api.getProducts();

        // Safety check: ensure prods is an array
        if (!Array.isArray(prods)) {
          showToast('Failed to load products', 'error');
          return;
        }

        const featured = prods.slice(0, 12); // Show first 12 products for carousel
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
        showToast('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (products.length <= 4) return; // Don't auto-scroll if few products
    
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % Math.ceil(products.length / 4));
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [products.length]);

  const handleShopNow = () => {
    navigate('/shop/all');
  };

  const handleViewAll = () => {
    navigate('/shop/all');
  };

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + Math.ceil(products.length / 4)) % Math.ceil(products.length / 4));
  };

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % Math.ceil(products.length / 4));
  };

  const carouselProducts = products.slice(carouselIndex * 4, (carouselIndex + 1) * 4);

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
          <>
            <div className="carousel-container">
              <button className="carousel-btn carousel-btn-prev" onClick={handlePrevCarousel} aria-label="Previous">
                ❮
              </button>
              <div className="grid-products carousel-grid">
                {carouselProducts.map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <button className="carousel-btn carousel-btn-next" onClick={handleNextCarousel} aria-label="Next">
                ❯
              </button>
            </div>
            <div className="carousel-indicators">
              {Array.from({ length: Math.ceil(products.length / 4) }).map((_, idx) => (
                <button
                  key={idx}
                  className={`carousel-dot ${idx === carouselIndex ? 'active' : ''}`}
                  onClick={() => setCarouselIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
        <div className="featured-footer">
          <button onClick={handleViewAll} className="btn-secondary">View All Products</button>
        </div>
      </section>
    </div>
  );
}
