import axios, { AxiosError, AxiosResponse, CreateAxiosDefaults, ResponseType } from 'axios';
import { taskEither } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';
import { adjustPathSlashes } from '@/app/utils/path';

type RequestWithoutData = <Response>(
  url: string,
  config?: ApiRequestConfig
) => TaskEither<Error | ApiErrorResponse, ApiResponse<Response>>;

type RequestWithData = <Response, Request = unknown>(
  url: string,
  data?: Request,
  config?: ApiRequestConfig
) => TaskEither<Error | ApiErrorResponse, ApiResponse<Response>>;

export interface ApiClient {
  get: RequestWithoutData;
  delete: RequestWithoutData;
  post: RequestWithData;
  put: RequestWithData;
  patch: RequestWithData;
}

type Headers = Record<string, string | number | boolean | undefined>;
type Params = Record<string, string | number | boolean | undefined>;

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
  signal?: AbortSignal;
}

function withAsync<T>(
  requestFn: () => Promise<AxiosResponse<T>>
): TaskEither<Error | ApiErrorResponse, ApiResponse<T>> {
  return pipe(
    taskEither.tryCatch(requestFn, formatError),
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
  const url = location.origin + import.meta.env.VITE_API_BASE_URL;
  return adjustPathSlashes(url, { hasLeadingSlash: false, hasTrailingSlash: false });
}

/**
 * Creates the api client. It's defaults can be overridden.
 */
export function createApi(config: CreateAxiosDefaults = {}): ApiClient {
  const instance = axios.create({
    baseURL: getBaseUrl(),
    ...config,
  });

  return {
    get: (url, config) => withAsync(() => instance.get(url, config)),
    delete: (url, config = {}) => withAsync(() => instance.delete(url, config)),
    post: (url, data, config = {}) => withAsync(() => instance.post(url, { ...config, data })),
    put: (url, data, config = {}) => withAsync(() => instance.put(url, { ...config, data })),
    patch: (url, data, config = {}) => withAsync(() => instance.patch(url, { ...config, data })),
  };
}
