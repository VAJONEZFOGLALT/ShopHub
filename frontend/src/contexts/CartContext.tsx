import { createContext, useContext, useState } from 'react';
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

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { showToast } = useToast();

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
