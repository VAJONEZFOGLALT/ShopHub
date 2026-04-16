import { useState, useEffect, useRef } from 'react';
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
  const wishlistIdsRef = useRef<number[]>([]);
  const pendingIdsRef = useRef<number[]>([]);
  const mutationVersionRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const loadVersion = ++mutationVersionRef.current;

    async function load() {
      if (!user) {
        wishlistIdsRef.current = [];
        pendingIdsRef.current = [];
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
        if (cancelled || loadVersion !== mutationVersionRef.current) {
          return;
        }
        persistWishlistCache(user.id, serverIds);
        wishlistIdsRef.current = serverIds;
        if (!cancelled) {
          setWishlistIds(serverIds);
        }
      } catch {
        if (!cancelled && cached.length === 0 && loadVersion === mutationVersionRef.current) {
          wishlistIdsRef.current = [];
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

    if (pendingIdsRef.current.includes(productId)) {
      return;
    }

    mutationVersionRef.current += 1;

    const previousIds = wishlistIdsRef.current;
    const isCurrentlyWishlisted = previousIds.includes(productId);
    const nextIds = isCurrentlyWishlisted
      ? previousIds.filter((id) => id !== productId)
      : previousIds.includes(productId)
        ? previousIds
        : [...previousIds, productId];

    pendingIdsRef.current = [...pendingIdsRef.current, productId];
    setPendingIds(pendingIdsRef.current);
    wishlistIdsRef.current = nextIds;
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
      wishlistIdsRef.current = previousIds;
      setWishlistIds(previousIds);
      persistWishlistCache(user.id, previousIds);
      showToast('Failed to update wishlist', 'error');
    } finally {
      pendingIdsRef.current = pendingIdsRef.current.filter((id) => id !== productId);
      setPendingIds(pendingIdsRef.current);
    }
  };

  const handleRemoveWishlist = async (productId: number, productName?: string) => {
    if (!isAuthenticated || !user) {
      showToast('Please log in to use the wishlist feature', 'warning');
      return;
    }

    try {
      await api.removeFromWishlistByProduct(user.id, productId);
      const nextIds = wishlistIdsRef.current.filter((id) => id !== productId);
      wishlistIdsRef.current = nextIds;
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
