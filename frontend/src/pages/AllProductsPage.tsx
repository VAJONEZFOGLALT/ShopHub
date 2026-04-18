import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import CompareDrawer from '../components/CompareDrawer';
import { useWishlist } from '../hooks/useWishlist';
import { useCompare } from '../hooks/useCompare';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function AllProductsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { wishlistIds, handleToggleWishlist, isWishlistPending, isWishlistLoading } = useWishlist();
  const { compareIds, compareItems, toggleCompare, clearCompare, isComparePending, isCompareLoading } = useCompare();

  const rawSearch = searchParams.get('search');
  let searchQuery = '';
  if (rawSearch) {
    searchQuery = rawSearch.toLowerCase();
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProducts(i18n.language);
      setProducts(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, [i18n.language]);

  const pageLoading = loading || isWishlistLoading || isCompareLoading;

  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchQuery]);

  const maxPrice = useMemo(() => {
    let max = 1000;
    if (products.length > 0) {
      max = products.reduce((acc, p) => Math.max(acc, p.price), products[0].price || 0);
    }
    return max;
  }, [products]);

  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  const filteredProducts = useMemo(() => {
    const loweredSearch = searchTerm.trim().toLowerCase();
    const result: any[] = [];
    const displayProducts = products;
    
    for (let i = 0; i < displayProducts.length; i += 1) {
      const p = displayProducts[i];
      if (categoryFilter !== 'all' && p.category !== categoryFilter) {
        continue;
      }
      if (p.price < priceRange[0] || p.price > priceRange[1]) {
        continue;
      }
      if (inStockOnly && p.stock <= 0) {
        continue;
      }
      if (loweredSearch) {
        const nameMatch = p.name.toLowerCase().includes(loweredSearch);
        const descriptionMatch = p.description && p.description.toLowerCase().includes(loweredSearch);
        const categoryMatch = p.category.toLowerCase().includes(loweredSearch)
          || (p.categoryLabel && p.categoryLabel.toLowerCase().includes(loweredSearch));
        if (!nameMatch && !descriptionMatch && !categoryMatch) {
          continue;
        }
      }
      result.push(p);
    }
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'stock') {
      result.sort((a, b) => b.stock - a.stock);
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [products, categoryFilter, priceRange, inStockOnly, searchTerm, sortBy]);

  const categories = useMemo(() => {
    const labelsByCategory = new Map<string, string>();
    for (let i = 0; i < products.length; i += 1) {
      const product = products[i];
      if (!product?.category) {
        continue;
      }
      if (!labelsByCategory.has(product.category)) {
        labelsByCategory.set(product.category, product.categoryLabel || product.category);
      }
    }

    const entries = Array.from(labelsByCategory.entries()).map(([value, label]) => ({ value, label }));
    entries.sort((a, b) => a.label.localeCompare(b.label));
    return entries;
  }, [products]);

  const compareItemsFallback = useMemo(() => {
    return products.filter(p => compareIds.includes(p.id));
  }, [products, compareIds]);

  const resolvedCompareItems = useMemo(() => {
    if (compareItems.length > 0) {
      return compareItems;
    }
    return compareItemsFallback;
  }, [compareItems, compareItemsFallback]);

  return (
    <div className="view category-view">
            {pageLoading && products.length === 0 ? (
              <LoadingSpinner fullScreen={true} />
            ) : (
              <>
      <div className="category-header">
        <button className="back-btn" onClick={() => navigate('/shop')}>{t('common.backToShop')}</button>
        <h1>{searchQuery ? t('products.searchResults', { query: searchQuery }) : t('products.allProducts')}</h1>
        <p className="category-count">{filteredProducts.length} {t('products.items')}</p>
      </div>

      <div className="category-content">
        <aside className="category-filters">
          <div className="filter-header">
            <h2>{t('products.filters')}</h2>
            <span className="filter-count">{filteredProducts.length} {t('products.items')}</span>
          </div>

          <div className="filter-section">
            <h3>{t('products.search')}</h3>
            <input
              type="text"
              placeholder={t('products.searchInCategory')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-search"
            />
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              {t('products.inStockOnly')}
            </label>
          </div>

          <div className="filter-section">
            <h3>{t('products.category')}</h3>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="sort-select">
              <option value="all">{t('products.allCategories')}</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h3>{t('products.priceRange')}</h3>
            <div className="price-inputs">
              <input
                type="number"
                placeholder={t('products.min')}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                placeholder={t('products.max')}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                max={maxPrice}
              />
            </div>
            <input
              type="range"
              min="0"
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="price-slider"
            />
            <div className="price-display">
              ${priceRange[0].toFixed(2)} - ${priceRange[1].toFixed(2)}
            </div>
          </div>

          <div className="filter-section">
            <h3>{t('products.sortBy')}</h3>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="name">{t('products.name')}</option>
              <option value="price-low">{t('products.priceLow')}</option>
              <option value="price-high">{t('products.priceHigh')}</option>
              <option value="stock">{t('products.stock')}</option>
            </select>
          </div>
        </aside>

        <main className="category-products">
          {error && <div className="error">{error}</div>}
          {pageLoading ? (
            <div className="grid-products">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid-products">
              {filteredProducts.map((p: any) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  showWishlist={true}
                  isWishlisted={wishlistIds.includes(p.id)}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlistPending={isWishlistPending(p.id)}
                  showCompare={true}
                  isCompared={compareIds.includes(p.id)}
                  onToggleCompare={toggleCompare}
                  isComparePending={isComparePending(p.id)}
                  showStockBadge={true}
                />
              ))}
              {filteredProducts.length === 0 && <p>{searchQuery ? t('products.noProductsFound') : t('products.noProducts')}</p>}
            </div>
          )}
        </main>
      </div>

      <CompareDrawer items={resolvedCompareItems} onRemove={(productId) => {
        const found = products.find((product) => product.id === productId);
        toggleCompare(found || { id: productId });
      }} onClear={clearCompare} />
            </>
          )}
    </div>
  );
}
