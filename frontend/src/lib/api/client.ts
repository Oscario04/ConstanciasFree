import type { LoginResponse } from '../../types/domain';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

export class ApiError extends Error {
  status: number;
  detail: unknown;

  constructor(status: number, detail: unknown) {
    super(typeof detail === 'string' ? detail : 'Error de API');
    this.status = status;
    this.detail = detail;
  }
}

let token: string | null = localStorage.getItem('constancias_token');

export function getToken() {
  return token;
}

export function setToken(nextToken: string | null) {
  token = nextToken;
  if (nextToken) localStorage.setItem('constancias_token', nextToken);
  else localStorage.removeItem('constancias_token');
}

export function authHeaders() {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  const body = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    if (response.status === 401) setToken(null);
    throw new ApiError(response.status, body?.detail ?? body);
  }

  return body as T;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body && !(init.body instanceof FormData) && !(init.body instanceof URLSearchParams)) {
    headers.set('Content-Type', 'application/json');
  }
  Object.entries(authHeaders()).forEach(([key, value]) => headers.set(key, value));

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  return parseResponse<T>(response);
}

export function pdfUrl(code: string) {
  return `${API_BASE_URL}/api/documents/pdf/${code}`;
}

export function csvUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export function storeLoginSession(response: LoginResponse) {
  setToken(response.access_token);
  localStorage.setItem('constancias_user', JSON.stringify(response.user));
}

export function clearLoginSession() {
  setToken(null);
  localStorage.removeItem('constancias_user');
}

