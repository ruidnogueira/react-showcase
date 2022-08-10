import { configureAxe } from 'jest-axe';

/* TODO: remove as unknow as object once @types/jest-axe is fixed */
export const axe = configureAxe({
  impactLevels: ['moderate', 'serious', 'critical'],
} as unknown as object);
