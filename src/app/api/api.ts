import axios, { AxiosError, AxiosInstance, AxiosResponse, ResponseType } from 'axios';
import { taskEither } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';
import { adjustPathSlashes } from '@/app/utils/path';

type Headers = Record<string, string | number | boolean>;
type Params = Record<string, string | number | boolean>;

export interface ApiResponse<T> {
  status: number;
  data: T;
  headers: Headers;
}

export interface ApiErrorResponse {
  status: number;
  data: unknown;
}

export interface ApiRequestResult<T> {
  response?: ApiResponse<T>;
  error?: ApiErrorResponse | Error;
}

export interface ApiRequestConfig {
  headers?: Headers;
  params?: Params;
  responseType?: ResponseType;
}

function createApi(axios: AxiosInstance) {
  return {
    get: <Response>(url: string, config: ApiRequestConfig = {}) =>
      withAsync(() => axios.get<Response>(url, config)),

    delete: <Response>(url: string, config: ApiRequestConfig = {}) =>
      withAsync(() => axios.delete<Response>(url, config)),

    post: <Response, Request = unknown>(
      url: string,
      data?: Request,
      config: ApiRequestConfig = {}
    ) => withAsync(() => axios.post<Response>(url, { ...config, data })),

    put: <Response, Request = unknown>(
      url: string,
      data?: Request,
      config: ApiRequestConfig = {}
    ) => withAsync(() => axios.put<Response>(url, { ...config, data })),

    patch: <Response, Request = unknown>(
      url: string,
      data?: Request,
      config: ApiRequestConfig = {}
    ) => withAsync(() => axios.patch<Response>(url, { ...config, data })),
  };
}

function withAsync<T>(
  requestFn: () => Promise<AxiosResponse<T>>
): TaskEither<Error | ApiErrorResponse, ApiResponse<T>> {
  return pipe(
    taskEither.tryCatch(requestFn, (error) => formatError(error)),
    taskEither.map((response): ApiResponse<T> => {
      return {
        status: response.status,
        data: response.data,
        headers: response.headers,
      };
    })
  );
}

function formatError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return formatAxiosError(error);
  }

  return new Error('different error than axios');
}

function formatAxiosError(error: AxiosError): ApiErrorResponse | Error {
  if (error.response) {
    return {
      status: error.response.status,
      data: error.response.data,
    };
  }

  return new Error(error.message);
}

function getBaseUrl() {
  if (!location.origin) {
    return 'http://localhost:4000';
  }

  const url = location.origin + import.meta.env.VITE_API_BASE_URL;
  return adjustPathSlashes(url, { hasLeadingSlash: false, hasTrailingSlash: false });
}

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
});

export const api = createApi(axiosInstance);
