import { primaryKey } from '@mswjs/data';
import { FactoryAPI } from '@mswjs/data/lib/glossary';
import Chance from 'chance';

const chance = new Chance('user-database');

/* TODO: use typescript satisfies when released? satisfies ModelDictionary */
export const userDataFactory = {
  user: {
    id: primaryKey(chance.natural),
    name: chance.name,
  },
};

export function seedUserData(database: FactoryAPI<typeof userDataFactory>) {
  for (let index = 0; index < 10; index++) {
    database.user.create();
  }
}
