import { AuthRoute } from '../constants/routes';
import type { TransportLike } from '../core/transport';
import type { AuthLoginInput, AuthSignupInput, ForgotPasswordInput, ResetPasswordInput, TotpDisableInput, TotpSetupInput, TotpVerifyInput } from '../types';

export function createAuthApi(transport: TransportLike) {
  return {
    login: <T = unknown>(input: AuthLoginInput) => transport.post<T>(AuthRoute.Login, input),
    signup: <T = unknown>(input: AuthSignupInput) => transport.post<T>(AuthRoute.Signup, input),
    logout: <T = unknown>() => transport.post<T>(AuthRoute.Logout),
    forgotPassword: <T = unknown>(input: ForgotPasswordInput) => transport.post<T>(AuthRoute.ForgotPassword, input),
    resetPassword: <T = unknown>(input: ResetPasswordInput) => transport.post<T>(AuthRoute.ResetPassword, input),
    verifyEmail: <T = unknown>(input: Record<string, unknown>) => transport.post<T>(AuthRoute.VerifyEmail, input),
    totpSetup: <T = unknown>(input: TotpSetupInput) => transport.post<T>(AuthRoute.TotpSetup, input),
    totpVerify: <T = unknown>(input: TotpVerifyInput) => transport.post<T>(AuthRoute.TotpVerify, input),
    totpDisable: <T = unknown>(input: TotpDisableInput) => transport.post<T>(AuthRoute.TotpDisable, input),
    passkeyAuthOptions: <T = unknown>(input: Record<string, unknown>) => transport.post<T>(AuthRoute.PasskeyAuthOptions, input),
    passkeyAuthVerify: <T = unknown>(input: Record<string, unknown>) => transport.post<T>(AuthRoute.PasskeyAuthVerify, input),
    passkeyRegisterOptions: <T = unknown>(input: Record<string, unknown>) => transport.post<T>(AuthRoute.PasskeyRegisterOptions, input),
    passkeyRegisterVerify: <T = unknown>(input: Record<string, unknown>) => transport.post<T>(AuthRoute.PasskeyRegisterVerify, input),
    passkeyList: <T = unknown>() => transport.get<T>(AuthRoute.PasskeyList),
    passkeyRemove: <T = unknown>(input: Record<string, unknown>) => transport.post<T>(AuthRoute.PasskeyRemove, input),
  };
}
