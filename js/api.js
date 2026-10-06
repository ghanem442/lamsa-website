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
      return { ok: response.ok, status: response.status, data };
    } catch (err) {
      console.warn(`[API] Network error requesting ${endpoint}:`, err);
      return { ok: false, status: 0, error: err };
    }
  }

  const api = {
    // ── Authentication ──
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

    // ── Products ──
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

    async getProduct(id) {
      return await request(`/api/products/${id}`);
    },

    // ── Health ──
    async checkHealth() {
      return await request('/api/health');
    },
  };

  window.LAMSA_API = api;
})(window);
