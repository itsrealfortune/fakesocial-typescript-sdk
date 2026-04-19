import type { HeadersInit } from "bun";
import type { RequestCredentials } from "undici";

/**
 * Supported HTTP methods for remote API requests.
 *
 * @example
 * const method: HttpMethod = HttpMethod.POST;
 */
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

/**
 * Permitted values sent as HTTP query parameters.
 */
export type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>;

/**
 * Query parameter map used to build request URLs.
 *
 * @example
 * const query: QueryParams = { limit: 20, tags: ["news", "tech"] };
 */
export type QueryParams = Record<string, QueryValue>;

/**
 * Client configuration when constructing the Fake Media SDK.
 */
export interface ClientOptions {
  /** Base URL for the Fake Social API. Defaults to the public service base path. */
  baseUrl?: string;
  /** Optional bearer token used for authorization. */
  token?: string;
  /** Additional headers to send with every request. */
  headers?: HeadersInit;
  /** Custom fetch implementation to use for HTTP requests. */
  fetchImpl?: typeof fetch;
  /** Credentials mode to pass to the fetch implementation. */
  credentials?: RequestCredentials;
}

/**
 * Options accepted by transport methods for individual requests.
 */
export interface RequestOptions {
  /** URL query parameters to append to the request. */
  query?: QueryParams;
  /** HTTP headers to include in the request. */
  headers?: HeadersInit;
  /** Request body payload, typically JSON-compatible data. */
  body?: unknown;
  /** Optional AbortSignal to cancel the request. */
  signal?: AbortSignal;
  /** Override token for this specific request only. */
  token?: string;
}

/**
 * Standard structure for API error responses returned by Fake Social.
 */
export interface ApiErrorPayload {
  error?: string;
  message?: string;
  [key: string]: unknown;
}

/**
 * Pagination parameters used when requesting lists from the API.
 *
 * @example
 * const page: PaginationParams = { limit: 50, skip: 100 };
 */
export interface PaginationParams {
  /** Maximum number of items to return. */
  limit?: number;
  /** Number of items to skip before returning results. */
  skip?: number;
}

/**
 * Credentials required to log in to a Fake Social account.
 */
export interface AuthLoginInput {
  username: string;
  password: string;
  totpCode?: string;
  captchaToken?: string;
}

/**
 * Fields accepted when registering a new Fake Social user.
 */
export interface AuthSignupInput {
  username: string;
  displayName: string;
  password: string;
  email?: string;
  description?: string;
  captchaToken?: string;
}

/**
 * Actions supported for the forgot password workflow.
 */
export enum ForgotPasswordAction {
  Send = "send",
  Verify = "verify",
  Reset = "reset",
}

/**
 * Input shapes for the forgot password endpoints.
 *
 * @example
 * const payload: ForgotPasswordInput = {
 *   action: ForgotPasswordAction.Send,
 *   email: "user@example.com",
 * };
 */
export type ForgotPasswordInput =
  | {
      action: ForgotPasswordAction.Send;
      username?: string;
      email?: string;
      captchaToken?: string;
    }
  | { action: ForgotPasswordAction.Verify; username: string; code: string }
  | {
      action: ForgotPasswordAction.Reset;
      username: string;
      code: string;
      newPassword: string;
      captchaToken?: string;
    };

/**
 * Payload used to change the current password.
 */
export interface ResetPasswordInput {
  currentPassword: string;
  newPassword: string;
}

/**
 * Input required to start TOTP setup for a user.
 */
export interface TotpSetupInput {
  password: string;
}

/**
 * Input required to verify a TOTP code.
 */
export interface TotpVerifyInput {
  code: string;
}

/**
 * Input required to disable TOTP authentication.
 */
export interface TotpDisableInput {
  password: string;
  totpCode: string;
}

/**
 * Input used to obtain an OAuth token from the server.
 */
export interface OAuthTokenInput {
  code: string;
  client_id: string;
  client_secret: string;
  redirect_uri?: string;
}

/**
 * Parameters used to build an OAuth authorization URL.
 */
export interface OAuthAuthorizeInput extends QueryParams {
  client_id: string;
  redirect_uri: string;
  state?: string;
  scope?: string;
}

/**
 * Generic object payload used when creating or updating OAuth applications.
 */
export interface OAuthApplicationInput {
  [key: string]: unknown;
}

/**
 * Generic object representing user profile updates.
 */
export interface UserUpdateInput {
  [key: string]: unknown;
}

/**
 * Generic payload sent when creating a report request.
 */
export interface ReportCreateInput {
  [key: string]: unknown;
}

/**
 * Generic payload used to resolve a report.
 */
export interface ReportResolveInput {
  [key: string]: unknown;
}

/**
 * Generic payload sent when creating an appeal.
 */
export interface AppealCreateInput {
  [key: string]: unknown;
}

/**
 * Generic payload used to resolve an appeal.
 */
export interface AppealResolveInput {
  [key: string]: unknown;
}

/**
 * Payload used to create a new post.
 */
export interface PostCreateInput {
  [key: string]: unknown;
}

/**
 * Payload used to repost or quote an existing post.
 */
export interface PostRepostInput {
  [key: string]: unknown;
}

/**
 * Payload used to vote on a authored poll post.
 */
export interface PostVoteInput {
  optionId: string;
}

/**
 * Payload used to create a comment on a post.
 */
export interface CommentCreateInput {
  content: string;
}

/**
 * Input used to create a new conversation.
 */
export interface ConversationCreateInput {
  participantId?: string;
  participantUsername?: string;
  [key: string]: unknown;
}

/**
 * Payload used to send a message in a conversation.
 */
export interface MessageCreateInput {
  content: string;
  [key: string]: unknown;
}

/**
 * A minimal representation of a post returned by the API.
 */
export interface PostItem {
  _id?: string;
  id?: string;
  [key: string]: unknown;
}

/**
 * Configuration options for the PostWatcher polling helper.
 */
export interface PostWatcherOptions {
  query?: QueryParams;
  limit?: number;
  intervalMs?: number;
  initialFetch?: boolean;
}

/**
 * Allowed query parameters for generating avatar URLs.
 */
export interface AvatarUrlInput extends QueryParams {
  userId?: string;
  username?: string;
  size?: number;
  variant?: string;
  expiresAt?: string | number;
  signature?: string;
}
