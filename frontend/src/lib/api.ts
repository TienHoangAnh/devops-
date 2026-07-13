const API_URL = import.meta.env.VITE_API_URL || '/api';

interface RequestOptions extends RequestInit {
  token?: string | null;
  skipRefresh?: boolean;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, setAccessToken, logout } = await import('@/stores').then((m) => ({
    refreshToken: m.useAuthStore.getState().refreshToken,
    setAccessToken: m.useAuthStore.getState().setAccessToken,
    logout: m.useAuthStore.getState().logout,
  }));

  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await response.json();
    if (!response.ok) {
      logout();
      return null;
    }
    setAccessToken(data.accessToken);
    return data.accessToken as string;
  } catch {
    logout();
    return null;
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, skipRefresh, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401 && token && !skipRefresh) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request<T>(endpoint, { ...options, token: newToken, skipRefresh: true });
    }
  }

  if (!response.ok) {
    throw new ApiError(data.error || 'Request failed', response.status);
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string, token?: string | null) =>
    request<T>(endpoint, { method: 'GET', token }),

  post: <T>(endpoint: string, body: unknown, token?: string | null) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), token }),

  put: <T>(endpoint: string, body: unknown, token?: string | null) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), token }),

  patch: <T>(endpoint: string, body: unknown, token?: string | null) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body), token }),

  delete: <T>(endpoint: string, token?: string | null) =>
    request<T>(endpoint, { method: 'DELETE', token }),
};

export { ApiError };
