/**
 * Cliente HTTP Centralizado para comunicação com o Backend NestJS
 * 
 * Centraliza a URL base, injeção automática de tokens JWT no cabeçalho
 * e padronização do tratamento de respostas e erros.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

const TOKEN_KEY = '@YourFinances:token';
const USER_KEY = '@YourFinances:user';

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: () => {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  setAuth: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

/**
 * Função utilitária de requisição baseada em Fetch
 */
async function request(endpoint, options = {}) {
  const token = storage.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Resposta sem conteúdo (ex: 204 No Content do DELETE)
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Se o token expirou ou for inválido (401), podemos limpar a sessão
    if (response.status === 401 && !endpoint.startsWith('/auth')) {
      storage.clearAuth();
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    const errorMessage = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Ocorreu um erro ao processar a requisição.';

    throw new Error(errorMessage);
  }

  return data;
}

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options = {}) => request(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (endpoint, body, options = {}) => request(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  delete: (endpoint, options = {}) => request(endpoint, { method: 'DELETE', ...options }),
};

let lastPingTime = 0;
let ongoingPing = null;

export const healthService = {
  /**
   * Dispara um ping silencioso para acordar o servidor na nuvem (Render Free Tier).
   * Implementa deduplicação: se vários componentes chamarem ao mesmo tempo,
   * apenas uma requisição HTTP real é enviada, com intervalo mínimo de 30 segundos.
   */
  ping: () => {
    const now = Date.now();
    if (ongoingPing) return ongoingPing;
    if (now - lastPingTime < 30000) return Promise.resolve(null);

    lastPingTime = now;
    ongoingPing = api
      .get('/')
      .catch(() => null)
      .finally(() => {
        ongoingPing = null;
      });

    return ongoingPing;
  },
};

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const transactionService = {
  getAll: () => api.get('/transactions'),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data, headers = {}) => api.post('/transactions', data, { headers }),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
};

