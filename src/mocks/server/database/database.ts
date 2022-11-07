import { ENTITY_TYPE, factory, PRIMARY_KEY } from '@mswjs/data';
import { userDataFactory } from './user-factory';

export const mockDatabase = factory({
  ...userDataFactory,
});

export type Database = typeof mockDatabase;

/** Helper to get the schema of a model. */
export type DatabaseValue<Key extends keyof Database> = Omit<
  ReturnType<Database[Key]['create']>,
  typeof ENTITY_TYPE | typeof PRIMARY_KEY
>;
