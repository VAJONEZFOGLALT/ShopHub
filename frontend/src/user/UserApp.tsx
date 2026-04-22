import ProductsPage from './ProductsPage';
import CheckoutPage from './CheckoutPage';
import CartPage from './pages/CartPage';
import { CartProvider } from './CartContext';
import Layout from './components/Layout';
import Navbar, { PageKey } from './components/Navbar';

import { useState } from 'react';

function Shell() {
  const [page, setPage] = useState<PageKey>('products');

  const handleSetCheckout = () => {
    setPage('checkout');
  };

  let content: JSX.Element | null = null;
  if (page === 'products') {
    content = <ProductsPage />;
  } else if (page === 'cart') {
    content = <CartPage goCheckout={handleSetCheckout} />;
  } else if (page === 'checkout') {
    content = <CheckoutPage />;
  }
  return (
    <Layout page={page} setPage={setPage}>
      {content}
    </Layout>
  );
}

export default function UserApp() {
  return (
    <CartProvider>
      <Shell />
    </CartProvider>
  );
}
