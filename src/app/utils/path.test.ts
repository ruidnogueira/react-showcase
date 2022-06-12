import { adjustPathSlashes } from './path';

describe('adjustPathSlashes', () => {
  test('has leading slash', () => {
    expect(adjustPathSlashes('route', { hasLeadingSlash: true })).toBe('/route');
    expect(adjustPathSlashes('/route', { hasLeadingSlash: true })).toBe('/route');
  });

  test('does not have leading slash', () => {
    expect(adjustPathSlashes('route', { hasLeadingSlash: false })).toBe('route');
    expect(adjustPathSlashes('/route', { hasLeadingSlash: false })).toBe('route');
  });

  test('has trailing slash', () => {
    expect(adjustPathSlashes('route', { hasTrailingSlash: true })).toBe('route/');
    expect(adjustPathSlashes('route/', { hasTrailingSlash: true })).toBe('route/');
  });

  test('does not have trailing slash', () => {
    expect(adjustPathSlashes('route', { hasTrailingSlash: false })).toBe('route');
    expect(adjustPathSlashes('route/', { hasTrailingSlash: false })).toBe('route');
  });
});
