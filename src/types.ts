export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export type QueryValue = string | number | boolean | null | undefined | Array<string | number | boolean>;
export type QueryParams = Record<string, QueryValue>;

export interface ClientOptions {
  baseUrl?: string;
  token?: string;
  headers?: HeadersInit;
  fetchImpl?: typeof fetch;
  credentials?: RequestCredentials;
}

export interface RequestOptions {
  query?: QueryParams;
  headers?: HeadersInit;
  body?: unknown;
  signal?: AbortSignal;
  token?: string;
}

export interface ApiErrorPayload {
  error?: string;
  message?: string;
  [key: string]: unknown;
}

export interface PaginationParams {
  limit?: number;
  skip?: number;
}

export interface AuthLoginInput {
  username: string;
  password: string;
  totpCode?: string;
  captchaToken?: string;
}

export interface AuthSignupInput {
  username: string;
  displayName: string;
  password: string;
  email?: string;
  description?: string;
  captchaToken?: string;
}

export enum ForgotPasswordAction {
  Send = 'send',
  Verify = 'verify',
  Reset = 'reset',
}

export type ForgotPasswordInput =
  | { action: ForgotPasswordAction.Send; username?: string; email?: string; captchaToken?: string }
  | { action: ForgotPasswordAction.Verify; username: string; code: string }
  | { action: ForgotPasswordAction.Reset; username: string; code: string; newPassword: string; captchaToken?: string };

export interface ResetPasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface TotpSetupInput {
  password: string;
}

export interface TotpVerifyInput {
  code: string;
}

export interface TotpDisableInput {
  password: string;
  totpCode: string;
}

export interface OAuthTokenInput {
  code: string;
  client_id: string;
  client_secret: string;
  redirect_uri?: string;
}

export interface OAuthAuthorizeInput extends QueryParams {
  client_id: string;
  redirect_uri: string;
  state?: string;
  scope?: string;
}

export interface OAuthApplicationInput {
  [key: string]: unknown;
}

export interface UserUpdateInput {
  [key: string]: unknown;
}

export interface ReportCreateInput {
  [key: string]: unknown;
}

export interface ReportResolveInput {
  [key: string]: unknown;
}

export interface AppealCreateInput {
  [key: string]: unknown;
}

export interface AppealResolveInput {
  [key: string]: unknown;
}

export interface PostCreateInput {
  [key: string]: unknown;
}

export interface PostRepostInput {
  [key: string]: unknown;
}

export interface PostVoteInput {
  optionId: string;
}

export interface CommentCreateInput {
  content: string;
}

export interface ConversationCreateInput {
  participantId?: string;
  participantUsername?: string;
  [key: string]: unknown;
}

export interface MessageCreateInput {
  content: string;
  [key: string]: unknown;
}

export interface AvatarUrlInput extends QueryParams {
  userId?: string;
  username?: string;
  size?: number;
  variant?: string;
  expiresAt?: string | number;
  signature?: string;
}
