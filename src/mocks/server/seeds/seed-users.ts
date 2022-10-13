import { mockDatabase } from '../database/database';

export function seedUsers() {
  mockDatabase.user.create({ username: 'Test1', password: 'Abcd1234.' });

  for (let index = 0; index < 10; index++) {
    mockDatabase.user.create();
  }
}
