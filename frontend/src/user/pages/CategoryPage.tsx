import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('name');

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

  const filtered = useMemo(() => {
    const byCategory: any[] = [];
    for (let i = 0; i < products.length; i += 1) {
      const p = products[i];
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

    if (sortBy === 'price-low') {
      ranged.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      ranged.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'stock') {
      ranged.sort((a, b) => b.stock - a.stock);
    } else {
      ranged.sort((a, b) => a.name.localeCompare(b.name));
    }

    return ranged;
  }, [products, name, priceRange, sortBy]);

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
  };

  return (
    <div className="category-view">
      <div className="category-header">
        <button className="back-btn" onClick={() => navigate('/shop')}>← Back to Shop</button>
        <h1>{name}</h1>
        <p className="category-count">{filtered.length} products</p>
      </div>

      <div className="category-content">
        {/* Left Sidebar - Filters */}
        <aside className="category-filters">
          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <input 
                type="number" 
                placeholder="Min" 
                value={priceRange[0]} 
                onChange={(e) => handleMinPriceChange(e.target.value)}
                min="0"
              />
              <span>-</span>
              <input 
                type="number" 
                placeholder="Max" 
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
            <h3>Sort By</h3>
            <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className="sort-select">
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock">Stock</option>
            </select>
          </div>

          <button 
            className="filter-reset"
            onClick={handleResetFilters}
          >
            Reset Filters
          </button>
        </aside>

        {/* Right Content - Products */}
        <main className="category-products">
          {error && <div className="error">{error}</div>}
          {loading ? (
            <p>Loading…</p>
          ) : filtered.length === 0 ? (
            <div className="no-products">
              <p>No products found in this category.</p>
              <p className="no-products-hint">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid-products">
              {filtered.map((p: any) => (
                <div key={p.id} onClick={() => navigate(`/shop/product/${p.id}`)} style={{ cursor: 'pointer' }}>
                  <ProductCard product={p} disableNav={true} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
