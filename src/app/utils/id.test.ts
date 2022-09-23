import { uniqueId } from './id';

describe('uniqueId', () => {
  test('creates id', () => {
    expect(uniqueId()).toHaveLength(36);
  });

  test('adds prefix', () => {
    const prefix = 'example-prefix';
    const result = uniqueId(prefix);

    expect(result.startsWith(prefix + '-')).toBe(true);
    expect(result).toHaveLength(prefix.length + 1 + 36);
  });
});
