const rawBaseUrl = import.meta.env.VITE_API_URL;
let BASE_URL = 'http://localhost:3000';
if (typeof rawBaseUrl === 'string' && rawBaseUrl.length > 0) {
  BASE_URL = rawBaseUrl;
}

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
let productsCache: any[] | null = null;
let productsCacheExpiresAt = 0;
let productsRequestInFlight: Promise<any[]> | null = null;

const PRODUCTS_CACHE_KEY = 'shophub_products_cache_v1';
const PRODUCTS_CACHE_TTL_MS = 60 * 1000;

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

const loadProductsFromStorage = () => {
  if (productsCache && Date.now() < productsCacheExpiresAt) {
    return productsCache;
  }
  try {
    const raw = localStorage.getItem(PRODUCTS_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as { data?: any[]; expiresAt?: number };
    if (!parsed || !Array.isArray(parsed.data) || typeof parsed.expiresAt !== 'number') {
      localStorage.removeItem(PRODUCTS_CACHE_KEY);
      return null;
    }
    if (Date.now() >= parsed.expiresAt) {
      localStorage.removeItem(PRODUCTS_CACHE_KEY);
      return null;
    }
    productsCache = parsed.data;
    productsCacheExpiresAt = parsed.expiresAt;
    return productsCache;
  } catch {
    localStorage.removeItem(PRODUCTS_CACHE_KEY);
    return null;
  }
};

const saveProductsToStorage = (data: any[]) => {
  productsCache = data;
  productsCacheExpiresAt = Date.now() + PRODUCTS_CACHE_TTL_MS;
  try {
    localStorage.setItem(
      PRODUCTS_CACHE_KEY,
      JSON.stringify({ data, expiresAt: productsCacheExpiresAt }),
    );
  } catch {
    // best effort cache
  }
};

const invalidateProductsCache = () => {
  productsCache = null;
  productsCacheExpiresAt = 0;
  productsRequestInFlight = null;
  localStorage.removeItem(PRODUCTS_CACHE_KEY);
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
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
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

  const url = `${BASE_URL}${path}`;
  const requestInit: RequestInit = {
    headers,
  };
  if (init) {
    Object.assign(requestInit, init);
  }

  const res = await fetch(url, requestInit);
  
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
    const inMemory = productsCache && Date.now() < productsCacheExpiresAt ? productsCache : null;
    if (inMemory) {
      return inMemory;
    }

    const fromStorage = loadProductsFromStorage();
    if (fromStorage) {
      return fromStorage;
    }

    if (!productsRequestInFlight) {
      productsRequestInFlight = request<any[]>('/products')
        .then((data) => {
          saveProductsToStorage(data);
          return data;
        })
        .finally(() => {
          productsRequestInFlight = null;
        });
    }

    return productsRequestInFlight;
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
