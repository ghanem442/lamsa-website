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

    // ── Admin: Products ──
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

      try {
        const response = await fetch(`${API_BASE}/api/admin/products/upload-image`, {
          method: 'POST',
          headers,
          body: formData,
        });
        const data = await response.json();
        return { ok: response.ok, status: response.status, data };
      } catch (err) {
        console.warn('[API] Image upload error:', err);
        return { ok: false, status: 0, error: err };
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

      try {
        const response = await fetch(`${API_BASE}/api/admin/products/import-csv`, {
          method: 'POST',
          headers,
          body: formData,
        });
        const data = await response.json();
        return { ok: response.ok, status: response.status, data };
      } catch (err) {
        console.warn('[API] CSV import error:', err);
        return { ok: false, status: 0, error: err };
      }
    },

    async adminExportCSV() {
      const token = localStorage.getItem('lamsa_token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
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
          return { ok: true, status: 200, data: { success: true } };
        } else {
          return { ok: false, status: response.status, data: await response.json() };
        }
      } catch (err) {
        console.warn('[API] CSV export error:', err);
        return { ok: false, status: 0, error: err };
      }
    },

    async adminDownloadCSVTemplate() {
      const token = localStorage.getItem('lamsa_token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
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
          return { ok: true, status: 200, data: { success: true } };
        } else {
          return { ok: false, status: response.status, data: await response.json() };
        }
      } catch (err) {
        console.warn('[API] Template download error:', err);
        return { ok: false, status: 0, error: err };
      }
    },
  };

  window.LAMSA_API = api;
})(window);
