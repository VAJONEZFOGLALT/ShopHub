import { createContext, useContext, useMemo, useState } from 'react';

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

export type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  update: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function add(item: Omit<CartItem, 'quantity'>, quantity = 1) {
    setItems(prev => {
      let foundIndex = -1;
      for (let i = 0; i < prev.length; i += 1) {
        if (prev[i].productId === item.productId) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex !== -1) {
        const next = prev.slice();
        const existing = next[foundIndex];
        next[foundIndex] = { ...existing, quantity: existing.quantity + quantity };
        return next;
      }

      const nextItem: CartItem = { ...item, quantity };
      return prev.concat(nextItem);
    });
  }

  function update(productId: number, quantity: number) {
    setItems(prev => {
      const next = prev.slice();
      for (let i = 0; i < next.length; i += 1) {
        const item = next[i];
        if (item.productId === productId) {
          next[i] = { ...item, quantity };
        }
      }
      return next;
    });
  }

  function remove(productId: number) {
    setItems(prev => {
      const next: CartItem[] = [];
      for (let i = 0; i < prev.length; i += 1) {
        const item = prev[i];
        if (item.productId !== productId) {
          next.push(item);
        }
      }
      return next;
    });
  }

  function clear() {
    setItems([]);
  }

  const total = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      sum += item.price * item.quantity;
    }
    return sum;
  }, [items]);

  const value: CartContextValue = { items, add, update, remove, clear, total };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
