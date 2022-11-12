import { setupWorker } from 'msw';
import { handlers } from './handlers/handlers';
import { seedDatabase } from './seeds/seed-database';

seedDatabase();

export const mockWorker = setupWorker(...handlers);
