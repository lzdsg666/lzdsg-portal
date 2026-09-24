const TOKEN_KEY = 'lzdsg-session-token';
const configuredBase = globalThis.LZDSG_CONFIG?.apiBaseUrl;
const API_BASE = (() => {
  if (typeof configuredBase !== 'string') return '';
  try {
    const endpoint = new URL(configuredBase);
    if (endpoint.protocol !== 'https:') return '';
    return `${endpoint.origin}${endpoint.pathname.replace(/\/$/, '')}`;
  } catch {
    return '';
  }
})();
let memoryToken = null;
let memoryTokenSet = false;

export class ApiError extends Error {
  constructor(status, code, retryAfter = null) {
    super('API request failed');
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

export const getToken = () => {
  if (memoryTokenSet) return memoryToken;
  try {
    return globalThis.localStorage?.getItem(TOKEN_KEY) || null;
  } catch {
    return memoryToken;
  }
};

export const saveToken = (token) => {
  memoryToken = token;
  memoryTokenSet = true;
  try {
    globalThis.localStorage?.setItem(TOKEN_KEY, token);
  } catch {
    // Keep this tab usable if browser storage is disabled or full.
  }
};

export const clearToken = () => {
  memoryToken = null;
  memoryTokenSet = true;
  try {
    globalThis.localStorage?.removeItem(TOKEN_KEY);
  } catch {
    // The in-memory copy is still cleared.
  }
};

export const request = async (path, { method = 'GET', body, token = getToken() } = {}) => {
  if (!API_BASE) throw new Error('API endpoint is not configured');
  const headers = { accept: 'application/json' };
  if (body !== undefined) headers['content-type'] = 'application/json';
  if (token) headers.authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
      credentials: 'omit',
      signal: AbortSignal.timeout(10_000)
    });
  } catch {
    throw new Error('无法连接 API，请检查网络后重试。');
  }

  if (response.status === 204) return null;
  let payload = {};
  try {
    payload = await response.json();
  } catch {
    // Use status-based messages for empty or malformed error responses.
  }
  if (!response.ok) {
    const code = payload?.error?.code || 'REQUEST_FAILED';
    if (response.status === 401) clearToken();
    throw new ApiError(response.status, code, response.headers.get('retry-after'));
  }
  return payload;
};

export const getApiBaseUrl = () => API_BASE;
