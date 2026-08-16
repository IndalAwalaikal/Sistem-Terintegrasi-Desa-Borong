import { useAuthStore } from '@/store/authStore';

type ApiEnvelope<T> = { data: T };
type ApiErrorEnvelope = { error?: { code?: string; message?: string } };

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiRequestInit = Omit<RequestInit, 'body'> & {
  auth?: boolean;
  body?: BodyInit | object;
  retryOnUnauthorized?: boolean;
  token?: string | null;
};

type RefreshResponse = { accessToken: string; refreshToken: string };

let refreshPromise: Promise<string | null> | null = null;

function apiBaseUrl(): string {
  if (typeof window === 'undefined') {
    const internal = process.env.API_INTERNAL_URL;
    if (!internal) {
      throw new Error('API_INTERNAL_URL wajib diatur untuk request server-side.');
    }
    return `${internal.replace(/\/$/, '')}/api`;
  }
  return (process.env.NEXT_PUBLIC_API_BASE_URL || '/api').replace(/\/$/, '');
}

function buildBody(body: ApiRequestInit['body'], headers: Headers): BodyInit | undefined {
  if (body === undefined) return undefined;
  if (body instanceof FormData || typeof body === 'string' || body instanceof Blob || body instanceof URLSearchParams) {
    return body;
  }
  headers.set('Content-Type', 'application/json');
  return JSON.stringify(body);
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> & ApiErrorEnvelope;
  if (!response.ok) {
    throw new ApiError(payload?.error?.message || 'Permintaan ke server gagal.', response.status, payload?.error?.code);
  }
  return payload.data;
}

async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const { refreshToken, setTokens, logout } = useAuthStore.getState();
    if (!refreshToken) return null;
    try {
      const response = await fetch(`${apiBaseUrl()}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        cache: 'no-store',
      });
      const data = await parseResponse<RefreshResponse>(response);
      setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch {
      logout();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

export async function apiRequest<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const { auth = false, retryOnUnauthorized = true, token, body, headers: initialHeaders, ...requestInit } = init;
  const headers = new Headers(initialHeaders);
  headers.set('Accept', 'application/json');
  const accessToken = token ?? (auth && typeof window !== 'undefined' ? useAuthStore.getState().token : null);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...requestInit,
    headers,
    body: buildBody(body, headers),
    cache: 'no-store',
  });

  if (response.status === 401 && auth && retryOnUnauthorized) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      return apiRequest<T>(path, { ...init, token: refreshedToken, retryOnUnauthorized: false });
    }
  }
  return parseResponse<T>(response);
}

/**
 * apiBlob mem-fetch berkas biner (PDF/gambar) dengan membawa token autentikasi,
 * dipakai untuk mengunduh/menampilkan lampiran privat dari endpoint ber-auth.
 * Berbeda dengan apiRequest (yang mem-parsing envelope JSON), fungsi ini
 * mengembalikan Blob yang bisa diubah menjadi object URL untuk pratinjau.
 */
export async function apiBlob(
  path: string,
  init: { token?: string | null } = {},
): Promise<Blob> {
  const headers = new Headers({
    Accept: 'application/pdf, image/*, application/octet-stream',
  });
  const accessToken =
    init.token ?? (typeof window !== 'undefined' ? useAuthStore.getState().token : null);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(`${apiBaseUrl()}${path}`, {
    headers,
    cache: 'no-store',
  });

  if (response.status === 401 && accessToken) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) return apiBlob(path, { token: refreshedToken });
  }
  if (!response.ok) {
    throw new ApiError('Gagal memuat berkas dari server.', response.status);
  }
  return response.blob();
}

export function query(params: Record<string, string | number | undefined>): string {
  const value = new URLSearchParams();
  for (const [key, item] of Object.entries(params)) {
    if (item !== undefined && item !== '') value.set(key, String(item));
  }
  const encoded = value.toString();
  return encoded ? `?${encoded}` : '';
}
