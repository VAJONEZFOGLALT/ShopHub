import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import UsersView from './admin/UsersView'
import ProductsView from './admin/ProductsView'
import OrdersView from './admin/OrdersView'
import OrderItemsView from './admin/OrderItemsView'

// User shop
import { CartProvider } from './user/CartContext'
import { AuthProvider } from './auth/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { LoginModal } from './auth/LoginModal'
import { RegisterModal } from './auth/RegisterModal'
import { CartModal } from './user/components/CartModal'
import Layout from './user/components/Layout'
import HomePage from './user/pages/HomePage'
import AllProductsPage from './user/pages/AllProductsPage'
import ProductDetailPage from './user/pages/ProductDetailPage'
import CategoryPage from './user/pages/CategoryPage'
import CartPage from './user/pages/CartPage'
import CheckoutPage from './user/CheckoutPage'
import OrderConfirmationPage from './user/pages/OrderConfirmationPage'
import NotFoundPage from './user/pages/NotFoundPage'
import { ProfilePage } from './user/pages/ProfilePage'
import { OrdersPage } from './user/pages/OrdersPage'

type TabKey = 'users' | 'products' | 'orders' | 'orderItems'
type Mode = 'admin' | 'shop'
type AuthModal = 'none' | 'login' | 'register'

function AdminApp() {
  const [tab, setTab] = useState<TabKey>('users')
  const navigate = useNavigate()
  
  const handleBackToShop = () => {
    navigate('/shop')
  }

  const handleTabChange = (nextTab: TabKey) => {
    setTab(nextTab)
  }

  let mainContent: JSX.Element | null = null
  if (tab === 'users') {
    mainContent = <UsersView />
  } else if (tab === 'products') {
    mainContent = <ProductsView />
  } else if (tab === 'orders') {
    mainContent = <OrdersView />
  } else if (tab === 'orderItems') {
    mainContent = <OrderItemsView />
  }

  return (
    <div className="app">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1>Admin Dashboard</h1>
          <button 
            onClick={handleBackToShop} 
            style={{ 
              background: 'transparent', 
              border: '1px solid var(--border)', 
              color: 'var(--muted)', 
              padding: '8px 14px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '0.9em'
            }}
          >
            → Back to Shop
          </button>
        </div>
        <nav className="nav">
          <button className={tab === 'users' ? 'active' : ''} onClick={() => handleTabChange('users')}>Users</button>
          <button className={tab === 'products' ? 'active' : ''} onClick={() => handleTabChange('products')}>Products</button>
          <button className={tab === 'orders' ? 'active' : ''} onClick={() => handleTabChange('orders')}>Orders</button>
          <button className={tab === 'orderItems' ? 'active' : ''} onClick={() => handleTabChange('orderItems')}>Order Items</button>
        </nav>
      </header>
      <main className="main">
        {mainContent}
      </main>
    </div>
  )
}

function ShopApp({ onOpenAuth }: { onOpenAuth: (modal: AuthModal) => void }) {
  const [lastOrderId, setLastOrderId] = useState<number | undefined>()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const handleOpenCart = () => {
    setIsCartOpen(true)
  }

  const handleCloseCart = () => {
    setIsCartOpen(false)
  }

  const handleOrderSuccess = (id: number) => {
    setLastOrderId(id)
  }

  return (
    <CartProvider>
      <Layout onOpenAuth={onOpenAuth} onOpenCart={handleOpenCart}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/all" element={<AllProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage goCheckout={() => {}} />} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage onSuccess={handleOrderSuccess} /></ProtectedRoute>} />
          <Route path="/confirmation" element={<ProtectedRoute><OrderConfirmationPage orderId={lastOrderId} /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      <CartModal isOpen={isCartOpen} onClose={handleCloseCart} />
    </CartProvider>
  )
}

function App() {
  const [authModal, setAuthModal] = useState<AuthModal>('none')

  const handleOpenAuth = (modal: AuthModal) => {
    setAuthModal(modal);
  };

  const handleCloseAuth = () => {
    setAuthModal('none');
  };

  const handleSwitchModal = (modal: AuthModal) => {
    setAuthModal(modal);
  };

  const isLoginOpen = authModal === 'login'
  const isRegisterOpen = authModal === 'register'
  
  return (
    <AuthProvider>
      <Router>
        <div className="app-root">
          <Routes>
            <Route path="/shop/*" element={<ShopApp onOpenAuth={handleOpenAuth} />} />
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/" element={<ShopApp onOpenAuth={handleOpenAuth} />} />
          </Routes>

          <LoginModal 
            isOpen={isLoginOpen} 
            onClose={handleCloseAuth}
            onSwitchToRegister={() => handleSwitchModal('register')}
          />
          <RegisterModal 
            isOpen={isRegisterOpen} 
            onClose={handleCloseAuth}
            onSwitchToLogin={() => handleSwitchModal('login')}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
