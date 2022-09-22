import { v4 as uuid } from 'uuid';

/**
 * Provides an unique id.
 *
 * Use this only if React's `useId` does cannot be used for your specific use case.
 */
export function uniqueId(prefix?: string) {
  return prefix ? prefix + '-' + uuid() : uuid();
}
