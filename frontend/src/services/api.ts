const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '');

const rawBaseUrl = import.meta.env.VITE_API_URL;
let BASE_URL = normalizeBaseUrl('http://localhost:3000');
if (typeof rawBaseUrl === 'string' && rawBaseUrl.length > 0) {
  BASE_URL = normalizeBaseUrl(rawBaseUrl);
}

const cloneRequestInit = (init: RequestInit): RequestInit => ({
  ...init,
  headers: init.headers ? new Headers(init.headers) : undefined,
});

const withLeadingSlash = (path: string) => (path.startsWith('/') ? path : `/${path}`);

const withApiPrefix = (path: string) => {
  const normalizedPath = withLeadingSlash(path);
  if (normalizedPath.startsWith('/api/')) {
    return normalizedPath;
  }
  return `/api${normalizedPath}`;
};

const requestUrl = (path: string) => {
  const normalizedBase = BASE_URL.replace(/\/api\/?$/, '');
  return `${normalizedBase}${withApiPrefix(path)}`;
};

const fetchApi = (path: string, init: RequestInit) => fetch(requestUrl(path), cloneRequestInit(init));

let authToken = '';
let refreshToken = '';
const storedToken = localStorage.getItem('authToken');
const storedRefresh = localStorage.getItem('refreshToken');
if (storedToken) {
  authToken = storedToken;
}
if (storedRefresh) {
  refreshToken = storedRefresh;
}

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: Error) => void }> = [];
type ProductsCacheEntry = {
  data: any[];
  expiresAt: number;
};

const productsCache = new Map<string, ProductsCacheEntry>();
const productsRequestInFlight = new Map<string, Promise<any[]>>();

const PRODUCTS_CACHE_KEY_PREFIX = 'shophub_products_cache_v4';
const LEGACY_PRODUCTS_CACHE_KEYS = ['shophub_products_cache_v2', 'shophub_products_cache_v3'];
const PRODUCTS_CACHE_TTL_MS = 60 * 1000;

const normalizeLanguage = (value: string) => value.toLowerCase().split('-')[0];

const getCurrentLanguage = () => {
  const explicitLanguage = localStorage.getItem('language');
  if (explicitLanguage) {
    return normalizeLanguage(explicitLanguage);
  }

  const i18nLanguage = localStorage.getItem('i18nextLng');
  if (i18nLanguage) {
    return normalizeLanguage(i18nLanguage);
  }

  return 'hu';
};

const getProductsCacheKey = (language: string) => `${PRODUCTS_CACHE_KEY_PREFIX}_${normalizeLanguage(language)}`;

const processQueue = (err: Error | null, token: string | null) => {
  failedQueue.forEach(p => {
    if (err) {
      p.reject(err);
    } else if (token) {
      p.resolve(token);
    }
  });
  failedQueue = [];
};

const applyTokens = (token: string, newRefresh?: string) => {
  authToken = token;
  localStorage.setItem('authToken', token);
  if (newRefresh) {
    refreshToken = newRefresh;
    localStorage.setItem('refreshToken', newRefresh);
  }
};

const clearTokens = () => {
  authToken = '';
  refreshToken = '';
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
};

const loadProductsFromStorage = (language: string) => {
  const normalizedLanguage = normalizeLanguage(language);
  const inMemory = productsCache.get(normalizedLanguage);
  if (inMemory && Date.now() < inMemory.expiresAt) {
    return inMemory.data;
  }

  try {
    for (let i = 0; i < LEGACY_PRODUCTS_CACHE_KEYS.length; i += 1) {
      localStorage.removeItem(LEGACY_PRODUCTS_CACHE_KEYS[i]);
    }

    const raw = localStorage.getItem(getProductsCacheKey(normalizedLanguage));
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as { data?: any[]; expiresAt?: number };
    if (!parsed || !Array.isArray(parsed.data) || typeof parsed.expiresAt !== 'number') {
      localStorage.removeItem(getProductsCacheKey(normalizedLanguage));
      return null;
    }
    if (Date.now() >= parsed.expiresAt) {
      localStorage.removeItem(getProductsCacheKey(normalizedLanguage));
      return null;
    }

    productsCache.set(normalizedLanguage, { data: parsed.data, expiresAt: parsed.expiresAt });
    return parsed.data;
  } catch {
    localStorage.removeItem(getProductsCacheKey(normalizedLanguage));
    return null;
  }
};

