import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function HomePage() {
  const FEATURED_PAGE_SIZE = 5;
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Array<{ key: string; label: string; viewsCount: number; productCount: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [featuredPage, setFeaturedPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const showcase = await api.getFeaturedShowcase(i18n.language);
        const featuredProducts = Array.isArray(showcase.products) ? showcase.products : [];
        const featuredCategories = Array.isArray(showcase.categories) ? showcase.categories : [];
        setProducts(featuredProducts);
        setCategories(featuredCategories);
        setFeaturedPage(1);
      } catch (e) {
        showToast(t('home.failedToLoadData'), 'error');
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

  const totalFeaturedPages = Math.max(1, Math.ceil(products.length / FEATURED_PAGE_SIZE));
  const safeFeaturedPage = Math.min(featuredPage, totalFeaturedPages);
  const pageStart = (safeFeaturedPage - 1) * FEATURED_PAGE_SIZE;
  const pagedFeaturedProducts = products.slice(pageStart, pageStart + FEATURED_PAGE_SIZE);
  const displayedCategories = categories.slice(0, 3);
  const canNavigateFeatured = totalFeaturedPages > 1;
  const isPrevDisabled = !canNavigateFeatured || safeFeaturedPage <= 1;
  const isNextDisabled = !canNavigateFeatured || safeFeaturedPage >= totalFeaturedPages;
  const featuredColumns = Math.max(1, Math.min(FEATURED_PAGE_SIZE, pagedFeaturedProducts.length));

  const goPrevFeatured = () => {
    setFeaturedPage((prev) => Math.max(1, prev - 1));
  };

  const goNextFeatured = () => {
    setFeaturedPage((prev) => Math.min(totalFeaturedPages, prev + 1));
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
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="showcase-grid showcase-grid-categories">
            {displayedCategories.map((cat) => (
              <div key={cat.key} className="category-card category-card-centered" onClick={() => navigate(`/shop/category/${encodeURIComponent(cat.key)}`)}>
                <div className="category-card-icon">📦</div>
                <h3>{cat.label}</h3>
                <span className="showcase-meta">{t('home.viewsCount', { count: cat.viewsCount })}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h2>{t('home.featuredProducts')}</h2>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="carousel-container">
              <button className="carousel-btn carousel-btn-prev" onClick={goPrevFeatured} disabled={isPrevDisabled} aria-label={t('home.previousFeaturedProducts')}>
                ❮
              </button>
              <div
                className="grid-products carousel-grid carousel-grid-featured"
                style={{ ['--featured-cols' as any]: featuredColumns }}
              >
                {pagedFeaturedProducts.map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <button className="carousel-btn carousel-btn-next" onClick={goNextFeatured} disabled={isNextDisabled} aria-label={t('home.nextFeaturedProducts')}>
                ❯
              </button>
            </div>
            {totalFeaturedPages > 1 && (
              <div className="carousel-indicators">
                {Array.from({ length: totalFeaturedPages }).map((_, idx) => {
                  const page = idx + 1;
                  return (
                    <button
                      key={page}
                      className={`carousel-dot ${page === safeFeaturedPage ? 'active' : ''}`}
                      onClick={() => setFeaturedPage(page)}
                      aria-label={t('home.goToFeaturedPage', { page })}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
        <div className="featured-footer">
          <button onClick={handleViewAll} className="btn-secondary">{t('home.viewAllProducts')}</button>
        </div>
      </section>
    </div>
  );
}
