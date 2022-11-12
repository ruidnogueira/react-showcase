import { createApi } from '@/app/api/api';

export const testApi = createApi({
  baseURL: 'http://localhost:4000',
  withCredentials: true,
});
