import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function HomePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Array<{ key: string; label: string; viewsCount: number; productCount: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const showcase = await api.getFeaturedShowcase(i18n.language);
        const featuredProducts = Array.isArray(showcase.products) ? showcase.products : [];
        const featuredCategories = Array.isArray(showcase.categories) ? showcase.categories : [];
        setProducts(featuredProducts);
        setCategories(featuredCategories);
      } catch (e) {
        showToast('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [i18n.language, showToast]);

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
          <h1>{t('home.welcome')}</h1>
          <p>{t('home.subtitle')}</p>
          <button onClick={handleShopNow} className="btn-primary">{t('home.shopNow')}</button>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="categories-showcase">
        <h2>{t('home.featuredCategories')}</h2>
        <p className="showcase-intro">A legtöbb megtekintést kapott kategóriák jelennek meg itt.</p>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="showcase-grid showcase-grid-categories">
            {categories.map((cat) => (
              <div key={cat.key} className="category-card category-card-centered" onClick={() => navigate(`/shop/category/${encodeURIComponent(cat.key)}`)}>
                <div className="category-card-icon">📦</div>
                <h3>{cat.label}</h3>
                <span className="showcase-meta">{cat.productCount} products · {cat.viewsCount} views</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h2>{t('home.featuredProducts')}</h2>
        <p className="showcase-intro">A legnézettebb termékekből válogatva.</p>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="showcase-grid showcase-grid-products">
            {products.map((p: any) => (
              <div key={p.id} className="product-card-shell">
                <ProductCard product={p} />
                <span className="showcase-meta">{p.viewsCount || 0} views</span>
              </div>
            ))}
          </div>
        )}
        <div className="featured-footer">
          <button onClick={handleViewAll} className="btn-secondary">{t('home.viewAllProducts')}</button>
        </div>
      </section>
    </div>
  );
}
