import { factory } from '@mswjs/data';
import { userDataFactory } from './user-factory';

export const mockDatabase = factory({
  ...userDataFactory,
});
