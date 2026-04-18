import { useEffect, useMemo, useRef, useState } from 'react';
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

const emitCompareUpdated = (count: number) => {
  window.dispatchEvent(new CustomEvent('compare-updated', { detail: { count } }));
};

export function useCompare() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [compareItems, setCompareItems] = useState<any[]>([]);
  const [pendingIds, setPendingIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const compareIdsRef = useRef<number[]>([]);
  const compareItemsRef = useRef<any[]>([]);
  const pendingIdsRef = useRef<number[]>([]);
  const mutationVersionRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const loadVersion = ++mutationVersionRef.current;

    async function load() {
      if (!user) {
        compareIdsRef.current = [];
        compareItemsRef.current = [];
        pendingIdsRef.current = [];
        setCompareIds([]);
        setCompareItems([]);
        setPendingIds([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const cached = readCachedCompare(user.id);
      if (!cancelled) {
        setCompareIds(cached);
        emitCompareUpdated(cached.length);
      }

      try {
        const compare = await api.getCompare(user.id);
        const ids = compare.map((item: CompareItem) => item.productId);
        if (cancelled || loadVersion !== mutationVersionRef.current) {
          return;
        }
        persistCompareCache(user.id, ids);
        compareIdsRef.current = ids;
        compareItemsRef.current = compare.map((item: CompareItem) => item.product).filter(Boolean);
        emitCompareUpdated(ids.length);
        if (!cancelled) {
          setCompareIds(ids);
          setCompareItems(compareItemsRef.current);
        }
      } catch {
        if (!cancelled && cached.length === 0 && loadVersion === mutationVersionRef.current) {
          compareIdsRef.current = [];
          compareItemsRef.current = [];
          emitCompareUpdated(0);
          setCompareIds([]);
          setCompareItems([]);
        }
      } finally {
        if (!cancelled && loadVersion === mutationVersionRef.current) {
          setIsLoading(false);
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

    if (pendingIdsRef.current.includes(productId)) {
      return;
    }

    mutationVersionRef.current += 1;

    const previousIds = compareIdsRef.current;
    const previousItems = compareItemsRef.current;
    const exists = previousIds.includes(productId);

    if (!exists && previousIds.length >= COMPARE_LIMIT) {
      showToast(`You can compare up to ${COMPARE_LIMIT} products`, 'warning');
      return;
    }

    const nextIds = exists
      ? previousIds.filter((id) => id !== productId)
      : [...previousIds, productId];

    const nextItems = exists
      ? previousItems.filter((item) => item?.id !== productId)
      : previousItems.some((item) => item?.id === productId)
        ? previousItems
        : [product, ...previousItems].slice(0, COMPARE_LIMIT);

    pendingIdsRef.current = [...pendingIdsRef.current, productId];
    setPendingIds(pendingIdsRef.current);
    compareIdsRef.current = nextIds;
    compareItemsRef.current = nextItems;
    setCompareIds(nextIds);
    setCompareItems(nextItems);
    persistCompareCache(user.id, nextIds);
    emitCompareUpdated(nextIds.length);

    try {
      if (exists) {
        await api.removeCompare(user.id, productId);
      } else {
        await api.addCompare({ userId: user.id, productId });
      }
    } catch (err: any) {
      compareIdsRef.current = previousIds;
      compareItemsRef.current = previousItems;
      setCompareIds(previousIds);
      setCompareItems(previousItems);
      persistCompareCache(user.id, previousIds);
      emitCompareUpdated(previousIds.length);
      showToast(err?.message || 'Failed to update compare list', 'error');
    } finally {
      pendingIdsRef.current = pendingIdsRef.current.filter((id) => id !== productId);
      setPendingIds(pendingIdsRef.current);
    }
  };

  const clearCompare = async () => {
    if (!isAuthenticated || !user) {
      showToast('Please log in to compare products', 'warning');
      return;
    }

    mutationVersionRef.current += 1;

    const previousIds = compareIdsRef.current;
    const previousItems = compareItemsRef.current;

    compareIdsRef.current = [];
    compareItemsRef.current = [];
    setCompareIds([]);
    setCompareItems([]);
    persistCompareCache(user.id, []);
    emitCompareUpdated(0);

    try {
      await api.clearCompare(user.id);
    } catch {
      setCompareIds(previousIds);
      setCompareItems(previousItems);
      persistCompareCache(user.id, previousIds);
      emitCompareUpdated(previousIds.length);
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
    isCompareLoading: isLoading,
  };
}
