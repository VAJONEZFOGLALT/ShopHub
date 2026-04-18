import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { api } from '../../services/api';
import { getThumbnailUrl } from '../../utils/imageOptimization';
import { InlineLanguageSwitcher } from '../LanguageSwitcher';

const readCompareCount = (userId?: number): number => {
  if (!userId) {
    return 0;
  }

  try {
    const raw = localStorage.getItem(`shophub_compare_user_${userId}`);
    if (!raw) {
      return 0;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
};

export default function Navbar({ onAuth, onCart }: { onAuth?: () => void; onCart?: () => void }) {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [compareCount, setCompareCount] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => localStorage.getItem('theme') === 'light' ? 'light' : 'dark');
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    api.getProducts(i18n.language).then(p => {
      setProducts(p);
    }).catch(() => {
      // Silent fail for navbar categories
    });
  }, [i18n.language]);

  const categoryStats = useMemo(() => {
    const stats = new Map<string, { key: string; label: string; totalCount: number }>();
    for (let i = 0; i < products.length; i += 1) {
      const product = products[i];
      const categoryKey = typeof product?.category === 'string' ? product.category.trim() : '';
      if (!categoryKey) {
        continue;
      }

      const existing = stats.get(categoryKey);
      if (existing) {
        existing.totalCount += 1;
        continue;
      }

      stats.set(categoryKey, {
        key: categoryKey,
        label: product?.categoryLabel || categoryKey,
        totalCount: 1,
      });
    }

    return Array.from(stats.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [products]);

  const normalizedActiveCategory = useMemo(() => {
    const match = location.pathname.match(/^\/shop\/category\/(.+)$/);
    if (!match) {
      return '';
    }
    return decodeURIComponent(match[1]).trim().toLowerCase();
  }, [location.pathname]);

  const activeCategoryFilteredCount = useMemo(() => {
    if (!normalizedActiveCategory) {
      return 0;
    }

    const params = new URLSearchParams(location.search);
    const query = (params.get('q') || '').trim().toLowerCase();
    const minPrice = Number(params.get('min') || '0');
    const maxPrice = Number(params.get('max') || String(Number.MAX_SAFE_INTEGER));
    const inStockOnly = params.get('stock') === '1';

    let count = 0;
    for (let i = 0; i < products.length; i += 1) {
      const product = products[i];
      const categoryKey = typeof product?.category === 'string' ? product.category.trim().toLowerCase() : '';
      if (categoryKey !== normalizedActiveCategory) {
        continue;
      }

      const price = Number(product?.price || 0);
      if (price < minPrice || price > maxPrice) {
        continue;
      }

      if (inStockOnly && Number(product?.stock || 0) <= 0) {
        continue;
      }

      if (query) {
        const name = String(product?.name || '').toLowerCase();
        const description = String(product?.description || '').toLowerCase();
        const categoryLabel = String(product?.categoryLabel || product?.category || '').toLowerCase();
        if (!name.includes(query) && !description.includes(query) && !categoryLabel.includes(query)) {
          continue;
        }
      }

      count += 1;
    }

    return count;
  }, [location.search, normalizedActiveCategory, products]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUser(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setCompareCount(readCompareCount(user?.id));

    const onCompareUpdated = (event: Event) => {
      const custom = event as CustomEvent<{ count?: number }>;
      if (typeof custom.detail?.count === 'number') {
        setCompareCount(custom.detail.count);
        return;
      }
      setCompareCount(readCompareCount(user?.id));
    };

    const onStorage = () => {
      setCompareCount(readCompareCount(user?.id));
    };

    window.addEventListener('compare-updated', onCompareUpdated as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('compare-updated', onCompareUpdated as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, [user?.id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop/all?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      const q = val.toLowerCase();
      setSearchResults(products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      ).slice(0, 6));
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  const handleOpenCompare = () => {
    if (compareCount === 0) {
      return;
    }
    window.dispatchEvent(new Event('open-compare-drawer'));
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/shop" className="navbar-brand">ShopHub</Link>

        <div className="navbar-search-wrapper" ref={searchRef}>
          <form className="navbar-search" onSubmit={handleSearch}>
            <input type="text" placeholder={`${t('common.search')}...`} value={searchQuery} onChange={e => handleSearchInput(e.target.value)} className="search-input" />
            <button type="submit" className="search-btn">🔍</button>
          </form>
          {showSearch && searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map(p => (
                <div key={p.id} onClick={() => { navigate(`/shop/product/${p.id}`); setSearchQuery(''); setShowSearch(false); }} className="search-result-item">
                  {p.image && <img src={getThumbnailUrl(p.image)} alt={p.name} loading="lazy" />}
                  <div className="search-result-content">
                    <div>{p.name}</div>
                    <div className="muted">{p.categoryLabel || p.category} • ${p.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="navbar-right">
          <button className="theme-toggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button className="navbar-cart" onClick={onCart}>
            🛒 {items.length > 0 && <span className="cart-badge">{items.length}</span>}
          </button>

          <div className="navbar-user" ref={userRef}>
            <button className="navbar-user-btn" onClick={() => setShowUser(!showUser)}>
              👤 {user?.username || t('common.account')} ▼
            </button>
            {showUser && (
              <div className="dropdown-menu user-menu">
                {user ? (
                  <>
                    <div className="dropdown-user-info">
                      <strong>{user.username}</strong>
                      <small>{user.email}</small>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/shop/profile" className="dropdown-item" onClick={() => setShowUser(false)}>{t('common.myProfile')}</Link>
                    <Link to="/shop/orders" className="dropdown-item" onClick={() => setShowUser(false)}>{t('common.myOrders')}</Link>
                    {user.role === 'ADMIN' && <Link to="/admin" className="dropdown-item" onClick={() => setShowUser(false)}>⚡ {t('common.admin')}</Link>}
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-btn" onClick={() => { logout(); setShowUser(false); navigate('/shop'); }}>{t('common.logout')}</button>
                  </>
                ) : (
                  <>
                    <button className="dropdown-item" onClick={() => { onAuth?.(); setShowUser(false); }}>{t('common.login')}</button>
                    <button className="dropdown-item" onClick={() => { onAuth?.(); setShowUser(false); }}>{t('common.register')}</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="categories-bar">
        <div className="categories-bar-container">
          <div className="categories-bar-left">
            <InlineLanguageSwitcher />
          </div>

          <div className="categories-bar-links">
            <Link to="/shop/all" className="categories-item" style={{ fontWeight: 600 }}>{t('common.all')}</Link>
            {categoryStats.map((cat) => {
              const normalized = cat.key.trim().toLowerCase();
              const isActive = normalizedActiveCategory === normalized;
              const count = isActive ? activeCategoryFilteredCount : cat.totalCount;
              return (
                <Link
                  key={cat.key}
                  className={`categories-item ${isActive ? 'categories-item-active' : ''}`.trim()}
                  to={`/shop/category/${encodeURIComponent(cat.key)}`}
                >
                  {cat.label} ({count})
                </Link>
              );
            })}
          </div>

          <div className="categories-bar-right">
            <button
              type="button"
              className={`compare-nav-btn ${compareCount > 0 ? 'has-items' : ''}`.trim()}
              onClick={handleOpenCompare}
              disabled={compareCount === 0}
            >
              Compare {compareCount > 0 ? `(${compareCount})` : ''}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
