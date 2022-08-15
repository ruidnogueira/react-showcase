/**
 * Adds/removes leading/trailing slashes from  url paths.
 *
 * @example
 * ```
 * adjustPathSlashes('route', { hasLeadingSlash: true, hasTrailingSlash: true })
 * // returns '/route/'
 * ```
 */
export function adjustPathSlashes(
  path: string,
  {
    hasLeadingSlash,
    hasTrailingSlash,
  }: {
    hasLeadingSlash?: boolean;
    hasTrailingSlash?: boolean;
  }
) {
  const leadingSlash = hasLeadingSlash ? '/' : '';
  const trailingSlash = hasTrailingSlash ? '/' : '';

  return path.replace(/^\/?([^/]+(?:\/[^/]+)*)\/?$/, `${leadingSlash}$1${trailingSlash}`);
}
