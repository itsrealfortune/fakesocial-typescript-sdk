import { describe, expect, it } from 'bun:test';
import { ForgotPasswordAction } from '../../src';
import { AuthRoute } from '../../src/constants/routes';
import { createAuthApi } from '../../src/modules/auth';

const makeTransport = () => {
  const calls: Array<{ method: string; path: string; body?: unknown }> = [];
  const transport = {
    get: async <T>(path: string) => {
      calls.push({ method: 'GET', path });
      return { success: true } as unknown as T;
    },
    post: async <T>(path: string, body?: unknown) => {
      calls.push({ method: 'POST', path, body });
      return { success: true } as unknown as T;
    },
    put: async <T>(path: string, body?: unknown) => {
      calls.push({ method: 'PUT', path, body });
      return { success: true } as unknown as T;
    },
    patch: async <T>(path: string, body?: unknown) => {
      calls.push({ method: 'PATCH', path, body });
      return { success: true } as unknown as T;
    },
    delete: async <T>(path: string, _options?: unknown) => {
      calls.push({ method: 'DELETE', path });
      return { success: true } as unknown as T;
    },
    buildUrl: (_path: string) => '',
    setToken: (_token: string | undefined) => {},
    request: async <T>(_method: string, path: string) => {
      calls.push({ method: 'REQUEST', path });
      return { success: true } as unknown as T;
    },
  };
  return { transport, calls };
};

describe('createAuthApi', () => {
  it('calls the proper auth routes', async () => {
    const { transport, calls } = makeTransport();
    const api = createAuthApi(transport as any);

    await api.login({ username: 'test', password: 'pwd' });
    await api.signup({ username: 'new', displayName: 'New User', password: 'pwd' });
    await api.logout();
    await api.forgotPassword({ action: ForgotPasswordAction.Send, email: 'me@example.com' });
    await api.resetPassword({ currentPassword: 'old', newPassword: 'new' });
    await api.verifyEmail({ code: 'abc' });
    await api.totpSetup({ password: 'pwd' });
    await api.totpVerify({ code: '123456' });
    await api.totpDisable({ password: 'pwd', totpCode: '123456' });

    expect(calls.map((call) => call.path)).toEqual([
      AuthRoute.Login,
      AuthRoute.Signup,
      AuthRoute.Logout,
      AuthRoute.ForgotPassword,
      AuthRoute.ResetPassword,
      AuthRoute.VerifyEmail,
      AuthRoute.TotpSetup,
      AuthRoute.TotpVerify,
      AuthRoute.TotpDisable,
    ]);
  });

  it('uses passkey route enums', async () => {
    const { transport, calls } = makeTransport();
    const api = createAuthApi(transport as any);

    await api.passkeyAuthOptions({});
    await api.passkeyAuthVerify({});
    await api.passkeyRegisterOptions({});
    await api.passkeyRegisterVerify({});
    await api.passkeyList();
    await api.passkeyRemove({});

    expect(calls.map((call) => call.path)).toEqual([
      AuthRoute.PasskeyAuthOptions,
      AuthRoute.PasskeyAuthVerify,
      AuthRoute.PasskeyRegisterOptions,
      AuthRoute.PasskeyRegisterVerify,
      AuthRoute.PasskeyList,
      AuthRoute.PasskeyRemove,
    ]);
  });
});