const saveProductsToStorage = (language: string, data: any[]) => {
  const normalizedLanguage = normalizeLanguage(language);
  const expiresAt = Date.now() + PRODUCTS_CACHE_TTL_MS;

  productsCache.set(normalizedLanguage, {
    data,
    expiresAt,
  });

  try {
    localStorage.setItem(
      getProductsCacheKey(normalizedLanguage),
      JSON.stringify({ data, expiresAt }),
    );
  } catch {
    // best effort cache
  }
};

const invalidateProductsCache = () => {
  productsCache.clear();
  productsRequestInFlight.clear();

  for (let i = localStorage.length - 1; i >= 0; i -= 1) {
    const key = localStorage.key(i);
    if (!key) {
      continue;
    }

    if (key.startsWith(PRODUCTS_CACHE_KEY_PREFIX) || LEGACY_PRODUCTS_CACHE_KEYS.includes(key)) {
      localStorage.removeItem(key);
    }
  }
};

async function refreshAccessToken(): Promise<string> {
  if (!refreshToken) {
    throw new Error('No refresh token');
  }
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  try {
    const res = await fetchApi('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      throw new Error('Refresh failed');
    }
    const data = (await res.json()) as { token: string; refreshToken?: string };
    applyTokens(data.token, data.refreshToken);
    processQueue(null, data.token);
    return data.token;
  } catch (err) {
    clearTokens();
    processQueue(err as Error, null);
    throw err;
  } finally {
    isRefreshing = false;
  }
}

async function request<T>(path: string, init?: RequestInit, retry = true) {
  const headers: Record<string, string> = {};
  const isFormData = init?.body instanceof FormData;
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const requestInit: RequestInit = {
    headers,
  };
  if (init) {
    Object.assign(requestInit, init);
  }

  const res = await fetchApi(path, requestInit);
  
  // Handle token expiration - retry with fresh token if available
  if (res.status === 401 && retry && refreshToken) {
    try {
      await refreshAccessToken();
      return request<T>(path, init, false);
    } catch {
      // Fall through to error handling below
    }
  }

  if (!res.ok) {
    let text = '';
    try {
      text = await res.text();
    } catch {
      text = '';
    }
    const message = text || res.statusText;
    throw new Error(`HTTP ${res.status}: ${message}`);
  }

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  if (isJson) {
    const data = (await res.json()) as T;
    return data;
  }

  return undefined as unknown as T;
}

const translateTexts = async (texts: string[], targetLanguage: string) => {
  const normalizedLanguage = normalizeLanguage(targetLanguage);
  if (normalizedLanguage === 'en' || texts.length === 0) {
    return texts;
  }

  const uniqueValues: string[] = [];
  const uniqueMap = new Map<string, number>();
  for (let i = 0; i < texts.length; i += 1) {
    const value = texts[i];
    if (!value || uniqueMap.has(value)) {
      continue;
    }
    uniqueMap.set(value, uniqueValues.length);
    uniqueValues.push(value);
  }

  if (uniqueValues.length === 0) {
    return texts;
  }

  try {
    const translatedUnique = await request<string[]>('/translations/translate-batch', {
      method: 'POST',
      body: JSON.stringify({
        texts: uniqueValues,
        sourceLang: 'en',
        targetLang: normalizedLanguage,
      }),
    });

    const translated: string[] = [];
    for (let i = 0; i < texts.length; i += 1) {
      const value = texts[i];
      if (!value) {
        translated.push(value);
        continue;
      }

      const index = uniqueMap.get(value);
      if (typeof index !== 'number') {
        translated.push(value);
        continue;
      }

      translated.push(translatedUnique[index] || value);
    }

    return translated;
  } catch {
    return texts;
  }
};

