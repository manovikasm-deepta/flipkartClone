import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fk_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fk_token');
      localStorage.removeItem('fk_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ─── Service objects ──────────────────────────────────────────────────────────

export const authService = {
  register:       (data)  => api.post('/auth/register', data),
  login:          (data)  => api.post('/auth/login', data),
  getMe:          ()      => api.get('/auth/me'),
  getDefaultUser: ()      => api.get('/auth/default-user'),
};

export const productService = {
  list:        (params) => api.get('/products', { params }),
  getFeatured: ()       => api.get('/products/featured'),
  getById:     (id)     => api.get(`/products/${id}`),
};

export const categoryService = {
  getAll: () => api.get('/categories'),
};

export const cartService = {
  getCart:    ()                       => api.get('/cart'),
  addToCart:  ({ productId, quantity = 1 }) => api.post('/cart', { productId, quantity }),
  updateItem: (itemId, { quantity })   => api.patch(`/cart/${itemId}`, { quantity }),
  removeItem: (itemId)                 => api.delete(`/cart/${itemId}`),
  clearCart:  ()                       => api.delete('/cart'),
};

export const orderService = {
  getOrders:    ()                               => api.get('/orders'),
  placeOrder:   ({ addressId, paymentMethod, buyNowItem }) => api.post('/orders', { addressId, paymentMethod, buyNowItem }),
  getOrderById: (id)                             => api.get(`/orders/${id}`),
};

export const addressService = {
  getAddresses:  ()        => api.get('/addresses'),
  addAddress:    (data)    => api.post('/addresses', data),
  updateAddress: (id, data)=> api.patch(`/addresses/${id}`, data),
  deleteAddress: (id)      => api.delete(`/addresses/${id}`),
  setDefault:    (id)      => api.patch(`/addresses/${id}/default`),
};

export const wishlistService = {
  getWishlist:        ()          => api.get('/wishlist'),
  getWishlistIds:     ()          => api.get('/wishlist/ids'),
  addToWishlist:      (productId) => api.post('/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
};

export default api;
