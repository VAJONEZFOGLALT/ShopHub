import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { api } from '../services/api';

type CompareItem = {
  productId: number;
  product?: any;
};

const COMPARE_LIMIT = 5;
const compareMemoryCache = new Map<number, number[]>();

const compareKey = (userId: number) => `shophub_compare_user_${userId}`;

const readCachedCompare = (userId: number): number[] => {
  const memory = compareMemoryCache.get(userId);
  if (memory) {
    return memory;
  }

  try {
    const raw = localStorage.getItem(compareKey(userId));
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    const ids = parsed.filter((id) => Number.isInteger(id));
    compareMemoryCache.set(userId, ids);
    return ids;
  } catch {
    return [];
  }
};

const persistCompareCache = (userId: number, ids: number[]) => {
  compareMemoryCache.set(userId, ids);
  try {
    localStorage.setItem(compareKey(userId), JSON.stringify(ids));
  } catch {
    // Ignore localStorage write errors.
  }
};

export function useCompare() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [compareItems, setCompareItems] = useState<any[]>([]);
  const [pendingIds, setPendingIds] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user) {
        setCompareIds([]);
        setCompareItems([]);
        setPendingIds([]);
        return;
      }

      const cached = readCachedCompare(user.id);
      if (!cancelled) {
        setCompareIds(cached);
      }

      try {
        const compare = await api.getCompare(user.id);
        const ids = compare.map((item: CompareItem) => item.productId);
        persistCompareCache(user.id, ids);
        if (!cancelled) {
          setCompareIds(ids);
          setCompareItems(compare.map((item: CompareItem) => item.product).filter(Boolean));
        }
      } catch {
        if (!cancelled && cached.length === 0) {
          setCompareIds([]);
          setCompareItems([]);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const compareIdSet = useMemo(() => new Set(compareIds), [compareIds]);

  const toggleCompare = async (product: any) => {
    const productId = Number(product?.id);

    if (!productId || Number.isNaN(productId)) {
      return;
    }

    if (!isAuthenticated || !user) {
      showToast('Please log in to compare products', 'warning');
      return;
    }

    if (pendingIds.includes(productId)) {
      return;
    }

    const exists = compareIdSet.has(productId);

    if (!exists && compareIds.length >= COMPARE_LIMIT) {
      showToast(`You can compare up to ${COMPARE_LIMIT} products`, 'warning');
      return;
    }

    const nextIds = exists
      ? compareIds.filter((id) => id !== productId)
      : [...compareIds, productId];

    const nextItems = exists
      ? compareItems.filter((item) => item?.id !== productId)
      : compareItems.some((item) => item?.id === productId)
        ? compareItems
        : [product, ...compareItems].slice(0, COMPARE_LIMIT);

    setPendingIds((prev) => [...prev, productId]);
    setCompareIds(nextIds);
    setCompareItems(nextItems);
    persistCompareCache(user.id, nextIds);

    try {
      if (exists) {
        await api.removeCompare(user.id, productId);
      } else {
        await api.addCompare({ userId: user.id, productId });
      }
    } catch (err: any) {
      setCompareIds(compareIds);
      setCompareItems(compareItems);
      persistCompareCache(user.id, compareIds);
      showToast(err?.message || 'Failed to update compare list', 'error');
    } finally {
      setPendingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const clearCompare = async () => {
    if (!isAuthenticated || !user) {
      showToast('Please log in to compare products', 'warning');
      return;
    }

    const previousIds = compareIds;
    const previousItems = compareItems;

    setCompareIds([]);
    setCompareItems([]);
    persistCompareCache(user.id, []);

    try {
      await api.clearCompare(user.id);
    } catch {
      setCompareIds(previousIds);
      setCompareItems(previousItems);
      persistCompareCache(user.id, previousIds);
      showToast('Failed to clear compare list', 'error');
    }
  };

  return {
    compareIds,
    compareItems,
    toggleCompare,
    clearCompare,
    isCompared: (productId: number) => compareIdSet.has(productId),
    isComparePending: (productId: number) => pendingIds.includes(productId),
  };
}
