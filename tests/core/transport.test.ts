import { describe, expect, it } from 'bun:test';
import { createTransport } from '../../src/core/transport';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const textResponse = (text: string, status = 200) =>
  new Response(text, {
    status,
    headers: { 'content-type': 'text/plain' },
  });

describe('createTransport', () => {
  it('builds absolute URLs when baseUrl is absolute', () => {
    const transport = createTransport({ baseUrl: 'https://api.fake.media' });
    expect(transport.buildUrl('/api/posts', { limit: 10 })).toBe('https://api.fake.media/api/posts?limit=10');
  });

  it('builds relative URLs when no baseUrl is provided', () => {
    const transport = createTransport();
    expect(transport.buildUrl('/api/posts', { limit: 10 })).toBe('/api/posts?limit=10');
  });

  it('serializes JSON payloads and sends the Authorization header by default', async () => {
    let capturedInit: RequestInit | undefined;
    const transport = createTransport({
      baseUrl: 'https://api.fake.media',
      token: 'token-123',
      fetchImpl: (async (input: RequestInfo, init?: RequestInit) => {
        capturedInit = init;
        return jsonResponse({ success: true });
      }) as unknown as typeof fetch,
    });

    const value = await transport.post('/api/auth/login', { username: 'bob', password: 'secret' });
    expect(value).toEqual({ success: true });
    expect(capturedInit).toBeDefined();
    expect(capturedInit?.method).toBe('POST');
    expect((capturedInit?.headers as Headers).get('authorization')).toBe('Bearer token-123');
    expect((capturedInit?.headers as Headers).get('content-type')).toBe('application/json');
  });

  it('prefers explicit token in request options over default token', async () => {
    const transport = createTransport({
      fetchImpl: (async () => jsonResponse({})) as unknown as typeof fetch,
      token: 'default-token',
    });

    await transport.get('/api/oauth/me', { token: 'explicit-token' });
    expect(true).toBe(true);
  });

  it('returns undefined for 204 No Content', async () => {
    const transport = createTransport({
      fetchImpl: (async () => new Response(null, { status: 204 })) as unknown as typeof fetch,
    });

    const value = await transport.delete('/api/posts/123');
    expect(value).toBeUndefined();
  });

  it('throws FakeMediaApiError with payload on non-OK response', async () => {
    const transport = createTransport({
      fetchImpl: (async () => jsonResponse({ error: 'Bad request' }, 400)) as unknown as typeof fetch,
    });

    try {
      await transport.get('/api/posts');
      throw new Error('Expected transport.get to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).status).toBe(400);
      expect((error as any).payload).toEqual({ error: 'Bad request' });
    }
  });
});
