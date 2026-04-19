import { OAuthRoute } from "../constants/routes";
import type { TransportLike } from "../core/transport";
import type {
	OAuthApplicationInput,
	OAuthAuthorizeInput,
	OAuthTokenInput,
} from "../types";

/**
 * Builds the OAuth API helpers for the Fake Social SDK.
 *
 * @param transport - Transport instance used for OAuth requests.
 * @returns OAuth helper methods.
 */
export function createOAuthApi(transport: TransportLike) {
	return {
		/**
		 * Exchanges an authorization code for an access token.
		 *
		 * @template T
		 * @param input - OAuth token request payload.
		 * @returns A promise resolving to token response data.
		 */
		token: <T = unknown>(input: OAuthTokenInput) =>
			transport.post<T>(OAuthRoute.Token, input),

		/**
		 * Revokes an OAuth token.
		 *
		 * @template T
		 * @param input - Token revocation payload.
		 * @returns A promise resolving to the revocation status.
		 */
		revoke: <T = unknown>(input: Record<string, unknown>) =>
			transport.post<T>(OAuthRoute.Revoke, input),

		/**
		 * Retrieves information about the currently authorized OAuth user.
		 *
		 * @template T
		 * @param accessToken - Optional access token override.
		 * @returns A promise resolving to the user information.
		 */
		me: <T = unknown>(accessToken?: string) =>
			transport.get<T>(OAuthRoute.Me, { token: accessToken }),

		/**
		 * Builds an OAuth authorization URL with query parameters.
		 *
		 * @param input - Authorization request parameters.
		 * @returns A fully encoded authorization URL.
		 */
		buildAuthorizeUrl: (input: OAuthAuthorizeInput) =>
			transport.buildUrl(OAuthRoute.Authorize, input),

		applications: {
			/**
			 * Lists registered OAuth applications.
			 *
			 * @template T
			 * @returns A promise resolving to the list of applications.
			 */
			list: <T = unknown>() => transport.get<T>(OAuthRoute.Applications),

			/**
			 * Creates a new OAuth application.
			 *
			 * @template T
			 * @param input - Application metadata.
			 * @returns A promise resolving to the created application.
			 */
			create: <T = unknown>(input: OAuthApplicationInput) =>
				transport.post<T>(OAuthRoute.Applications, input),

			/**
			 * Updates an existing OAuth application by client ID.
			 *
			 * @template T
			 * @param clientId - Identifier for the OAuth application.
			 * @param input - Updated application metadata.
			 * @returns A promise resolving to the updated application.
			 */
			update: <T = unknown>(clientId: string, input: OAuthApplicationInput) =>
				transport.put<T>(
					`${OAuthRoute.Applications}/${encodeURIComponent(clientId)}`,
					input,
				),

			/**
			 * Deletes an OAuth application by client ID.
			 *
			 * @template T
			 * @param clientId - Identifier for the OAuth application.
			 * @returns A promise resolving when the application is deleted.
			 */
			delete: <T = unknown>(clientId: string) =>
				transport.delete<T>(
					`${OAuthRoute.Applications}/${encodeURIComponent(clientId)}`,
				),
		},
	};
}
