import { createPostWatcher } from '../core/postWatcher';
import type { TransportLike } from '../core/transport';
import type { AvatarUrlInput, CommentCreateInput, ConversationCreateInput, MessageCreateInput, PaginationParams, PostCreateInput, PostRepostInput, PostVoteInput, PostWatcherOptions, QueryParams } from '../types';

export function createContentApi(transport: TransportLike) {
  return {
    posts: {
      list: <T = unknown>(query?: QueryParams) => transport.get<T>('/api/posts', { query }),
      create: <T = unknown>(input: PostCreateInput) => transport.post<T>('/api/posts', input),
      delete: <T = unknown>(postId: string) => transport.delete<T>(`/api/posts/${encodeURIComponent(postId)}`),
      like: <T = unknown>(postId: string) => transport.post<T>(`/api/posts/${encodeURIComponent(postId)}/like`),
      repost: <T = unknown>(postId: string, input?: PostRepostInput) => transport.post<T>(`/api/posts/${encodeURIComponent(postId)}/repost`, input ?? {}),
      vote: <T = unknown>(postId: string, input: PostVoteInput) => transport.post<T>(`/api/posts/${encodeURIComponent(postId)}/vote`, input),
      comments: {
        list: <T = unknown>(postId: string, query?: QueryParams) => transport.get<T>(`/api/posts/${encodeURIComponent(postId)}/comments`, { query }),
        create: <T = unknown>(postId: string, input: CommentCreateInput) => transport.post<T>(`/api/posts/${encodeURIComponent(postId)}/comments`, input),
        delete: <T = unknown>(postId: string, commentId: string) => transport.delete<T>(`/api/posts/${encodeURIComponent(postId)}/comments`, { body: { commentId } }),
      },
    },
      watch: (options?: PostWatcherOptions) => createPostWatcher(transport, options),
    conversations: {
      list: <T = unknown>() => transport.get<T>('/api/conversations'),
      create: <T = unknown>(input: ConversationCreateInput) => transport.post<T>('/api/conversations', input),
      delete: <T = unknown>(conversationId: string) => transport.delete<T>(`/api/conversations/${encodeURIComponent(conversationId)}`),
      messages: {
        list: <T = unknown>(conversationId: string) => transport.get<T>(`/api/conversations/${encodeURIComponent(conversationId)}/messages`),
        send: <T = unknown>(conversationId: string, input: MessageCreateInput) => transport.post<T>(`/api/conversations/${encodeURIComponent(conversationId)}/messages`, input),
        delete: <T = unknown>(conversationId: string, messageId: string) => transport.delete<T>(`/api/conversations/${encodeURIComponent(conversationId)}/messages`, { body: { messageId } }),
      },
      read: <T = unknown>(conversationId: string) => transport.post<T>(`/api/conversations/${encodeURIComponent(conversationId)}/read`),
    },
    notifications: {
      list: <T = unknown>() => transport.get<T>('/api/notifications'),
      markAllRead: <T = unknown>() => transport.patch<T>('/api/notifications', {}),
    },
    achievements: {
      list: <T = unknown>(userId: string) => transport.get<T>('/api/achievements', { query: { userId } }),
      definitions: <T = unknown>() => transport.get<T>('/api/achievements/definitions'),
    },
    platform: {
      stats: <T = unknown>() => transport.get<T>('/api'),
      trending: <T = unknown>(query?: PaginationParams & QueryParams) => transport.get<T>('/api/trending', { query }),
      avatarUrl: (input: AvatarUrlInput) => transport.buildUrl('/api/avatar', input),
    },
  };
}
