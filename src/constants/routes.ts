export enum AuthRoute {
  Login = "/api/auth/login",
  Signup = "/api/auth/signup",
  Logout = "/api/auth/logout",
  ForgotPassword = "/api/auth/forgot-password",
  ResetPassword = "/api/auth/reset-password",
  VerifyEmail = "/api/auth/verify-email",
  TotpSetup = "/api/auth/totp/setup",
  TotpVerify = "/api/auth/totp/verify",
  TotpDisable = "/api/auth/totp/disable",
  PasskeyAuthOptions = "/api/auth/passkey/auth-options",
  PasskeyAuthVerify = "/api/auth/passkey/auth-verify",
  PasskeyRegisterOptions = "/api/auth/passkey/register-options",
  PasskeyRegisterVerify = "/api/auth/passkey/register-verify",
  PasskeyList = "/api/auth/passkey/list",
  PasskeyRemove = "/api/auth/passkey/remove",
}

export enum OAuthRoute {
  Token = "/api/oauth/token",
  Revoke = "/api/oauth/revoke",
  Me = "/api/oauth/me",
  Applications = "/api/oauth/applications",
  Authorize = "/api/oauth/authorize",
}
