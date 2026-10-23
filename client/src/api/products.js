const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Groceries',
  'Stationery',
  'Home & Kitchen',
  'Other',
];

const request = async (url, options = {}) => {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
};

const buildQuery = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

const jsonHeaders = { 'Content-Type': 'application/json' };

export const fetchProducts = (filters) =>
  request(`${BASE_URL}/products${buildQuery(filters)}`);

export const fetchStats = () => request(`${BASE_URL}/products/stats`);

export const createProduct = (product) =>
  request(`${BASE_URL}/products`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(product),
  });

export const updateProduct = (id, product) =>
  request(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(product),
  });

export const deleteProduct = (id) =>
  request(`${BASE_URL}/products/${id}`, { method: 'DELETE' });
