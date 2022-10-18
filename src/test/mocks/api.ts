import { createApi } from '@/app/api/api';

// TODO: mock
const api = createApi({
  baseURL: 'http://localhost:4000',
  withCredentials: true,
});
