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
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

// Endpoints agrupados por domínio
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
};

export const transactionService = {
  getAll: () => api.get('/transactions'),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
};
