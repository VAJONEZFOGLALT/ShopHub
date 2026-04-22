import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { api } from '../services/api';

type WishlistItem = {
  productId: number;
};

const wishlistMemoryCache = new Map<number, number[]>();

const wishlistKey = (userId: number) => `shophub_wishlist_user_${userId}`;

const readCachedWishlist = (userId: number): number[] => {
  const memory = wishlistMemoryCache.get(userId);
  if (memory) {
    return memory;
  }

  try {
    const raw = localStorage.getItem(wishlistKey(userId));
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const ids = parsed.filter((id) => Number.isInteger(id));
    wishlistMemoryCache.set(userId, ids);
    return ids;
  } catch {
    return [];
  }
};

const persistWishlistCache = (userId: number, ids: number[]) => {
  wishlistMemoryCache.set(userId, ids);
  try {
    localStorage.setItem(wishlistKey(userId), JSON.stringify(ids));
  } catch {
    // Ignore localStorage write errors.
  }
};

export function useWishlist() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [pendingIds, setPendingIds] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user) {
        setWishlistIds([]);
        setPendingIds([]);
        return;
      }

      const cached = readCachedWishlist(user.id);
      if (!cancelled) {
        setWishlistIds(cached);
      }

      try {
        const data = await api.getWishlist(user.id);
        const serverIds = data.map((item: WishlistItem) => item.productId);
        persistWishlistCache(user.id, serverIds);
        if (!cancelled) {
          setWishlistIds(serverIds);
        }
      } catch {
        if (!cancelled && cached.length === 0) {
          setWishlistIds([]);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleToggleWishlist = async (productId: number, productName?: string) => {
    if (!isAuthenticated || !user) {
      showToast('Please log in to use the wishlist feature', 'warning');
      return;
    }

    if (pendingIds.includes(productId)) {
      return;
    }

    const isCurrentlyWishlisted = wishlistIds.includes(productId);
    const nextIds = isCurrentlyWishlisted
      ? wishlistIds.filter((id) => id !== productId)
      : wishlistIds.includes(productId)
        ? wishlistIds
        : [...wishlistIds, productId];

    setPendingIds((prev) => [...prev, productId]);
    setWishlistIds(nextIds);
    persistWishlistCache(user.id, nextIds);

    try {
      if (isCurrentlyWishlisted) {
        await api.removeFromWishlistByProduct(user.id, productId);
        showToast(`💔 ${productName ? `"${productName}"` : 'Item'} removed from wishlist`, 'info');
      } else {
        await api.addToWishlist({ userId: user.id, productId });
        showToast(`❤️ ${productName ? `"${productName}"` : 'Item'} added to wishlist!`, 'success');
      }
    } catch {
      setWishlistIds(wishlistIds);
      persistWishlistCache(user.id, wishlistIds);
      showToast('Failed to update wishlist', 'error');
    } finally {
      setPendingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleRemoveWishlist = async (productId: number, productName?: string) => {
    if (!isAuthenticated || !user) {
      showToast('Please log in to use the wishlist feature', 'warning');
      return;
    }

    try {
      await api.removeFromWishlistByProduct(user.id, productId);
      const nextIds = wishlistIds.filter((id) => id !== productId);
      setWishlistIds(nextIds);
      persistWishlistCache(user.id, nextIds);
      showToast(`💔 ${productName ? `"${productName}"` : 'Item'} removed from wishlist`, 'info');
    } catch {
      showToast('Failed to remove from wishlist', 'error');
    }
  };

  return {
    wishlistIds,
    handleToggleWishlist,
    handleRemoveWishlist,
    isWishlisted: (productId: number) => wishlistIds.includes(productId),
    isWishlistPending: (productId: number) => pendingIds.includes(productId),
    requiresAuth: !isAuthenticated,
  };
}
