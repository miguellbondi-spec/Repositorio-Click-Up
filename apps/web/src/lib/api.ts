import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const auth = localStorage.getItem('auth-storage');
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        const { accessToken, tenantId } = parsed.state || {};
        if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
        if (tenantId) config.headers['x-tenant-id'] = tenantId;
      } catch {}
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res.data?.data !== undefined ? res.data.data : res.data,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const auth = localStorage.getItem('auth-storage');
        if (auth) {
          const { refreshToken } = JSON.parse(auth).state || {};
          if (refreshToken) {
            const res = await axios.post(`${API_URL}/api/v1/auth/refresh`, { refreshToken });
            const data = res.data?.data || res.data;
            const stored = JSON.parse(localStorage.getItem('auth-storage') || '{}');
            stored.state = { ...stored.state, ...data };
            localStorage.setItem('auth-storage', JSON.stringify(stored));
            original.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(original);
          }
        }
      } catch {}
    }
    return Promise.reject(error);
  }
);
