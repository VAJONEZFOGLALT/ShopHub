const rawBaseUrl = import.meta.env.VITE_API_URL;
let BASE_URL = 'http://localhost:3000';
if (typeof rawBaseUrl === 'string' && rawBaseUrl.length > 0) {
  BASE_URL = rawBaseUrl;
}

let authToken = '';
const storedToken = localStorage.getItem('authToken');
if (storedToken) {
  authToken = storedToken;
}

async function request<T>(path: string, init?: RequestInit) {
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
    const res = await request<{ id: number; email: string; username: string; name: string; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    authToken = res.token;
    localStorage.setItem('authToken', res.token);
    return res;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await request<{ id: number; email: string; username: string; name: string; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    authToken = res.token;
    localStorage.setItem('authToken', res.token);
    return res;
  },

  logout: () => {
    authToken = '';
    localStorage.removeItem('authToken');
  },

  setToken: (token: string) => {
    authToken = token;
    localStorage.setItem('authToken', token);
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
  deleteUser: async (id: number) => {
    const res = await request<void>(`/users/${id}`, { method: 'DELETE' });
    return res;
  },

  // Products
  getProducts: async () => {
    const data = await request<any[]>('/products');
    return data;
  },
  createProduct: async (data: { name: string; description?: string; category: string; price: number; stock: number }) => {
    const created = await request<any>('/products', { method: 'POST', body: JSON.stringify(data) });
    return created;
  },
  uploadProductImage: async (id: number, file: File) => {
    const body = new FormData();
    body.append('file', file);
    const updated = await request<any>(`/products/${id}/image`, { method: 'POST', body });
    return updated;
  },
  deleteProduct: async (id: number) => {
    const res = await request<void>(`/products/${id}`, { method: 'DELETE' });
    return res;
  },

  // Orders
  getOrders: async () => {
    const data = await request<any[]>('/orders');
    return data;
  },
  createOrder: async (data: { userId: number; items: { productId: number; quantity: number }[] }) => {
    const created = await request<any>('/orders', { method: 'POST', body: JSON.stringify(data) });
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
  createReview: async (data: { userId: number; productId: number; rating: number; comment?: string }) => {
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
  isInWishlist: async (userId: number, productId: number) => {
    const exists = await request<boolean>(`/wishlist/check/${userId}/${productId}`);
    return exists;
  },
};

export type ApiError = Error;
