import { storageKeys } from '@/app/core/config/storage-config';
import { ApiAuthSession, ApiCreateAuthSessionRequest } from '@/app/types/auth';
import { startOfYesterday } from 'date-fns';
import { rest } from 'msw';
import { mockDatabase } from '../database/database';
import { RestResponseResolver } from './handler-types';

const cookieName = storageKeys.userIdCookie;

export function handleApiCreateSession(
  resolver: RestResponseResolver<ApiCreateAuthSessionRequest, never, ApiAuthSession>
) {
  return rest.post(`**/auth/session`, resolver);
}

export function handleApiGetSession(resolver: RestResponseResolver<never, never, ApiAuthSession>) {
  return rest.get(`**/auth/session`, resolver);
}

export function handleApiDeleteSession(resolver: RestResponseResolver<never, never, undefined>) {
  return rest.delete(`**/auth/session`, resolver);
}

export const userHandlers = [
  handleApiCreateSession(async (req, res, ctx) => {
    // TODO: remove type once https://github.com/mswjs/msw/issues/1318 is solved
    const request: { data: ApiCreateAuthSessionRequest } = await req.json();

    const user = mockDatabase.user.update({
      where: {
        email: {
          equals: request.data.email,
        },
        password: {
          equals: request.data.password,
        },
      },
      data: {
        hasSession: true,
      },
    });

    if (!user) {
      return res(ctx.status(401));
    }

    const data: ApiAuthSession = {
      id: user.id,
      username: user.username,
    };

    return res(ctx.json(data), ctx.cookie(cookieName, user.id.toString(), { sameSite: 'strict' }));
  }),

  handleApiGetSession((req, res, ctx) => {
    const { [cookieName]: userId } = req.cookies;

    if (!userId) {
      return res(ctx.status(401));
    }

    const user = mockDatabase.user.findFirst({
      where: {
        id: {
          equals: Number(userId),
        },
      },
    });

    if (!user?.hasSession) {
      return res(ctx.status(404));
    }

    const data: ApiAuthSession = {
      id: user.id,
      username: user.username,
    };

    return res(ctx.json(data));
  }),

  handleApiDeleteSession(async (req, res, ctx) => {
    const { userId } = req.cookies;

    if (!userId) {
      return res(ctx.status(401));
    }

    mockDatabase.user.update({
      where: {
        id: {
          equals: Number(userId),
        },
      },
      data: {
        hasSession: false,
      },
    });

    return res(
      ctx.status(204),
      ctx.cookie(cookieName, '', { sameSite: 'strict', expires: startOfYesterday() })
    );
  }),
];
