type StoredReview = {
  id: string;
  productId: number;
  rating: number;
  title: string;
  comment: string;
  userName: string;
  createdAt: string;
};

type RecentlyViewedItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string;
};

const WISHLIST_KEY = 'shophub_wishlist';
const RECENT_KEY = 'shophub_recently_viewed';
const COMPARE_KEY = 'shophub_compare';
const REVIEWS_KEY = 'shophub_reviews';

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getWishlist(): number[] {
  return safeParse<number[]>(localStorage.getItem(WISHLIST_KEY), []);
}

export function toggleWishlist(productId: number): number[] {
  const list = getWishlist();
  const index = list.indexOf(productId);
  if (index >= 0) {
    list.splice(index, 1);
  } else {
    list.unshift(productId);
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  return list;
}

export function isWishlisted(productId: number): boolean {
  return getWishlist().includes(productId);
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  return safeParse<RecentlyViewedItem[]>(localStorage.getItem(RECENT_KEY), []);
}

export function addRecentlyViewed(item: RecentlyViewedItem): RecentlyViewedItem[] {
  const list = getRecentlyViewed().filter(entry => entry.id !== item.id);
  list.unshift(item);
  const trimmed = list.slice(0, 8);
  localStorage.setItem(RECENT_KEY, JSON.stringify(trimmed));
  return trimmed;
}

export const COMPARE_MAX_ITEMS = 5;

export function getCompareList(): number[] {
  return safeParse<number[]>(localStorage.getItem(COMPARE_KEY), []);
}

export function toggleCompare(productId: number, maxItems = COMPARE_MAX_ITEMS): { list: number[]; added: boolean; limitReached: boolean } {
  const list = getCompareList();
  const index = list.indexOf(productId);
  if (index >= 0) {
    list.splice(index, 1);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
    return { list, added: false, limitReached: false };
  }
  if (list.length >= maxItems) {
    return { list, added: false, limitReached: true };
  }
  list.push(productId);
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
  return { list, added: true, limitReached: false };
}

export function clearCompare(): void {
  localStorage.setItem(COMPARE_KEY, JSON.stringify([]));
}

export function getReviews(productId: number): StoredReview[] {
  const all = safeParse<Record<string, StoredReview[]>>(localStorage.getItem(REVIEWS_KEY), {});
  return all[String(productId)] || [];
}

export function addReview(productId: number, review: Omit<StoredReview, 'id' | 'productId' | 'createdAt'>): StoredReview[] {
  const all = safeParse<Record<string, StoredReview[]>>(localStorage.getItem(REVIEWS_KEY), {});
  const list = all[String(productId)] || [];
  const entry: StoredReview = {
    id: `${productId}-${Date.now()}`,
    productId,
    rating: review.rating,
    title: review.title,
    comment: review.comment,
    userName: review.userName,
    createdAt: new Date().toISOString(),
  };
  const updated = [entry, ...list].slice(0, 50);
  all[String(productId)] = updated;
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
  return updated;
}

export function getReviewSummary(productId: number): { average: number; count: number } {
  const list = getReviews(productId);
  if (list.length === 0) {
    return { average: 0, count: 0 };
  }
  const total = list.reduce((sum, item) => sum + item.rating, 0);
  return { average: total / list.length, count: list.length };
}
