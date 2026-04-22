import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import './styles/App.css'

import UsersView from './adminpages/UsersView'
import ProductsView from './adminpages/ProductsView'
import OrdersView from './adminpages/OrdersView'
import AdminInfoView from './adminpages/AdminInfoView'
import CartProvider from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { ProtectedAdminRoute } from './components/auth/ProtectedAdminRoute'
import { LoginModal } from './components/auth/LoginModal'
import { RegisterModal } from './components/auth/RegisterModal'
import { CartModal } from './components/cart/CartModal'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import AllProductsPage from './pages/AllProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CategoryPage from './pages/CategoryPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import NotFoundPage from './pages/NotFoundPage'
import ProfilePage from './pages/ProfilePage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import { Toast } from './components/Toast'
import { ScrollToTop } from './components/ScrollToTop'
import { useTranslation } from 'react-i18next';

type Modals = 'none' | 'login' | 'register'
type AdminTab = 'overview' | 'users' | 'products' | 'orders'

const SUPPORTED_LANGUAGES = ['hu', 'en'];
const normalizeLanguage = (value: string) => value.toLowerCase().split('-')[0];

function LanguageUrlSync() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith('/admin');
    if (isAdminRoute) {
      return;
    }

    const params = new URLSearchParams(location.search);
    const rawUrlLang = params.get('lang');
    const urlLang = rawUrlLang ? normalizeLanguage(rawUrlLang) : null;
    const currentI18nLanguage = normalizeLanguage(i18n.language || 'hu');
    const isUrlLangSupported = !!urlLang && SUPPORTED_LANGUAGES.includes(urlLang);
    const storedLangRaw = localStorage.getItem('language') || '';
    const storedLang = storedLangRaw ? normalizeLanguage(storedLangRaw) : null;
    const isStoredLangSupported = !!storedLang && SUPPORTED_LANGUAGES.includes(storedLang);
    const fallbackLang = 'hu';
    const targetLang = isUrlLangSupported
      ? urlLang
      : isStoredLangSupported
        ? storedLang
        : fallbackLang;

    if (targetLang !== currentI18nLanguage) {
      void i18n.changeLanguage(targetLang);
      localStorage.setItem('language', targetLang);
      return;
    }

    if (!isUrlLangSupported || urlLang !== targetLang) {
      params.set('lang', targetLang);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [i18n, i18n.language, location.pathname, location.search, navigate]);

  return null;
}

function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>('overview')
  const navigate = useNavigate()
  
  const views: Record<AdminTab, React.JSX.Element> = {
    overview: <AdminInfoView onNavigateToTab={setTab} />,
    users: <UsersView />,
    products: <ProductsView />,
    orders: <OrdersView />
  }

  const labels: Record<AdminTab, string> = {
    overview: 'Overview',
    users: 'Users',
    products: 'Products',
    orders: 'Orders',
  }

  return (
    <div className="app">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1>Admin Dashboard</h1>
          <button onClick={() => navigate('/shop')} style={{ padding: '8px 14px', cursor: 'pointer' }}>
            ← Back to Shop
          </button>
        </div>
        <nav className="nav">
          {(Object.keys(views) as AdminTab[]).map(key => (
            <button 
              key={key}
              className={tab === key ? 'active' : ''}
              onClick={() => setTab(key)}
            >
              {labels[key] || key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </nav>
      </header>
      <main className="main">{views[tab]}</main>
    </div>
  )
}

function App() {
  const [modal, setModal] = useState<Modals>('none')
  const [cartOpen, setCartOpen] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState<number | undefined>(undefined)

  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <LanguageUrlSync />
          <ScrollToTop />
          <CartProvider>
            <Routes>
              <Route path="/admin/*" element={<ProtectedAdminRoute onAuthNeeded={() => setModal('login')}><AdminPanel /></ProtectedAdminRoute>} />
              <Route 
                path="/shop/*" 
                element={
                  <Layout onAuth={() => setModal('login')} onCart={() => setCartOpen(true)}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="all" element={<AllProductsPage />} />
                      <Route path="product/:id" element={<ProductDetailPage />} />
                      <Route path="category/:name" element={<CategoryPage />} />
                      <Route path="checkout" element={<ProtectedRoute onAuthNeeded={() => setModal('login')}><CheckoutPage onSuccess={setOrderConfirmed} /></ProtectedRoute>} />
                      <Route path="confirmation" element={<OrderConfirmationPage orderId={orderConfirmed} />} />
                      <Route path="profile" element={<ProtectedRoute onAuthNeeded={() => setModal('login')}><ProfilePage /></ProtectedRoute>} />
                      <Route path="orders" element={<ProtectedRoute onAuthNeeded={() => setModal('login')}><OrdersPage /></ProtectedRoute>} />
                      <Route path="orders/:orderId" element={<ProtectedRoute onAuthNeeded={() => setModal('login')}><OrderDetailPage /></ProtectedRoute>} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Layout>
                } 
              />
              <Route path="/" element={<Navigate to="/shop" replace />} />
            </Routes>

            <LoginModal isOpen={modal === 'login'} onClose={() => setModal('none')} onSwitchToRegister={() => setModal('register')} />
            <RegisterModal isOpen={modal === 'register'} onClose={() => setModal('none')} onSwitchToLogin={() => setModal('login')} />
            <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
            <Toast />
          </CartProvider>
        </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
