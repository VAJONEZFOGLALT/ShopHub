import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import CompareDrawer from '../components/CompareDrawer';
import { useWishlist } from '../hooks/useWishlist';
import { useCompare } from '../hooks/useCompare';
import { LoadingSpinner } from '../components/LoadingSpinner';

const getProductCategory = (product: any) => {
  const rawCategory = product?.category ?? product?.categoryName ?? product?.category?.name;
  if (typeof rawCategory !== 'string') {
    return '';
  }
  return rawCategory.trim();
};

const normalizeCategory = (value: string) => value.trim().toLowerCase();

export default function CategoryPage() {
  const { t, i18n } = useTranslation();
  const { name } = useParams<{ name: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const decodedCategoryName = decodeURIComponent(name || '');
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('min') || '0'),
    Number(searchParams.get('max') || '1000'),
  ]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('stock') === '1');
  const { wishlistIds, handleToggleWishlist, isWishlistPending } = useWishlist();
  const { compareIds, compareItems, toggleCompare, clearCompare, isComparePending } = useCompare();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProducts(i18n.language);
      setProducts(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, [i18n.language]);

  const filtered = useMemo(() => {
    const displayProducts = products;
    
    const byCategory: any[] = [];
    for (let i = 0; i < displayProducts.length; i += 1) {
      const p = displayProducts[i];
      if (normalizeCategory(getProductCategory(p)) === normalizeCategory(decodedCategoryName)) {
        byCategory.push(p);
      }
    }

    const ranged: any[] = [];
    for (let i = 0; i < byCategory.length; i += 1) {
      const p = byCategory[i];
      if (p.price >= priceRange[0] && p.price <= priceRange[1]) {
        ranged.push(p);
      }
    }

    const filteredByStock: any[] = [];
    for (let i = 0; i < ranged.length; i += 1) {
      const p = ranged[i];
      if (!inStockOnly || p.stock > 0) {
        filteredByStock.push(p);
      }
    }

    const filteredBySearch: any[] = [];
    const loweredSearch = searchTerm.trim().toLowerCase();
    if (loweredSearch.length === 0) {
      for (let i = 0; i < filteredByStock.length; i += 1) {
        filteredBySearch.push(filteredByStock[i]);
      }
    } else {
      for (let i = 0; i < filteredByStock.length; i += 1) {
        const p = filteredByStock[i];
        const nameMatch = p.name?.toLowerCase().includes(loweredSearch);
        const descriptionMatch = p.description?.toLowerCase().includes(loweredSearch);
        if (nameMatch || descriptionMatch) {
          filteredBySearch.push(p);
        }
      }
    }

    if (sortBy === 'price-low') {
      filteredBySearch.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filteredBySearch.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'stock') {
      filteredBySearch.sort((a, b) => b.stock - a.stock);
    } else {
      filteredBySearch.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filteredBySearch;
  }, [products, decodedCategoryName, priceRange, sortBy, inStockOnly, searchTerm]);

  const categoryDisplayName = useMemo(() => {
    const normalizedTarget = normalizeCategory(decodedCategoryName);
    const matched = products.find((product) => normalizeCategory(getProductCategory(product)) === normalizedTarget);
    return matched?.categoryLabel || decodedCategoryName;
  }, [products, decodedCategoryName]);

  const compareItemsFallback = useMemo(() => {
    return products.filter(p => compareIds.includes(p.id));
  }, [products, compareIds]);

  const resolvedCompareItems = useMemo(() => {
    if (compareItems.length > 0) {
      return compareItems;
    }
    return compareItemsFallback;
  }, [compareItems, compareItemsFallback]);

  const maxPrice = useMemo(() => {
    let max = 1000;
    const matched: number[] = [];
    for (let i = 0; i < products.length; i += 1) {
      const p = products[i];
      if (normalizeCategory(getProductCategory(p)) === normalizeCategory(decodedCategoryName)) {
        matched.push(p.price);
      }
    }
    if (matched.length > 0) {
      let localMax = matched[0];
      for (let i = 1; i < matched.length; i += 1) {
        if (matched[i] > localMax) {
          localMax = matched[i];
        }
      }
      max = localMax;
    }
    return max;
  }, [products, decodedCategoryName]);

  useEffect(() => {
    const nextMin = Number(searchParams.get('min') || '0');
    const nextMax = Number(searchParams.get('max') || String(maxPrice));
    const safeMax = Number.isFinite(nextMax) ? Math.max(nextMin, nextMax) : maxPrice;
    setPriceRange([Math.max(0, nextMin), Math.min(maxPrice, safeMax)]);
    setSortBy(searchParams.get('sort') || 'name');
    setSearchTerm(searchParams.get('q') || '');
    setInStockOnly(searchParams.get('stock') === '1');
  }, [decodedCategoryName]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
    } else {
      params.delete('q');
    }

    if (priceRange[0] > 0) {
      params.set('min', String(priceRange[0]));
    } else {
      params.delete('min');
    }

    if (priceRange[1] < maxPrice) {
      params.set('max', String(priceRange[1]));
    } else {
      params.delete('max');
    }

    if (sortBy !== 'name') {
      params.set('sort', sortBy);
    } else {
      params.delete('sort');
    }

    if (inStockOnly) {
      params.set('stock', '1');
    } else {
      params.delete('stock');
    }

    const current = searchParams.toString();
    const next = params.toString();
    if (next !== current) {
      setSearchParams(params, { replace: true });
    }
  }, [inStockOnly, maxPrice, priceRange, searchParams, searchTerm, setSearchParams, sortBy]);

  useEffect(() => {
    if (priceRange[1] > maxPrice) {
      setPriceRange(([min]) => [min, maxPrice]);
    }
  }, [maxPrice, priceRange]);

  const handleMinPriceChange = (value: string) => {
    const min = Number(value);
    setPriceRange([min, priceRange[1]]);
  };

  const handleMaxPriceChange = (value: string) => {
    const max = Number(value);
    setPriceRange([priceRange[0], max]);
  };

  const handleSliderChange = (value: string) => {
    const max = Number(value);
    setPriceRange([priceRange[0], max]);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleResetFilters = () => {
    setPriceRange([0, maxPrice]);
    setSortBy('name');
    setSearchTerm('');
    setInStockOnly(false);
  };

  return (
    <div className="category-view">
            {loading && products.length === 0 ? (
              <LoadingSpinner fullScreen={true} />
            ) : (
              <>
      <div className="category-header">
        <button className="back-btn" onClick={() => navigate('/shop')}>{t('common.backToShop')}</button>
        <h1>{categoryDisplayName}</h1>
        <p className="category-count">{filtered.length} {t('products.items')}</p>
      </div>

      <div className="category-content">
        {/* Left Sidebar - Filters */}
        <aside className="category-filters">
          <div className="filter-header">
            <h2>{t('products.filters')}</h2>
            <span className="filter-count">{filtered.length} {t('products.items')}</span>
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
            <h3>{t('products.priceRange')}</h3>
            <div className="price-inputs">
              <input 
                type="number" 
                placeholder={t('products.min')} 
                value={priceRange[0]} 
                onChange={(e) => handleMinPriceChange(e.target.value)}
                min="0"
              />
              <span>-</span>
              <input 
                type="number" 
                placeholder={t('products.max')} 
                value={priceRange[1]} 
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                max={maxPrice}
              />
            </div>
            <input 
              type="range" 
              min="0" 
              max={maxPrice} 
              value={priceRange[1]} 
              onChange={(e) => handleSliderChange(e.target.value)}
              className="price-slider"
            />
            <div className="price-display">
              ${priceRange[0].toFixed(2)} - ${priceRange[1].toFixed(2)}
            </div>
          </div>

          <div className="filter-section">
            <h3>{t('products.sortBy')}</h3>
            <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className="sort-select">
              <option value="name">{t('products.name')}</option>
              <option value="price-low">{t('products.priceLow')}</option>
              <option value="price-high">{t('products.priceHigh')}</option>
              <option value="stock">{t('products.stock')}</option>
            </select>
          </div>

          <button 
            className="filter-reset"
            onClick={handleResetFilters}
          >
            {t('products.resetFilters')}
          </button>
        </aside>

        {/* Right Content - Products */}
        <main className="category-products">
          {error && <div className="error">{error}</div>}
          {loading ? (
            <div className="grid-products">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="no-products">
              <p>{t('products.noProductsInCategory')}</p>
              <p className="no-products-hint">{t('products.adjustFilters')}</p>
            </div>
          ) : (
            <div className="grid-products">
              {filtered.map((p: any) => (
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
