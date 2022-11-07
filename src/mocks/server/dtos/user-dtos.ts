import { ApiAuthSession } from '@/app/types/auth';
import { DatabaseValue } from '../database/database';

export function databaseUserToAuthSession(user: DatabaseValue<'user'>): ApiAuthSession {
  return {
    id: user.id,
    username: user.username,
  };
}
