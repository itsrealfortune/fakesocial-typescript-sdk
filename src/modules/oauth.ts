import { OAuthRoute } from '../constants/routes';
import type { TransportLike } from '../core/transport';
import type { OAuthApplicationInput, OAuthAuthorizeInput, OAuthTokenInput } from '../types';

export function createOAuthApi(transport: TransportLike) {
  return {
    token: <T = unknown>(input: OAuthTokenInput) => transport.post<T>(OAuthRoute.Token, input),
    revoke: <T = unknown>(input: Record<string, unknown>) => transport.post<T>(OAuthRoute.Revoke, input),
    me: <T = unknown>(accessToken?: string) => transport.get<T>(OAuthRoute.Me, { token: accessToken }),
    buildAuthorizeUrl: (input: OAuthAuthorizeInput) => transport.buildUrl(OAuthRoute.Authorize, input),
    applications: {
      list: <T = unknown>() => transport.get<T>(OAuthRoute.Applications),
      create: <T = unknown>(input: OAuthApplicationInput) => transport.post<T>(OAuthRoute.Applications, input),
      update: <T = unknown>(clientId: string, input: OAuthApplicationInput) => transport.put<T>(`${OAuthRoute.ApplicationById}/${encodeURIComponent(clientId)}`, input),
      delete: <T = unknown>(clientId: string) => transport.delete<T>(`${OAuthRoute.ApplicationById}/${encodeURIComponent(clientId)}`),
    },
  };
}
