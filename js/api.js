/**
 * LAMSA API Client Wrapper (Vanilla JS)
 * Handles API calls to backend endpoints with fallback safety
 */
(function (window) {
  'use strict';

  // API Base URL (empty string means same-origin e.g. http://localhost:3000)
  const API_BASE = '';

  async function request(endpoint, options = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('lamsa_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      const data = await response.json();
      
      // Treat any 2xx status as success
      if (response.ok) {
        return data; // Return data directly on success
      } else {
        // For error responses, throw the error message from server
        throw new Error(data.message || `HTTP ${response.status}`);
      }
    } catch (err) {
      // Network errors or JSON parse errors
      if (err.message && err.message !== 'Failed to fetch') {
        throw err; // Re-throw server error messages
      }
      console.warn(`[API] Network error requesting ${endpoint}:`, err);
      throw new Error('فشل الاتصال بالسيرفر. يرجى التحقق من الاتصال بالإنترنت.');
    }
  }

  const api = {
    // â”€â”€ Authentication â”€â”€
    async register(userData) {
      return await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },

    async login(credentials) {
      return await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },

    async getMe() {
      return await request('/api/auth/me');
    },

    // â”€â”€ Products â”€â”€
    async getProducts(params = {}) {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'all') query.set('category', params.category);
      if (params.subCategory && params.subCategory !== 'all') query.set('subCategory', params.subCategory);
      if (params.search) query.set('search', params.search);
      if (params.sort) query.set('sort', params.sort);
      if (params.page) query.set('page', params.page);
      if (params.limit) query.set('limit', params.limit);

      const qs = query.toString() ? `?${query.toString()}` : '';
      return await request(`/api/products${qs}`);
    },

    async getFeaturedProducts(limit = 6) {
      return await request(`/api/products/featured?limit=${limit}`);
    },

    async getRecommendationPool() {
      return await request('/api/products/recommendation-pool');
    },

    async getProduct(id) {
      return await request(`/api/products/${id}`);
    },

    // â”€â”€ Health â”€â”€
    async checkHealth() {
      return await request('/api/health');
    },

    // â”€â”€ Admin: Products â”€â”€
    async adminGetProducts(params = {}) {
      const query = new URLSearchParams();
      if (params.page) query.set('page', params.page);
      if (params.limit) query.set('limit', params.limit);
      if (params.category) query.set('category', params.category);
      if (params.search) query.set('search', params.search);

      const qs = query.toString() ? `?${query.toString()}` : '';
      return await request(`/api/admin/products${qs}`);
    },

    async adminCreateProduct(productData) {
      return await request('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    },

    async adminUpdateProduct(id, productData) {
      return await request(`/api/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
    },

    async adminDeleteProduct(id) {
      return await request(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
    },

    async adminUploadImage(file) {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('lamsa_token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}/api/admin/products/upload-image`, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return data; // Return data directly on success
      } else {
        throw new Error(data.message || `فشل رفع الصورة`);
      }
    },

    async adminImportCSV(file) {
      const formData = new FormData();
      formData.append('csv', file);

      const token = localStorage.getItem('lamsa_token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}/api/admin/products/import-csv`, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return data; // Return data directly on success
      } else {
        throw new Error(data.message || 'فشل استيراد الملف');
      }
    },

    async adminExportCSV() {
      const token = localStorage.getItem('lamsa_token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}/api/admin/products/export-csv`, {
        method: 'GET',
        headers,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lamsa-products.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        return;
      } else {
        const data = await response.json();
        throw new Error(data.message || 'فشل تصدير المنتجات');
      }
    },

    async adminDownloadCSVTemplate() {
      const token = localStorage.getItem('lamsa_token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}/api/admin/products/csv-template`, {
        method: 'GET',
        headers,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lamsa-products-template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        return;
      } else {
        const data = await response.json();
        throw new Error(data.message || 'فشل تنزيل القالب');
      }
    },

    // ══════════════════════════════════════════════════
    // ORDERS
    // ══════════════════════════════════════════════════
    
    async createOrder(orderData) {
      return await request('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
    },

    async getOrder(orderId) {
      return await request(`/api/orders/${orderId}`);
    },

    async getOrderByNumberAndPhone(orderNumber, phone) {
      return await request(`/api/orders/lookup?orderNumber=${orderNumber}&phone=${phone}`);
    },

    // ══════════════════════════════════════════════════
    // ADMIN ORDERS
    // ══════════════════════════════════════════════════
    
    async adminGetOrders(params = {}) {
      const query = new URLSearchParams(params).toString();
      return await request(`/api/admin/orders${query ? '?' + query : ''}`, {
        cache: 'no-store' // Force fresh data, never use browser cache
      });
    },

    async adminGetOrder(orderId) {
      return await request(`/api/admin/orders/${orderId}`, {
        cache: 'no-store'
      });
    },

    async adminUpdateOrderStatus(orderId, status) {
      return await request(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        cache: 'no-store'
      });
    },

    async adminGetOrdersStats() {
      return await request('/api/admin/orders/stats', {
        cache: 'no-store'
      });
    },

    // ══════════════════════════════════════════════════
    // SETTINGS
    // ══════════════════════════════════════════════════
    
    async getPerfumePrices() {
      return await request('/api/settings/perfume-prices');
    },

    async adminUpdatePerfumePrices(prices) {
      return await request('/api/settings/perfume-prices', {
        method: 'PUT',
        body: JSON.stringify({ prices })
      });
    },

    // ══════════════════════════════════════════════════
    // CONTACT
    // ══════════════════════════════════════════════════
    
    async submitContactMessage(messageData) {
      return await request('/api/contact', {
        method: 'POST',
        body: JSON.stringify(messageData)
      });
    },

    // ══════════════════════════════════════════════════
    // ADMIN MESSAGES
    // ══════════════════════════════════════════════════
    
    async adminGetMessages(params = {}) {
      const query = new URLSearchParams(params).toString();
      return await request(`/api/admin/messages${query ? '?' + query : ''}`, {
        cache: 'no-store'
      });
    },

    async adminUpdateMessageReadStatus(messageId, isRead) {
      return await request(`/api/admin/messages/${messageId}/read`, {
        method: 'PATCH',
        body: JSON.stringify({ isRead }),
        cache: 'no-store'
      });
    },

    async adminGetMessagesStats() {
      return await request('/api/admin/messages/stats', {
        cache: 'no-store'
      });
    },
  };

  window.LAMSA_API = api;
})(window);

