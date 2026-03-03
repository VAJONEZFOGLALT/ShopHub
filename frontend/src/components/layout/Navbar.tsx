import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { api } from '../../services/api';
import { getThumbnailUrl } from '../../utils/imageOptimization';

export default function Navbar({ onAuth, onCart }: { onAuth?: () => void; onCart?: () => void }) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => localStorage.getItem('theme') === 'light' ? 'light' : 'dark');
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    api.getProducts().then(p => {
      setProducts(p);
      const cats: Record<string, boolean> = {};
      const list: string[] = [];
      p.forEach(prod => {
        if (prod.category && !cats[prod.category]) {
          cats[prod.category] = true;
          list.push(prod.category);
        }
      });
      setCategories(list.sort());
    });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUser(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
        (p.description && p.description.toLowerCase().includes(q))
      ).slice(0, 6));
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
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
                    <div className="muted">{p.category} • ${p.price.toFixed(2)}</div>
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
          <Link to="/shop/all" style={{ fontWeight: 600 }}>{t('common.all')}</Link>
          {categories.map(cat => <Link key={cat} to={`/shop/category/${cat}`}>{cat}</Link>)}
        </div>
      </div>
    </nav>
  );
}
