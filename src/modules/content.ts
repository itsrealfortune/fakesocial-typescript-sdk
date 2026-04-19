import { createPostWatcher } from "../core/postWatcher";
import type { TransportLike } from "../core/transport";
import type {
	AvatarUrlInput,
	CommentCreateInput,
	ConversationCreateInput,
	MessageCreateInput,
	PaginationParams,
	PostCreateInput,
	PostRepostInput,
	PostVoteInput,
	PostWatcherOptions,
	QueryParams,
} from "../types";

/**
 * Builds the content API helpers for the Fake Social SDK.
 *
 * @param transport - Transport instance used for content-related requests.
 * @returns Content helper methods for posts, conversations, notifications, and more.
 */
export function createContentApi(transport: TransportLike) {
	return {
		posts: {
			/**
			 * Retrieves a paginated feed of posts.
			 *
			 * @template T
			 * @param query - Optional filters and pagination parameters.
			 * @returns A promise resolving to the post list.
			 */
			list: <T = unknown>(query?: QueryParams) =>
				transport.get<T>("/api/posts", { query }),

			/**
			 * Creates a new post.
			 *
			 * @template T
			 * @param input - Post payload.
			 * @returns A promise resolving to the created post.
			 */
			create: <T = unknown>(input: PostCreateInput) =>
				transport.post<T>("/api/posts", input),

			/**
			 * Deletes a post by ID.
			 *
			 * @template T
			 * @param postId - Post identifier.
			 * @returns A promise resolving to the deletion result.
			 */
			delete: <T = unknown>(postId: string) =>
				transport.delete<T>(`/api/posts/${encodeURIComponent(postId)}`),

			/**
			 * Likes a post by ID.
			 *
			 * @template T
			 * @param postId - Post identifier.
			 * @returns A promise resolving to the like result.
			 */
			like: <T = unknown>(postId: string) =>
				transport.post<T>(`/api/posts/${encodeURIComponent(postId)}/like`),

			/**
			 * Reposts an existing post.
			 *
			 * @template T
			 * @param postId - Post identifier.
			 * @param input - Optional repost metadata.
			 * @returns A promise resolving to the repost result.
			 */
			repost: <T = unknown>(postId: string, input?: PostRepostInput) =>
				transport.post<T>(
					`/api/posts/${encodeURIComponent(postId)}/repost`,
					input ?? {},
				),

			/**
			 * Votes on a post poll.
			 *
			 * @template T
			 * @param postId - Poll post identifier.
			 * @param input - Vote payload.
			 * @returns A promise resolving to the vote result.
			 */
			vote: <T = unknown>(postId: string, input: PostVoteInput) =>
				transport.post<T>(
					`/api/posts/${encodeURIComponent(postId)}/vote`,
					input,
				),

			comments: {
				/**
				 * Lists comments for a given post.
				 *
				 * @template T
				 * @param postId - Post identifier.
				 * @param query - Optional query parameters.
				 * @returns A promise resolving to the comment list.
				 */
				list: <T = unknown>(postId: string, query?: QueryParams) =>
					transport.get<T>(
						`/api/posts/${encodeURIComponent(postId)}/comments`,
						{ query },
					),

				/**
				 * Creates a new comment on a post.
				 *
				 * @template T
				 * @param postId - Post identifier.
				 * @param input - Comment payload.
				 * @returns A promise resolving to the created comment.
				 */
				create: <T = unknown>(postId: string, input: CommentCreateInput) =>
					transport.post<T>(
						`/api/posts/${encodeURIComponent(postId)}/comments`,
						input,
					),

				/**
				 * Deletes a comment on a post.
				 *
				 * @template T
				 * @param postId - Post identifier.
				 * @param commentId - Comment identifier.
				 * @returns A promise resolving to the deletion result.
				 */
				delete: <T = unknown>(postId: string, commentId: string) =>
					transport.delete<T>(
						`/api/posts/${encodeURIComponent(postId)}/comments`,
						{ body: { commentId } },
					),
			},
		},

		/**
		 * Creates a post watcher that polls for new posts.
		 *
		 * @param options - Watcher configuration options.
		 * @returns A PostWatcher instance.
		 */
		watch: (options?: PostWatcherOptions) =>
			createPostWatcher(transport, options),

		conversations: {
			/**
			 * Lists conversations for the current user.
			 *
			 * @template T
			 * @returns A promise resolving to the conversation list.
			 */
			list: <T = unknown>() => transport.get<T>("/api/conversations"),

			/**
			 * Creates a new conversation.
			 *
			 * @template T
			 * @param input - Conversation creation payload.
			 * @returns A promise resolving to the created conversation.
			 */
			create: <T = unknown>(input: ConversationCreateInput) =>
				transport.post<T>("/api/conversations", input),

			/**
			 * Deletes a conversation by ID.
			 *
			 * @template T
			 * @param conversationId - Conversation identifier.
			 * @returns A promise resolving to the deletion result.
			 */
			delete: <T = unknown>(conversationId: string) =>
				transport.delete<T>(
					`/api/conversations/${encodeURIComponent(conversationId)}`,
				),

			messages: {
				/**
				 * Lists messages in a conversation.
				 *
				 * @template T
				 * @param conversationId - Conversation identifier.
				 * @returns A promise resolving to the message list.
				 */
				list: <T = unknown>(conversationId: string) =>
					transport.get<T>(
						`/api/conversations/${encodeURIComponent(conversationId)}/messages`,
					),

				/**
				 * Sends a new message in a conversation.
				 *
				 * @template T
				 * @param conversationId - Conversation identifier.
				 * @param input - Message payload.
				 * @returns A promise resolving to the sent message.
				 */
				send: <T = unknown>(
					conversationId: string,
					input: MessageCreateInput,
				) =>
					transport.post<T>(
						`/api/conversations/${encodeURIComponent(conversationId)}/messages`,
						input,
					),

				/**
				 * Deletes a message from a conversation.
				 *
				 * @template T
				 * @param conversationId - Conversation identifier.
				 * @param messageId - Message identifier.
				 * @returns A promise resolving to the deletion result.
				 */
				delete: <T = unknown>(conversationId: string, messageId: string) =>
					transport.delete<T>(
						`/api/conversations/${encodeURIComponent(conversationId)}/messages`,
						{ body: { messageId } },
					),
			},

			/**
			 * Marks a conversation as read.
			 *
			 * @template T
			 * @param conversationId - Conversation identifier.
			 * @returns A promise resolving to the read acknowledgement.
			 */
			read: <T = unknown>(conversationId: string) =>
				transport.post<T>(
					`/api/conversations/${encodeURIComponent(conversationId)}/read`,
				),
		},

		notifications: {
			/**
			 * Retrieves notification items for the current user.
			 *
			 * @template T
			 * @returns A promise resolving to notification data.
			 */
			list: <T = unknown>() => transport.get<T>("/api/notifications"),

			/**
			 * Marks all notifications as read.
			 *
			 * @template T
			 * @returns A promise resolving to the update result.
			 */
			markAllRead: <T = unknown>() =>
				transport.patch<T>("/api/notifications", {}),
		},

		achievements: {
			/**
			 * Lists achievements for the specified user.
			 *
			 * @template T
			 * @param userId - User identifier.
			 * @returns A promise resolving to the achievement list.
			 */
			list: <T = unknown>(userId: string) =>
				transport.get<T>("/api/achievements", { query: { userId } }),

			/**
			 * Retrieves achievement definitions from the service.
			 *
			 * @template T
			 * @returns A promise resolving to achievement metadata.
			 */
			definitions: <T = unknown>() =>
				transport.get<T>("/api/achievements/definitions"),
		},

		platform: {
			/**
			 * Retrieves platform statistics and health information.
			 *
			 * @template T
			 * @returns A promise resolving to the platform stats.
			 */
			stats: <T = unknown>() => transport.get<T>("/api"),

			/**
			 * Retrieves trending posts, optionally filtered by pagination.
			 *
			 * @template T
			 * @param query - Optional trending query parameters.
			 * @returns A promise resolving to trending content.
			 */
			trending: <T = unknown>(query?: PaginationParams & QueryParams) =>
				transport.get<T>("/api/trending", { query }),

			/**
			 * Builds a direct avatar URL for the given avatar parameters.
			 *
			 * @param input - Avatar URL query parameters.
			 * @returns A fully formed avatar URL string.
			 */
			avatarUrl: (input: AvatarUrlInput) =>
				transport.buildUrl("/api/avatar", input),
		},
	};
}
