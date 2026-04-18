import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from './ToastContext';

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  update: (productId: number, qty: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);
const CART_STORAGE_KEY = 'shophub_cart_items';

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => ({
        productId: Number(item.productId),
        name: String(item.name || ''),
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 0),
      }))
      .filter((item) => Number.isFinite(item.productId) && item.productId > 0 && item.name.length > 0 && item.quantity > 0);
  } catch {
    return [];
  }
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage write failures.
    }
  }, [items]);

  const add = (item: Omit<CartItem, 'quantity'>, qty = 1) => {
    setItems(prev => {
      const exists = prev.find(i => i.productId === item.productId);
      if (exists) {
        showToast(`🛒 Updated "${item.name}"`, 'success');
        return prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i);
      }
      showToast(`🛒 Added "${item.name}"`, 'success');
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const update = (productId: number, qty: number) => {
    setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity: qty } : i));
  };

  const remove = (productId: number) => {
    const name = items.find(i => i.productId === productId)?.name;
    setItems(prev => prev.filter(i => i.productId !== productId));
    if (name) showToast(`🗑️ Removed "${name}"`, 'info');
  };

  const clear = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Ignore storage write failures.
    }
    showToast('🛒 Cart cleared', 'info');
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, update, remove, clear, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
