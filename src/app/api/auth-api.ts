import { ApiAuthSession, ApiCreateAuthSessionRequest } from '../types/auth';
import { ApiClient, ApiRequestConfig } from './api';

export type AuthApi = ReturnType<typeof createAuthApi>;

export function createAuthApi(api: ApiClient) {
  return {
    getSession: (config?: Pick<ApiRequestConfig, 'signal'>) =>
      api.get<ApiAuthSession>('/auth/session', config),

    createSession: (data: ApiCreateAuthSessionRequest, config?: Pick<ApiRequestConfig, 'signal'>) =>
      api.post<ApiAuthSession>('/auth/session', data, config),

    deleteSession: (config?: Pick<ApiRequestConfig, 'signal'>) =>
      api.delete('/auth/session', config),
  };
}
