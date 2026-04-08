import { FakeMediaApiError } from '../errors';
import type { ApiErrorPayload, ClientOptions, QueryParams, RequestOptions } from '../types';
import { HttpMethod } from '../types';

export interface TransportLike {
  buildUrl(path: string, query?: QueryParams): string;
  request<T = unknown>(method: HttpMethod, path: string, options?: RequestOptions): Promise<T>;
  get<T = unknown>(path: string, options?: Omit<RequestOptions, 'body'>): Promise<T>;
  post<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>): Promise<T>;
  put<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>): Promise<T>;
  patch<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>): Promise<T>;
  delete<T = unknown>(path: string, options?: RequestOptions): Promise<T>;
  setToken(token: string | undefined): void;
}

function mergeHeaders(...sources: Array<HeadersInit | undefined>): Headers {
  const headers = new Headers();

  for (const source of sources) {
    if (!source) {
      continue;
    }

    new Headers(source).forEach((value, key) => {
      headers.set(key, value);
    });
  }

  return headers;
}

function isBodyInit(value: unknown): value is BodyInit {
  if (typeof value === 'string') {
    return true;
  }

  if (typeof FormData !== 'undefined' && value instanceof FormData) {
    return true;
  }

  if (typeof Blob !== 'undefined' && value instanceof Blob) {
    return true;
  }

  if (typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams) {
    return true;
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return true;
  }

  if (typeof ReadableStream !== 'undefined' && value instanceof ReadableStream) {
    return true;
  }

  return false;
}

function appendQuery(url: URL, query?: QueryParams): URL {
  if (!query) {
    return url;
  }

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        url.searchParams.append(key, String(item));
      }

      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url;
}

function joinPath(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function buildUrl(baseUrl: string, path: string, query?: QueryParams): string {
  if (/^https?:\/\//i.test(baseUrl)) {
    const url = new URL(joinPath(baseUrl, path));
    appendQuery(url, query);
    return url.toString();
  }

  const url = new URL(joinPath(baseUrl || 'http://fake-media-sdk.local', path), 'http://fake-media-sdk.local');
  appendQuery(url, query);
  return `${url.pathname}${url.search}`;
}

function parsePayload(body: string, contentType: string): unknown {
  if (!body) {
    return undefined;
  }

  if (contentType.includes('application/json')) {
    return JSON.parse(body);
  }

  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}

function extractMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const candidate = payload as ApiErrorPayload;

    if (typeof candidate.error === 'string' && candidate.error.length > 0) {
      return candidate.error;
    }

    if (typeof candidate.message === 'string' && candidate.message.length > 0) {
      return candidate.message;
    }
  }

  return fallback;
}

export function createTransport(options: ClientOptions = {}): TransportLike {
  let token = options.token;
  const baseUrl = options.baseUrl ?? '';
  const fetchImpl = options.fetchImpl ?? globalThis.fetch.bind(globalThis);
  const defaultHeaders = options.headers;
  const credentials = options.credentials ?? 'include';

  const request = async <T = unknown>(method: HttpMethod, path: string, requestOptions: RequestOptions = {}): Promise<T> => {
    const url = buildUrl(baseUrl, path, requestOptions.query);
    const headers = mergeHeaders(defaultHeaders, requestOptions.headers);
    const currentToken = requestOptions.token ?? token;

    if (currentToken && !headers.has('authorization')) {
      headers.set('authorization', `Bearer ${currentToken}`);
    }

    if (!headers.has('accept')) {
      headers.set('accept', 'application/json');
    }

    let body: BodyInit | undefined;
    if (requestOptions.body !== undefined) {
      if (isBodyInit(requestOptions.body)) {
        body = requestOptions.body;
      } else {
        if (!headers.has('content-type')) {
          headers.set('content-type', 'application/json');
        }

        body = JSON.stringify(requestOptions.body);
      }
    }

    const response = await fetchImpl(url, {
      method,
      headers,
      body,
      signal: requestOptions.signal,
      credentials,
    });

    const contentType = response.headers.get('content-type') ?? '';

    if (response.status === 204) {
      if (!response.ok) {
        throw new FakeMediaApiError(response.statusText || 'Request failed', response.status, {
          url,
          method,
        });
      }

      return undefined as T;
    }

    const rawText = await response.text();
    const payload = rawText.length > 0 ? parsePayload(rawText, contentType) : undefined;

    if (!response.ok) {
      throw new FakeMediaApiError(extractMessage(payload, response.statusText), response.status, {
        payload: payload as ApiErrorPayload | undefined,
        url,
        method,
      });
    }

    return payload as T;
  };

  return {
    buildUrl: (path: string, query?: QueryParams): string => buildUrl(baseUrl, path, query),

    setToken: (nextToken: string | undefined): void => {
      token = nextToken;
    },

    request,

    get: <T = unknown>(path: string, requestOptions: Omit<RequestOptions, 'body'> = {}): Promise<T> => request<T>(HttpMethod.GET, path, requestOptions),

    post: <T = unknown>(path: string, body?: unknown, requestOptions: Omit<RequestOptions, 'body'> = {}): Promise<T> => request<T>(HttpMethod.POST, path, { ...requestOptions, body }),

    put: <T = unknown>(path: string, body?: unknown, requestOptions: Omit<RequestOptions, 'body'> = {}): Promise<T> => request<T>(HttpMethod.PUT, path, { ...requestOptions, body }),

    patch: <T = unknown>(path: string, body?: unknown, requestOptions: Omit<RequestOptions, 'body'> = {}): Promise<T> => request<T>(HttpMethod.PATCH, path, { ...requestOptions, body }),

    delete: <T = unknown>(path: string, requestOptions: RequestOptions = {}): Promise<T> => request<T>(HttpMethod.DELETE, path, requestOptions),
  };
}
