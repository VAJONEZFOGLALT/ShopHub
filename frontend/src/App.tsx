import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import './styles/App.css'

import UsersView from './adminpages/UsersView'
import ProductsView from './adminpages/ProductsView'
import OrdersView from './adminpages/OrdersView'
import OrderItemsView from './adminpages/OrderItemsView'
import CartProvider from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { ModalProvider, useModal } from './contexts/ModalContext'
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
import { Toast } from './components/Toast'
import { ScrollToTop } from './components/ScrollToTop'
import { useTranslation } from 'react-i18next';

const SUPPORTED_LANGUAGES = ['hu', 'en', 'es'];
const normalizeLanguage = (value: string) => value.toLowerCase().split('-')[0];

function LanguageUrlSync() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const rawUrlLang = params.get('lang');
    const urlLang = rawUrlLang ? normalizeLanguage(rawUrlLang) : null;
    const currentI18nLanguage = normalizeLanguage(i18n.language || 'hu');
    const isUrlLangSupported = !!urlLang && SUPPORTED_LANGUAGES.includes(urlLang);

    if (isUrlLangSupported && urlLang !== currentI18nLanguage) {
      void i18n.changeLanguage(urlLang);
      localStorage.setItem('language', urlLang);
      return;
    }

    const currentLang = SUPPORTED_LANGUAGES.includes(currentI18nLanguage) ? currentI18nLanguage : 'hu';
    if (!isUrlLangSupported || urlLang !== currentLang) {
      params.set('lang', currentLang);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [i18n, i18n.language, location.pathname, location.search, navigate]);

  return null;
}

function AdminPanel() {
  const [tab, setTab] = useState('users')
  const navigate = useNavigate()
  
  const views: Record<string, React.JSX.Element> = {
    users: <UsersView />,
    products: <ProductsView />,
    orders: <OrdersView />,
    orderItems: <OrderItemsView />
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
          {Object.keys(views).map(key => (
            <button 
              key={key}
              className={tab === key ? 'active' : ''}
              onClick={() => setTab(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </nav>
      </header>
      <main className="main">{views[tab]}</main>
    </div>
  )
}

function AppContent() {
  const [cartOpen, setCartOpen] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState<number | undefined>(undefined)
  const { modal, openLoginModal, closeModal, switchToRegister, switchToLogin } = useModal()

  return (
    <Router>
      <LanguageUrlSync />
      <ScrollToTop />
      <CartProvider>
        <Routes>
          <Route path="/admin/*" element={<ProtectedAdminRoute><AdminPanel /></ProtectedAdminRoute>} />
          <Route 
            path="/shop/*" 
            element={
              <Layout onAuth={() => openLoginModal()} onCart={() => setCartOpen(true)}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="all" element={<AllProductsPage />} />
                  <Route path="product/:id" element={<ProductDetailPage />} />
                  <Route path="category/:name" element={<CategoryPage />} />
                  <Route path="checkout" element={<ProtectedRoute><CheckoutPage onSuccess={setOrderConfirmed} /></ProtectedRoute>} />
                  <Route path="confirmation" element={<ProtectedRoute><OrderConfirmationPage orderId={orderConfirmed} /></ProtectedRoute>} />
                  <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Layout>
            } 
          />
          <Route path="/" element={<Navigate to="/shop" replace />} />
        </Routes>

        <LoginModal isOpen={modal === 'login'} onClose={() => closeModal()} onSwitchToRegister={() => switchToRegister()} />
        <RegisterModal isOpen={modal === 'register'} onClose={() => closeModal()} onSwitchToLogin={() => switchToLogin()} />
        <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <Toast />
      </CartProvider>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ModalProvider>
          <AppContent />
        </ModalProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