const translateProducts = async (products: any[], language: string) => {
  const normalizedLanguage = normalizeLanguage(language);
  if (products.length === 0) {
    return products;
  }

  if (normalizedLanguage === 'en') {
    return products.map((product) => ({
      ...product,
      categoryLabel: product.categoryLabel || product.category,
    }));
  }

  const names = products.map((product) => (typeof product?.name === 'string' ? product.name : ''));
  const descriptions = products.map((product) => (typeof product?.description === 'string' ? product.description : ''));
  const categories = products.map((product) => (typeof product?.category === 'string' ? product.category : ''));

  const [translatedNames, translatedDescriptions, translatedCategories] = await Promise.all([
    translateTexts(names, normalizedLanguage),
    translateTexts(descriptions, normalizedLanguage),
    translateTexts(categories, normalizedLanguage),
  ]);

  return products.map((product, index) => ({
    ...product,
    name: translatedNames[index] || product.name,
    description: translatedDescriptions[index] || product.description,
    category: product.category,
    categoryLabel: translatedCategories[index] || product.category,
  }));
};

export const api = {
  // Auth
  register: async (data: { email: string; password: string; username: string; name?: string }) => {
    const res = await request<{ id: number; email: string; username: string; name: string; role: string; token: string; refreshToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    applyTokens(res.token, res.refreshToken);
    return res;
  },

  login: async (data: { identifier: string; password: string }) => {
    const res = await request<{ id: number; email: string; username: string; name: string; role: string; token: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    applyTokens(res.token, res.refreshToken);
    return res;
  },

  logout: () => {
    clearTokens();
  },

  setToken: (token: string) => {
    authToken = token;
    localStorage.setItem('authToken', token);
  },

  setTokens: (token: string, newRefresh?: string) => {
    applyTokens(token, newRefresh);
  },

  // Users
  getUsers: async () => {
    const data = await request<any[]>('/users');
    return data;
  },
  createUser: async (data: { username: string; email: string; password: string }) => {
    const created = await request<any>('/users', { method: 'POST', body: JSON.stringify(data) });
    return created;
  },
  updateUser: async (id: number, data: { username?: string; email?: string; password?: string; role?: string }) => {
    const updated = await request<any>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    return updated;
  },
  uploadUserAvatar: async (id: number, file: File) => {
    const body = new FormData();
    body.append('file', file);
    const updated = await request<any>(`/users/${id}/avatar`, { method: 'POST', body });
    return updated;
  },
  deleteUser: async (id: number) => {
    const res = await request<void>(`/users/${id}`, { method: 'DELETE' });
    return res;
  },

  // Products
  getProducts: async () => {
    const language = getCurrentLanguage();

    const fromStorage = loadProductsFromStorage(language);
    if (fromStorage) {
      return fromStorage;
    }

    const normalizedLanguage = normalizeLanguage(language);
    const inFlight = productsRequestInFlight.get(normalizedLanguage);
    if (inFlight) {
      return inFlight;
    }

    const requestPromise = request<any[]>('/products')
      .then(async (data) => {
        const list = Array.isArray(data) ? data : [];
        const translated = await translateProducts(list, normalizedLanguage);
        saveProductsToStorage(normalizedLanguage, translated);
        return translated;
      })
      .finally(() => {
        productsRequestInFlight.delete(normalizedLanguage);
      });

    productsRequestInFlight.set(normalizedLanguage, requestPromise);

    return requestPromise;
  },
  createProduct: async (data: { name: string; description?: string; category: string; price: number; stock: number }) => {
    const created = await request<any>('/products', { method: 'POST', body: JSON.stringify(data) });
    invalidateProductsCache();
    return created;
  },
  uploadProductImage: async (id: number, file: File) => {
    const body = new FormData();
    body.append('file', file);
    const updated = await request<any>(`/products/${id}/image`, { method: 'POST', body });
    invalidateProductsCache();
    return updated;
  },
  deleteProduct: async (id: number) => {
    const res = await request<void>(`/products/${id}`, { method: 'DELETE' });
    invalidateProductsCache();
    return res;
  },

  // Orders
  getOrders: async () => {
    const data = await request<any[]>('/orders');
    return data;
  },
  getUserOrders: async (userId: number) => {
    const data = await request<any[]>(`/orders/user/${userId}`);
    return data;
  },
  createOrder: async (data: { 
    userId: number; 
    items: { productId: number; quantity: number }[];
    courier?: string;
    shippingAddress?: string;
  }): Promise<{ id: number; userId: number; total: number; status: string; courier?: string; shippingAddress?: string }> => {
    const created = await request<{ id: number; userId: number; total: number; status: string; courier?: string; shippingAddress?: string }>('/orders', { method: 'POST', body: JSON.stringify(data) });
    return created;
  },
  deleteOrder: async (id: number) => {
    const res = await request<void>(`/orders/${id}`, { method: 'DELETE' });
    return res;
  },

  // Order Items
  getOrderItems: async () => {
    const data = await request<any[]>('/order-items');
    return data;
  },
  createOrderItem: async (data: { orderId: number; productId: number; quantity: number; price: number }) => {
    const created = await request<any>('/order-items', { method: 'POST', body: JSON.stringify(data) });
    return created;
  },
  deleteOrderItem: async (id: number) => {
    const res = await request<void>(`/order-items/${id}`, { method: 'DELETE' });
    return res;
  },

  // Reviews
  getReviews: async () => {
    const data = await request<any[]>('/reviews');
    return data;
  },
  getProductReviews: async (productId: number) => {
    const data = await request<any[]>(`/reviews/product/${productId}`);
    return data;
  },
  getAverageRating: async (productId: number) => {
    const data = await request<{ average: number; count: number }>(`/reviews/product/${productId}/average`);
    return data;
  },
  createReview: async (data: { userId: number; productId: number; rating: number; title: string; comment: string }) => {
    const created = await request<any>('/reviews', { method: 'POST', body: JSON.stringify(data) });
    return created;
  },
  updateReview: async (id: number, data: { rating?: number; comment?: string }) => {
    const updated = await request<any>(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    return updated;
  },
  deleteReview: async (id: number) => {
    const res = await request<void>(`/reviews/${id}`, { method: 'DELETE' });
    return res;
  },

  // Wishlist
  getWishlist: async (userId: number) => {
    const data = await request<any[]>(`/wishlist/user/${userId}`);
    return data;
  },
  addToWishlist: async (data: { userId: number; productId: number }) => {
    const created = await request<any>('/wishlist', { method: 'POST', body: JSON.stringify(data) });
    return created;
  },
  removeFromWishlist: async (id: number) => {
    const res = await request<void>(`/wishlist/${id}`, { method: 'DELETE' });
    return res;
  },
  removeFromWishlistByProduct: async (userId: number, productId: number) => {
    const res = await request<void>(`/wishlist/user/${userId}/product/${productId}`, { method: 'DELETE' });
    return res;
  },
  isInWishlist: async (userId: number, productId: number) => {
    const exists = await request<boolean>(`/wishlist/check/${userId}/${productId}`);
    return exists;
  },

  // Recently Viewed
  getRecentlyViewed: async (userId: number) => {
    const data = await request<any[]>(`/recently-viewed/user/${userId}`);
    return data;
  },
  addRecentlyViewed: async (data: { userId: number; productId: number }) => {
    const created = await request<any>('/recently-viewed', { method: 'POST', body: JSON.stringify(data) });
    return created;
  },
  clearRecentlyViewed: async (userId: number) => {
    const res = await request<void>(`/recently-viewed/user/${userId}`, { method: 'DELETE' });
    return res;
  },

  // Compare
  getCompare: async (userId: number) => {
    const data = await request<any[]>(`/compare/user/${userId}`);
    return data;
  },
  addCompare: async (data: { userId: number; productId: number }) => {
    const created = await request<any>('/compare', { method: 'POST', body: JSON.stringify(data) });
    return created;
  },
  removeCompare: async (userId: number, productId: number) => {
    const res = await request<void>(`/compare/user/${userId}/product/${productId}`, { method: 'DELETE' });
    return res;
  },
  clearCompare: async (userId: number) => {
    const res = await request<void>(`/compare/user/${userId}`, { method: 'DELETE' });
    return res;
  },

  // Addresses
  getAddresses: async (userId: number) => {
    const data = await request<any[]>(`/addresses?userId=${userId}`);
    return data;
  },
  createAddress: async (data: {
    userId: number;
    label: string;
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    isDefault?: boolean;
  }) => {
    const created = await request<any>('/addresses', { method: 'POST', body: JSON.stringify(data) });
    return created;
  },
  updateAddress: async (id: number, data: any) => {
    const updated = await request<any>(`/addresses/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    return updated;
  },
  deleteAddress: async (id: number) => {
    const res = await request<void>(`/addresses/${id}`, { method: 'DELETE' });
    return res;
  },
};

export type ApiError = Error;
