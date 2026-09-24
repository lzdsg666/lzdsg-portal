import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

globalThis.LZDSG_CONFIG = { apiBaseUrl: 'https://api.test.invalid/' };
const api = await import('../api.js');
const originalFetch = globalThis.fetch;
const originalStorage = globalThis.localStorage;

const makeStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key)
  };
};

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalStorage === undefined) delete globalThis.localStorage;
  else globalThis.localStorage = originalStorage;
  api.clearToken();
});

test('request uses configured API, no-store, omitted cookies and bearer auth', async () => {
  globalThis.localStorage = makeStorage();
  api.saveToken('opaque-session-token');
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.test.invalid/api/v1/auth/me');
    assert.equal(options.cache, 'no-store');
    assert.equal(options.credentials, 'omit');
    assert.equal(options.headers.authorization, 'Bearer opaque-session-token');
    return new Response(JSON.stringify({ user: { username: 'demo' } }), { status: 200 });
  };
  const result = await api.request('/api/v1/auth/me');
  assert.equal(result.user.username, 'demo');
});

test('token persists and a 401 clears it without leaking response text', async () => {
  globalThis.localStorage = makeStorage();
  api.saveToken('stale-token');
  globalThis.fetch = async () => new Response(JSON.stringify({ error: { code: 'UNAUTHORIZED', message: 'authentication required' } }), { status: 401 });
  await assert.rejects(api.request('/api/v1/auth/me'), (error) => {
    assert.equal(error.status, 401);
    assert.equal(error.code, 'UNAUTHORIZED');
    assert.equal(api.getToken(), null);
    assert.equal(error.message.includes('token'), false);
    return true;
  });
});

test('403, 429 Retry-After and server failures remain typed for safe UI messages', async () => {
  const responses = [
    new Response('{}', { status: 403 }),
    new Response('{}', { status: 429, headers: { 'retry-after': '17' } }),
    new Response('{}', { status: 503 })
  ];
  globalThis.fetch = async () => responses.shift();
  for (const expected of [{ status: 403 }, { status: 429, retryAfter: '17' }, { status: 503 }]) {
    await assert.rejects(api.request('/api/v1/auth/me'), (error) => {
      assert.equal(error.status, expected.status);
      if (expected.retryAfter) assert.equal(error.retryAfter, expected.retryAfter);
      return true;
    });
  }
  assert.equal(api.safeErrorMessage(new api.ApiError(401, 'INVALID_CREDENTIALS')), '邮箱或密码不正确，请重试。');
  assert.equal(api.safeErrorMessage(new api.ApiError(403, 'FORBIDDEN')), '当前账号没有执行此操作的权限。');
  assert.equal(api.safeErrorMessage(new api.ApiError(429, 'RATE_LIMITED', '17')), '操作过于频繁，请在 17 秒后重试。');
  assert.equal(api.safeErrorMessage(new api.ApiError(503, 'INTERNAL_ERROR')), '服务暂时不可用，请稍后重试。');
  assert.equal(api.safeErrorMessage(new Error('database password leaked')), '请求未能完成，请稍后重试。');
});
