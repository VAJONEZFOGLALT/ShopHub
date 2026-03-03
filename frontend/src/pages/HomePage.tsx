import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useToast } from '../contexts/ToastContext';

const getProductCategory = (product: any) => {
  const rawCategory = product?.category ?? product?.categoryName ?? product?.category?.name;
  if (typeof rawCategory !== 'string') {
    return '';
  }
  return rawCategory.trim();
};

const getProductCategoryLabel = (product: any) => {
  const rawCategory = product?.categoryLabel ?? product?.category ?? product?.categoryName ?? product?.category?.name;
  if (typeof rawCategory !== 'string') {
    return '';
  }
  return rawCategory.trim();
};

export default function HomePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Array<{ key: string; label: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const prods = await api.getProducts(i18n.language);

        // Safety check: ensure prods is an array
        if (!Array.isArray(prods)) {
          showToast('Failed to load products', 'error');
          return;
        }

        const featured = prods.slice(0, 12); // Show first 12 products for carousel
        setProducts(featured);

        const unique: Record<string, boolean> = {};
        const collected: Array<{ key: string; label: string }> = [];
        for (let i = 0; i < prods.length; i += 1) {
          const cat = getProductCategory(prods[i]);
          const label = getProductCategoryLabel(prods[i]);
          if (cat && !unique[cat]) {
            unique[cat] = true;
            collected.push({ key: cat, label: label || cat });
          }
        }
        collected.sort((a, b) => a.label.localeCompare(b.label));
        setCategories(collected);
      } catch (e) {
        showToast('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [i18n.language]);

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
          <h1>{t('home.welcome')}</h1>
          <p>{t('home.subtitle')}</p>
          <button onClick={handleShopNow} className="btn-primary">{t('home.shopNow')}</button>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="categories-showcase">
        <h2>{t('home.featuredCategories')}</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.key} className="category-card" onClick={() => navigate(`/shop/category/${encodeURIComponent(cat.key)}`)}>
              <div className="category-card-icon">📦</div>
              <h3>{cat.label}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h2>{t('home.featuredProducts')}</h2>
        {loading ? (
          <p>{t('common.loading')}</p>
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
          <button onClick={handleViewAll} className="btn-secondary">{t('home.viewAllProducts')}</button>
        </div>
      </section>
    </div>
  );
}
