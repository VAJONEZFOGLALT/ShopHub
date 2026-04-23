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

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;
  rawMessage?: string;

  constructor(
    message: string,
    options: { status: number; code?: string; details?: unknown; rawMessage?: string },
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
    this.rawMessage = options.rawMessage;
  }
}

const mapStatusToMessage = (status: number, serverMessage?: string) => {
  if (status === 400) return serverMessage || 'A kuldott adatok ervenytelenek.';
  if (status === 401) return 'A munkamenet lejart vagy ervenytelen. Jelentkezz be ujra.';
  if (status === 403) return 'Nincs jogosultsagod ehhez a muvelethez.';
  if (status === 404) return 'A kert eroforras nem talalhato.';
  if (status === 409) return serverMessage || 'Utkozes tortent, a muvelet nem hajthato vegre.';
  if (status >= 500) return 'Szerverhiba tortent. Probald meg kesobb.';
  return serverMessage || 'Varatlan hiba tortent.';
};

const readServerMessage = (payload: unknown, fallbackText: string) => {
  if (!payload || typeof payload !== 'object') {
    return fallbackText;
  }

  const maybeMessage = (payload as { message?: unknown }).message;
  if (Array.isArray(maybeMessage)) {
    return maybeMessage.map((item) => String(item)).join(' ');
  }
  if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
    return maybeMessage;
  }

  const maybeError = (payload as { error?: unknown }).error;
  if (typeof maybeError === 'string' && maybeError.trim()) {
    return maybeError;
  }

  return fallbackText;
};

