import type { ApiErrorPayload } from "./types";

/**
 * Represents a structured HTTP error returned by the Fake Social API.
 *
 * This error wraps the server response status and any parsed payload, while
 * preserving the original request URL and method when available.
 *
 * @example
 * const error = new FakeMediaApiError(
 *   "Unauthorized",
 *   401,
 *   { url: "/api/auth/login", method: "POST" },
 * );
 */
export class FakeMediaApiError extends Error {
	readonly status: number;
	readonly payload?: ApiErrorPayload;
	readonly url?: string;
	readonly method?: string;

	/**
	 * @param message - The error message returned by the API or generated locally.
	 * @param status - HTTP status code associated with the failure.
	 * @param options - Optional metadata describing the request context.
	 */
	constructor(
		message: string,
		status: number,
		options?: { payload?: ApiErrorPayload; url?: string; method?: string },
	) {
		super(message);
		this.name = "FakeMediaApiError";
		this.status = status;
		this.payload = options?.payload;
		this.url = options?.url;
		this.method = options?.method;
	}
}

/**
 * Type guard that detects whether a value is a FakeMediaApiError.
 *
 * @param error - The value to inspect.
 * @returns True when the value is an instance of FakeMediaApiError.
 *
 * @example
 * if (isFakeMediaApiError(error)) {
 *   console.log(error.status, error.payload);
 * }
 */
export function isFakeMediaApiError(
	error: unknown,
): error is FakeMediaApiError {
	return error instanceof Error && error.name === "FakeMediaApiError";
}
