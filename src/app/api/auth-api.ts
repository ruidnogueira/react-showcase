import { ApiAuthSession, ApiCreateAuthSessionRequest } from '../types/auth';
import { api, ApiRequestConfig } from './api';

export const authApi = {
  getSession: (config?: Pick<ApiRequestConfig, 'signal'>) =>
    api.get<ApiAuthSession>('/auth/session', config),

  createSession: (data: ApiCreateAuthSessionRequest, config?: Pick<ApiRequestConfig, 'signal'>) =>
    api.post<ApiAuthSession>('/user/session', data, config),
};
