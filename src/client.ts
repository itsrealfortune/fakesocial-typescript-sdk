import { createTransport } from "./core/transport";
import { createAuthApi } from "./modules/auth";
import { createContentApi } from "./modules/content";
import { createModerationApi } from "./modules/moderation";
import { createOAuthApi } from "./modules/oauth";
import { createUsersApi } from "./modules/users";
import type { ClientOptions, QueryParams } from "./types";

/**
 * High-level client for interacting with the Fake Social API.
 *
 * The client exposes auth, OAuth, user, content, moderation and platform methods
 * through strongly typed helper objects.
 */
export class FakeMediaClient {
	readonly auth;
	readonly oauth;
	readonly users;
	readonly me;
	readonly posts;
	readonly conversations;
	readonly notifications;
	readonly achievements;
	readonly reports;
	readonly appeals;
	readonly admin;
	readonly platform;

	private readonly transport;
	private readonly options: ClientOptions;

	/**
	 * @param options - Optional client configuration, including base URL and token.
	 * @example
	 * const client = new FakeMediaClient({ token: "abc123" });
	 */
	constructor(options: ClientOptions = {}) {
		this.options = options;
		this.transport = createTransport(options);

		this.auth = createAuthApi(this.transport);
		this.oauth = createOAuthApi(this.transport);

		const usersApi = createUsersApi(this.transport);
		this.users = usersApi;
		this.me = usersApi.me;

		const contentApi = createContentApi(this.transport);
		this.posts = contentApi.posts;
		this.conversations = contentApi.conversations;
		this.notifications = contentApi.notifications;
		this.achievements = contentApi.achievements;
		this.platform = contentApi.platform;

		const moderationApi = createModerationApi(this.transport);
		this.reports = moderationApi.reports;
		this.appeals = moderationApi.appeals;
		this.admin = moderationApi.admin;
	}

	/**
	 * Returns a new FakeMediaClient instance configured with the provided token.
	 *
	 * @param token - Bearer token used for subsequent requests.
	 * @returns A cloned client instance with the updated token.
	 *
	 * @example
	 * const authenticatedClient = client.withToken("abc123");
	 */
	withToken(token: string | undefined): FakeMediaClient {
		return new FakeMediaClient({
			...this.options,
			token,
		});
	}

	/**
	 * Sets the authorization token on the current client instance.
	 *
	 * @param token - Bearer token used for future requests.
	 * @returns The current client instance.
	 */
	setToken(token: string | undefined): this {
		this.transport.setToken(token);
		return this;
	}

	/**
	 * Builds a fully-qualified URL from a route path and optional query params.
	 *
	 * @param path - Endpoint path or route string.
	 * @param query - Optional parameters appended to the query string.
	 * @returns A normalized URL string.
	 */
	buildUrl(path: string, query?: QueryParams): string {
		return this.transport.buildUrl(path, query);
	}

	/**
	 * Performs a raw transport request using the configured client.
	 *
	 * @template T
	 * @param method - HTTP method to use.
	 * @param path - Path or route to request.
	 * @param options - Optional request configuration.
	 * @returns A promise resolving to the parsed response payload.
	 */
	request<T = unknown>(
		method: Parameters<typeof this.transport.request>[0],
		path: string,
		options?: Parameters<typeof this.transport.request>[2],
	) {
		return this.transport.request<T>(method, path, options);
	}

	/**
	 * Performs a GET request.
	 *
	 * @template T
	 * @param path - API route path.
	 * @param options - Optional request settings.
	 * @returns A promise resolving to the parsed response payload.
	 */
	get<T = unknown>(
		path: string,
		options?: Parameters<typeof this.transport.get>[1],
	) {
		return this.transport.get<T>(path, options);
	}

	/**
	 * Performs a POST request.
	 *
	 * @template T
	 * @param path - API route path.
	 * @param body - Request body payload.
	 * @param options - Optional request settings.
	 * @returns A promise resolving to the parsed response payload.
	 */
	post<T = unknown>(
		path: string,
		body?: unknown,
		options?: Parameters<typeof this.transport.post>[2],
	) {
		return this.transport.post<T>(path, body, options);
	}

	/**
	 * Performs a PUT request.
	 *
	 * @template T
	 * @param path - API route path.
	 * @param body - Request body payload.
	 * @param options - Optional request settings.
	 * @returns A promise resolving to the parsed response payload.
	 */
	put<T = unknown>(
		path: string,
		body?: unknown,
		options?: Parameters<typeof this.transport.put>[2],
	) {
		return this.transport.put<T>(path, body, options);
	}

	/**
	 * Performs a PATCH request.
	 *
	 * @template T
	 * @param path - API route path.
	 * @param body - Request body payload.
	 * @param options - Optional request settings.
	 * @returns A promise resolving to the parsed response payload.
	 */
	patch<T = unknown>(
		path: string,
		body?: unknown,
		options?: Parameters<typeof this.transport.patch>[2],
	) {
		return this.transport.patch<T>(path, body, options);
	}

	/**
	 * Performs a DELETE request.
	 *
	 * @template T
	 * @param path - API route path.
	 * @param options - Optional request settings.
	 * @returns A promise resolving to the parsed response payload.
	 */
	delete<T = unknown>(
		path: string,
		options?: Parameters<typeof this.transport.delete>[1],
	) {
		return this.transport.delete<T>(path, options);
	}
}

/**
 * Creates a new FakeMediaClient instance.
 *
 * @param options - Client options used for initialization.
 * @returns A configured FakeMediaClient.
 *
 * @example
 * const client = createFakeMediaClient({ baseUrl: "https://api.fakesocial.fr" });
 */
export function createFakeMediaClient(
	options: ClientOptions = {},
): FakeMediaClient {
	return new FakeMediaClient(options);
}
