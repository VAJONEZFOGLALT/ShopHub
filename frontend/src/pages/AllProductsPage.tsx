import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import CompareDrawer from '../components/CompareDrawer';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../hooks/useWishlist';
import { useToast } from '../contexts/ToastContext';

export default function AllProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { wishlistIds, handleToggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [compareItems, setCompareItems] = useState<any[]>([]);

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
      setProducts(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  useEffect(() => {
    const loadLists = async () => {
      if (!user) {
        setCompareIds([]);
        return;
      }
      const compare = await api.getCompare(user.id);
      if (Array.isArray(compare)) {
        setCompareIds(compare.map((item: any) => item.productId));
        setCompareItems(compare.map((item: any) => item.product));
      }
    };
    loadLists();
  }, [user]);

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
    for (let i = 0; i < products.length; i += 1) {
      const p = products[i];
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
        const categoryMatch = p.category.toLowerCase().includes(loweredSearch);
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
    const list = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    list.sort();
    return list;
  }, [products]);

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
      showToast('Please log in to compare products', 'warning');
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
    if (!user) {
      setCompareIds([]);
      return;
    }
    await api.clearCompare(user.id);
    setCompareIds([]);
    setCompareItems([]);
  };

  return (
    <div className="view category-view">
      <div className="category-header">
        <button className="back-btn" onClick={() => navigate('/shop')}>← Back to Shop</button>
        <h1>{searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}</h1>
        <p className="category-count">{filteredProducts.length} products</p>
      </div>

      <div className="category-content">
        <aside className="category-filters">
          <div className="filter-header">
            <h2>Filters</h2>
            <span className="filter-count">{filteredProducts.length} items</span>
          </div>

          <div className="filter-section">
            <h3>Search</h3>
            <input
              type="text"
              placeholder="Name, description, category"
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
              In stock only
            </label>
          </div>

          <div className="filter-section">
            <h3>Category</h3>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="sort-select">
              <option value="all">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
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
            <h3>Sort By</h3>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock">Stock</option>
            </select>
          </div>
        </aside>

        <main className="category-products">
          {error && <div className="error">{error}</div>}
          {loading ? (
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
                  showCompare={true}
                  isCompared={compareIds.includes(p.id)}
                  onToggleCompare={handleToggleCompare}
                  showStockBadge={true}
                />
              ))}
              {filteredProducts.length === 0 && <p>{searchQuery ? 'No products found matching your search.' : 'No products found.'}</p>}
            </div>
          )}
        </main>
      </div>

      <CompareDrawer items={resolvedCompareItems} onRemove={handleToggleCompare} onClear={handleClearCompare} />
    </div>
  );
}
