import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTranslateDynamic } from '../hooks/useTranslateDynamic';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import CompareDrawer from '../components/CompareDrawer';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../hooks/useWishlist';
import { useToast } from '../contexts/ToastContext';

export default function CategoryPage() {
  const { t, i18n } = useTranslation();
  const { translateBatch } = useTranslateDynamic();
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [translatedProducts, setTranslatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { wishlistIds, handleToggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [compareItems, setCompareItems] = useState<any[]>([]);

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

  // Translate product names when language changes or products load
  useEffect(() => {
    const translateProducts = async () => {
      if (products.length === 0 || i18n.language === 'en') {
        setTranslatedProducts(products);
        return;
      }

      try {
        const names = products.map(p => p.name);
        const translated = await translateBatch(names, i18n.language);
        
        const updated = products.map((p, idx) => ({
          ...p,
          name: translated[idx] || p.name,
        }));
        setTranslatedProducts(updated);
      } catch (err) {
        console.error('Failed to translate products:', err);
        setTranslatedProducts(products);
      }
    };

    translateProducts();
  }, [products, i18n.language, translateBatch]);

  useEffect(() => {
    const loadLists = async () => {
      if (!user) {
        setCompareIds([]);
        return;
      }
      const compare = await api.getCompare(user.id);
      setCompareIds(compare.map((item: any) => item.productId));
      setCompareItems(compare.map((item: any) => item.product));
    };
    loadLists();
  }, [user]);

  const filtered = useMemo(() => {
    // Use translated products if available, otherwise original
    const displayProducts = translatedProducts.length > 0 ? translatedProducts : products;
    
    const byCategory: any[] = [];
    for (let i = 0; i < displayProducts.length; i += 1) {
      const p = displayProducts[i];
      if (p.category === name) {
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
  }, [translatedProducts, products, name, priceRange, sortBy, inStockOnly, searchTerm]);

  const compareItemsFallback = useMemo(() => {
    return products.filter(p => compareIds.includes(p.id));
  }, [products, compareIds]);

  const resolvedCompareItems = useMemo(() => {
    if (user && compareItems.length > 0) {
      return compareItems;
    }
    return compareItemsFallback;
  }, [user, compareItems, compareItemsFallback]);

  const handleToggleCompare = async (productId: number) => {
    if (!isAuthenticated) {
      showToast(t('products.logInToCompare'), 'warning');
      return;
    }

    if (compareIds.includes(productId)) {
      await api.removeCompare(user!.id, productId);
    } else {
      try {
        await api.addCompare({ userId: user!.id, productId });
      } catch (err: any) {
        showToast(err.message || 'Failed to add to compare', 'error');
      }
    }
    const updated = await api.getCompare(user!.id);
    setCompareIds(updated.map((item: any) => item.productId));
    setCompareItems(updated.map((item: any) => item.product));
  };

  const handleClearCompare = async () => {
    if (!isAuthenticated) {
      showToast(t('products.logInToCompare'), 'warning');
      return;
    }
    await api.clearCompare(user!.id);
    setCompareIds([]);
    setCompareItems([]);
  };

  const maxPrice = useMemo(() => {
    let max = 1000;
    const matched: number[] = [];
    for (let i = 0; i < products.length; i += 1) {
      const p = products[i];
      if (p.category === name) {
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
  }, [products, name]);

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
      <div className="category-header">
        <button className="back-btn" onClick={() => navigate('/shop')}>{t('common.backToShop')}</button>
        <h1>{name}</h1>
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
                  showCompare={true}
                  isCompared={compareIds.includes(p.id)}
                  onToggleCompare={handleToggleCompare}
                  showStockBadge={true}
                />
              ))}
            </div>
          )}
        </main>
      </div>
      <CompareDrawer items={resolvedCompareItems} onRemove={handleToggleCompare} onClear={handleClearCompare} />
    </div>
  );
}
