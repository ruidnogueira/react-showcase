import { DefaultBodyType, PathParams, ResponseResolver, RestContext, RestRequest } from 'msw';

export type RestResponseResolver<
  RequestBody extends DefaultBodyType,
  Params extends PathParams<keyof Params>,
  ResponseBody extends DefaultBodyType
> = ResponseResolver<RestRequest<RequestBody, Params>, RestContext, ResponseBody>;
