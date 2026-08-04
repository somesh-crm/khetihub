const BASE = '/api';

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

const qs = (obj) => {
  const p = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p.set(k, v);
  });
  const s = p.toString();
  return s ? `?${s}` : '';
};

export const api = {
  get,
  post,
  qs,
  brands: () => get('/brands'),
  brand: (slug) => get(`/brands/${slug}`),
  tractors: (filters = {}) => get(`/tractors${qs(filters)}`),
  tractor: (slug) => get(`/tractors/${slug}`),
  implementCategories: () => get('/implements/categories'),
  implements: (category) => get(`/implements${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  implement: (slug) => get(`/implements/${slug}`),
  used: (filters = {}) => get(`/used${qs(filters)}`),
  usedListing: (id) => get(`/used/${id}`),
  news: () => get('/news'),
  article: (slug) => get(`/news/${slug}`),
  videos: () => get('/videos'),
  dealers: (filters = {}) => get(`/dealers${qs(filters)}`),
  states: () => get('/states'),
  emi: (amount, tenure, rate) => get(`/emi?amount=${amount}&tenure=${tenure}&rate=${rate}`),
  submitSellRequest: (data) => post('/sell-requests', data),
  submitLead: (data) => post('/leads', data)
};

export const admin = {
  dashboard: () => get('/admin/dashboard'),
  list: (table) => get(`/admin/${table}`),
  create: (table, data) => post(`/admin/${table}`, data),
  update: (table, id, data) => fetch(`${BASE}/admin/${table}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then((r) => r.json()),
  remove: (table, id) => fetch(`${BASE}/admin/${table}/${id}`, { method: 'DELETE' }).then((r) => r.json()),
  sellRequests: () => get('/admin/sell-requests'),
  updateSellStatus: (id, status) => fetch(`${BASE}/admin/sell-requests/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).then((r) => r.json()),
  leads: () => get('/admin/leads'),
  removeLead: (id) => fetch(`${BASE}/admin/leads/${id}`, { method: 'DELETE' }).then((r) => r.json())
};

export const formatPrice = (n) => {
  if (!n) return '₹ 0';
  return '₹ ' + Number(n).toLocaleString('en-IN');
};

export const formatViews = (n) => {
  if (n >= 100000) return (n / 100000).toFixed(1) + ' Lakh';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
};

export const formatDate = (d) => {
  const dt = new Date(d + 'T00:00:00');
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};
