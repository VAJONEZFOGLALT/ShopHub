import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useCart } from '../CartContext';
import { api } from '../../api';

type AuthModal = 'none' | 'login' | 'register'

export default function Navbar({ onOpenAuth, onOpenCart }: { onOpenAuth?: (modal: AuthModal) => void; onOpenCart?: () => void }) {
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartHoverOpen, setIsCartHoverOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    return saved || 'dark';
  });
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const products = await api.getProducts();
        const unique: Record<string, boolean> = {};
        const list: string[] = [];
        for (let i = 0; i < products.length; i += 1) {
          const cat = products[i]?.category;
          if (cat && !unique[cat]) {
            unique[cat] = true;
            list.push(cat);
          }
        }
        list.sort();
        setCategories(list);
        setAllProducts(products);
      } catch (e) {
        console.error('Failed to load categories');
      }
    };
    loadCategories();
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setIsCartHoverOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed.length > 0) {
      navigate(`/shop/all?search=${encodeURIComponent(trimmed)}`);
      setSearchQuery('');
      setShowSearchDropdown(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    const trimmed = value.trim();
    if (trimmed.length > 0) {
      const lowered = trimmed.toLowerCase();
      const filtered: any[] = [];
      for (let i = 0; i < allProducts.length; i += 1) {
        const p = allProducts[i];
        const nameMatch = p.name.toLowerCase().includes(lowered);
        const descriptionMatch = p.description && p.description.toLowerCase().includes(lowered);
        const categoryMatch = p.category.toLowerCase().includes(lowered);
        if (nameMatch || descriptionMatch || categoryMatch) {
          filtered.push(p);
          if (filtered.length >= 6) {
            break;
          }
        }
      }
      setSearchResults(filtered);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const handleSelectProduct = (productId: number) => {
    navigate(`/shop/product/${productId}`);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/shop');
  };

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'dark') {
        return 'light';
      }
      return 'dark';
    });
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(prev => !prev);
  };

  const handleOpenCart = () => {
    if (onOpenCart) {
      onOpenCart();
    }
  };

  const handleViewAllResults = () => {
    navigate(`/shop/all?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  const totalMatchCount = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      return 0;
    }
    const lowered = trimmed.toLowerCase();
    let count = 0;
    for (let i = 0; i < allProducts.length; i += 1) {
      const p = allProducts[i];
      const nameMatch = p.name.toLowerCase().includes(lowered);
      const descriptionMatch = p.description && p.description.toLowerCase().includes(lowered);
      const categoryMatch = p.category.toLowerCase().includes(lowered);
      if (nameMatch || descriptionMatch || categoryMatch) {
        count += 1;
      }
    }
    return count;
  }, [allProducts, searchQuery]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/shop" className="navbar-brand">
          ShopHub
        </Link>

        {/* Search Bar */}
        <div className="navbar-search-wrapper" ref={searchRef}>
          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              🔍
            </button>
          </form>
          
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map((product: any) => (
                <div key={product.id} className="search-result-item" onClick={() => handleSelectProduct(product.id)}>
                  {product.image && <img src={product.image} alt={product.name} className="search-result-image" />}
                  <div className="search-result-content">
                    <div className="search-result-name">{product.name}</div>
                    <div className="search-result-meta">
                      <span className="search-result-category">{product.category}</span>
                      <span className="search-result-price">${Number(product.price).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {searchResults.length < totalMatchCount && (
                <div className="search-result-more" onClick={handleViewAllResults}>
                  View all results
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Theme Toggle + Cart + User Menu */}
        <div className="navbar-right">
          {/* Theme Toggle */}
          <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Cart Icon */}
          <div 
            className="navbar-cart-wrapper" 
            ref={cartRef}
            onMouseEnter={() => items.length > 0 && setIsCartHoverOpen(true)}
            onMouseLeave={() => setIsCartHoverOpen(false)}
          >
            <button className="navbar-cart" onClick={handleOpenCart}>
              🛒 Cart
              {items.length > 0 && <span className="cart-badge">{items.length}</span>}
            </button>
            
            {isCartHoverOpen && items.length > 0 && (
              <div className="cart-hover-preview">
                <div className="cart-hover-header">
                  <span>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                </div>
                <div className="cart-hover-items">
                  {items.slice(0, 5).map(item => (
                    <div key={item.productId} className="cart-hover-item">
                      <span className="cart-hover-item-name">{item.name}</span>
                      <span className="cart-hover-item-qty">×{item.quantity}</span>
                      <span className="cart-hover-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {items.length > 5 && (
                    <div className="cart-hover-more">+{items.length - 5} more items</div>
                  )}
                </div>
                <div className="cart-hover-footer">
                  <span>Total:</span>
                  <span className="cart-hover-total">${items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="navbar-user" ref={userMenuRef}>
            <button
              className="navbar-user-btn"
              onClick={handleUserMenuToggle}
            >
              {user ? (
                <>
                  👤 {user.username}
                  <span className="dropdown-arrow">▼</span>
                </>
              ) : (
                <>
                  👤 Account
                  <span className="dropdown-arrow">▼</span>
                </>
              )}
            </button>

            {isUserMenuOpen && (
              <div className="dropdown-menu user-menu">
                {user ? (
                  <>
                    <div className="dropdown-user-info">
                      <strong>{user.username}</strong>
                      <small>{user.email}</small>
                      {user.role === 'ADMIN' && <small style={{ color: 'var(--warning)', fontWeight: 600 }}>Admin</small>}
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/shop/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                      My Profile
                    </Link>
                    <Link to="/shop/orders" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                      My Orders
                    </Link>
                    {user.role === 'ADMIN' && (
                      <>
                        <div className="dropdown-divider"></div>
                        <Link to="/admin" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)} style={{ color: 'var(--warning)' }}>
                          ⚡ Admin Dashboard
                        </Link>
                      </>
                    )}
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="dropdown-item" onClick={() => { setIsUserMenuOpen(false); onOpenAuth?.('login'); }}>
                      Login
                    </button>
                    <button type="button" className="dropdown-item" onClick={() => { setIsUserMenuOpen(false); onOpenAuth?.('register'); }}>
                      Register
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories Bar - Always visible */}
      {!location.pathname.startsWith('/shop/category') && (
        <div className="categories-bar">
          <div className="categories-bar-container">
            <Link to="/shop/all" className="categories-item" style={{ fontWeight: 600 }}>
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/shop/category/${encodeURIComponent(cat)}`}
                className="categories-item"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
