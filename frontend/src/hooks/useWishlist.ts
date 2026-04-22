import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { api } from '../services/api';

type WishlistItem = {
  productId: number;
};

export function useWishlist() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  useEffect(() => {
    async function load() {
      if (user) {
        const data = await api.getWishlist(user.id);
        setWishlistIds(data.map((item: WishlistItem) => item.productId));
      } else {
        setWishlistIds([]);
      }
    }
    load();
  }, [user]);

  const handleToggleWishlist = async (productId: number, productName?: string) => {
    if (!isAuthenticated || !user) {
      showToast('Please log in to use the wishlist feature', 'warning');
      return;
    }

    const isCurrentlyWishlisted = wishlistIds.includes(productId);

    try {
      if (isCurrentlyWishlisted) {
        await api.removeFromWishlistByProduct(user.id, productId);
        showToast(`💔 ${productName ? `"${productName}"` : 'Item'} removed from wishlist`, 'info');
      } else {
        await api.addToWishlist({ userId: user.id, productId });
        showToast(`❤️ ${productName ? `"${productName}"` : 'Item'} added to wishlist!`, 'success');
      }
      const updated = await api.getWishlist(user.id);
      setWishlistIds(updated.map((item: WishlistItem) => item.productId));
    } catch {
      showToast('Failed to update wishlist', 'error');
    }
  };

  const handleRemoveWishlist = async (productId: number, productName?: string) => {
    if (!isAuthenticated || !user) {
      showToast('Please log in to use the wishlist feature', 'warning');
      return;
    }

    try {
      await api.removeFromWishlistByProduct(user.id, productId);
      const updated = await api.getWishlist(user.id);
      setWishlistIds(updated.map((item: WishlistItem) => item.productId));
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
    requiresAuth: !isAuthenticated,
  };
}
