import type { TransportLike } from "../core/transport";
import type { QueryParams, UserUpdateInput } from "../types";

/**
 * Builds the user API helper object.
 *
 * @param transport - Transport instance used for user requests.
 * @returns User helper methods.
 */
export function createUsersApi(transport: TransportLike) {
	return {
		/**
		 * Lists users with optional query filters.
		 *
		 * @template T
		 * @param query - Optional query parameters.
		 * @returns A promise resolving to the user list.
		 */
		list: <T = unknown>(query?: QueryParams) =>
			transport.get<T>("/api/users", { query }),

		/**
		 * Follows a user by ID.
		 *
		 * @template T
		 * @param userId - Identifier of the user to follow.
		 * @returns A promise resolving to the follow result.
		 */
		follow: <T = unknown>(userId: string) =>
			transport.post<T>(`/api/users/${encodeURIComponent(userId)}/follow`),

		/**
		 * Blocks a user by ID.
		 *
		 * @template T
		 * @param userId - Identifier of the user to block.
		 * @returns A promise resolving to the block result.
		 */
		block: <T = unknown>(userId: string) =>
			transport.post<T>(`/api/users/${encodeURIComponent(userId)}/block`),

		/**
		 * Retrieves the users that the specified user is following.
		 *
		 * @template T
		 * @param userId - Identifier of the target user.
		 * @param query - Optional query parameters.
		 * @returns A promise resolving to the following list.
		 */
		following: <T = unknown>(userId: string, query?: QueryParams) =>
			transport.get<T>(`/api/users/${encodeURIComponent(userId)}/following`, {
				query,
			}),

		/**
		 * Retrieves follow requests sent to a user.
		 *
		 * @template T
		 * @param userId - Identifier of the target user.
		 * @returns A promise resolving to the follow requests.
		 */
		followRequests: <T = unknown>(userId: string) =>
			transport.get<T>(
				`/api/users/${encodeURIComponent(userId)}/follow-requests`,
			),

		/**
		 * Accepts a pending follow request.
		 *
		 * @template T
		 * @param userId - Identifier of the user receiving the request.
		 * @param requesterId - Identifier of the requester.
		 * @returns A promise resolving to the acceptance result.
		 */
		acceptFollowRequest: <T = unknown>(userId: string, requesterId: string) =>
			transport.post<T>(
				`/api/users/${encodeURIComponent(userId)}/follow-requests/${encodeURIComponent(requesterId)}/accept`,
			),

		/**
		 * Rejects a pending follow request.
		 *
		 * @template T
		 * @param userId - Identifier of the user receiving the request.
		 * @param requesterId - Identifier of the requester.
		 * @returns A promise resolving to the rejection result.
		 */
		rejectFollowRequest: <T = unknown>(userId: string, requesterId: string) =>
			transport.post<T>(
				`/api/users/${encodeURIComponent(userId)}/follow-requests/${encodeURIComponent(requesterId)}/reject`,
			),

		me: {
			/**
			 * Gets the current authenticated user profile.
			 *
			 * @template T
			 * @returns A promise resolving to the authenticated profile.
			 */
			get: <T = unknown>() => transport.get<T>("/api/me"),

			/**
			 * Updates the current authenticated user profile.
			 *
			 * @template T
			 * @param input - Partial profile updates.
			 * @returns A promise resolving to the updated profile.
			 */
			update: <T = unknown>(input: UserUpdateInput) =>
				transport.patch<T>("/api/me", input),

			/**
			 * Deletes the current authenticated user account.
			 *
			 * @template T
			 * @param input - Payload used to confirm deletion.
			 * @returns A promise resolving to the deletion response.
			 */
			delete: <T = unknown>(input: Record<string, unknown>) =>
				transport.post<T>("/api/me/delete", input),

			/**
			 * Disables the current authenticated user account.
			 *
			 * @template T
			 * @returns A promise resolving to the disable result.
			 */
			disable: <T = unknown>() => transport.post<T>("/api/me/disable"),

			/**
			 * Exports the current authenticated user's data.
			 *
			 * @template T
			 * @returns A promise resolving to the export payload.
			 */
			export: <T = unknown>() => transport.get<T>("/api/me/export"),
		},
	};
}
