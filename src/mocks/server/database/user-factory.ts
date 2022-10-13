import { primaryKey } from '@mswjs/data';
import Chance from 'chance';

const chance = new Chance('user-database');

/* TODO: use typescript satisfies when released? satisfies ModelDictionary */
export const userDataFactory = {
  user: {
    id: primaryKey(chance.natural),
    username: chance.name,
    email: chance.email,
    password: () => chance.string({ length: 8, casing: 'upper', alpha: true, numeric: true }),
  },
};