export const getApiErrorMessage = (error: unknown, fallback = 'Varatlan hiba tortent.') => {
  if (error instanceof ApiError) {
    return error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
};

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

const normalizeLanguage = (value: string) => value.toLowerCase().split('-')[0];

const PRODUCTS_CACHE_TTL_MS = 5 * 60 * 1000;
type ProductsCacheEntry = { expiresAt: number; data: any[] };
const productsCache = new Map<string, ProductsCacheEntry>();
const productsInFlight = new Map<string, Promise<any[]>>();

const readProductsCache = (lang: string): any[] | null => {
  const cached = productsCache.get(lang);
  if (!cached) {
    return null;
  }
  if (Date.now() > cached.expiresAt) {
    productsCache.delete(lang);
    return null;
  }
  return cached.data;
};

const writeProductsCache = (lang: string, data: any[]) => {
  productsCache.set(lang, {
    expiresAt: Date.now() + PRODUCTS_CACHE_TTL_MS,
    data,
  });
};

const clearProductsCache = () => {
  productsCache.clear();
  productsInFlight.clear();
};

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

const normalizeReview = (review: any) => {
  const userName = String(
    review?.userName
      || review?.user?.username
      || review?.user?.name
      || ''
  ).trim();

  return {
    ...review,
    userName,
  };
};

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

async function refreshAccessToken(): Promise<string> {
  if (!refreshToken) {
    throw new ApiError('A munkamenet lejart. Jelentkezz be ujra.', { status: 401 });
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
      throw new ApiError('A munkamenet frissitese sikertelen. Jelentkezz be ujra.', {
        status: res.status,
      });
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
    cache: 'no-store', // Prevent browser caching for language-dependent responses
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
    let payload: unknown;
    try {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        payload = await res.json();
      } else {
        text = await res.text();
      }
    } catch {
      text = '';
    }

    const serverMessage = readServerMessage(payload, text || res.statusText);
    const message = mapStatusToMessage(res.status, serverMessage);
    const code =
      payload && typeof payload === 'object' && 'error' in payload
        ? String((payload as { error?: unknown }).error || '')
        : undefined;

    throw new ApiError(message, {
      status: res.status,
      code,
      details: payload,
      rawMessage: serverMessage,
    });
  }

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  if (isJson) {
    const data = (await res.json()) as T;
    return data;
  }

  return undefined as unknown as T;
}

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
  getUser: async (id: number) => {
    const data = await request<any>(`/users/${id}`);
    return data;
  },
  getUsers: async () => {
    const data = await request<any[]>('/users');
    return data;
  },
  createUser: async (data: { username: string; email: string; password: string }) => {
    const created = await request<any>('/users', { method: 'POST', body: JSON.stringify(data) });
    return created;
  },
  updateUser: async (id: number, data: { username?: string; email?: string; password?: string; oldPassword?: string; role?: string }) => {
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
  getProducts: async (language?: string, options?: { forceRefresh?: boolean }) => {
    const lang = normalizeLanguage(language || getCurrentLanguage());

    if (!options?.forceRefresh) {
      const cached = readProductsCache(lang);
      if (cached) {
        return cached;
      }
      const inFlight = productsInFlight.get(lang);
      if (inFlight) {
        return inFlight;
      }
    }

    const fetchPromise = (async () => {
      const data = await request<any[]>(`/products?lang=${lang}`);
      const normalized = Array.isArray(data) ? data : [];
      writeProductsCache(lang, normalized);
      return normalized;
    })();

    productsInFlight.set(lang, fetchPromise);
    try {
      return await fetchPromise;
    } finally {
      productsInFlight.delete(lang);
    }
  },
  getFeaturedShowcase: async (language?: string) => {
    const lang = normalizeLanguage(language || getCurrentLanguage());
    const data = await request<{ categories: Array<{ key: string; label: string; viewsCount: number; productCount: number }>; products: any[] }>(`/products/featured?lang=${lang}`);
    return data;
  },
  getProductById: async (id: number, language?: string) => {
    const lang = normalizeLanguage(language || getCurrentLanguage());
    const data = await request<any>(`/products/${id}?lang=${lang}`);
    return data;
  },
  createProduct: async (data: { name: string; description?: string; category: string; price: number; stock: number }) => {
    const created = await request<any>('/products', { method: 'POST', body: JSON.stringify(data) });
    clearProductsCache();
    return created;
  },
  uploadProductImage: async (id: number, file: File) => {
    const body = new FormData();
    body.append('file', file);
    const updated = await request<any>(`/products/${id}/image`, { method: 'POST', body });
    clearProductsCache();
    return updated;
  },
  deleteProduct: async (id: number) => {
    const res = await request<void>(`/products/${id}`, { method: 'DELETE' });
    clearProductsCache();
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
  getOrder: async (id: number) => {
    const data = await request<any>(`/orders/${id}`);
    return data;
  },
  createOrder: async (data: { 
    userId: number; 
    items: { productId: number; quantity: number }[];
    courier?: string;
    shippingAddress?: string;
    language?: 'hu' | 'en';
  }): Promise<{ id: number; userId: number; total: number; status: string; courier?: string; shippingAddress?: string; emailStatus?: { emailSent: boolean; reason?: string } }> => {
    const created = await request<{ id: number; userId: number; total: number; status: string; courier?: string; shippingAddress?: string; emailStatus?: { emailSent: boolean; reason?: string } }>('/orders', { method: 'POST', body: JSON.stringify(data) });
    return created;
  },
  deleteOrder: async (id: number) => {
    const res = await request<void>(`/orders/${id}`, { method: 'DELETE' });
    return res;
  },

  updateOrderStatus: async (id: number, status: string) => {
    const res = await request<any>(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      headers: { 'Content-Type': 'application/json' },
    });
    return res;
  },

  fulfillOrder: async (id: number, teljesitve: boolean = true) => {
    const res = await request<any>(`/orders/${id}/fulfill`, {
      method: 'PATCH',
      body: JSON.stringify({ teljesitve }),
      headers: { 'Content-Type': 'application/json' },
    });
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
    return Array.isArray(data) ? data.map(normalizeReview) : [];
  },
  getProductReviews: async (productId: number) => {
    const data = await request<any[]>(`/reviews/product/${productId}`);
    return Array.isArray(data) ? data.map(normalizeReview) : [];
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

