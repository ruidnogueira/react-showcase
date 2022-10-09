import { drop, factory, primaryKey } from '@mswjs/data';
import Chance from 'chance';

const chance = new Chance('database');

export const mockDatabase = factory({
  user: {
    id: primaryKey(chance.natural),
    name: chance.name,
  },
});

export function seedMockDatabase() {
  for (let index = 0; index < 10; index++) {
    mockDatabase.user.create();
  }
}

export function clearMockDatabase() {
  drop(mockDatabase);
}
