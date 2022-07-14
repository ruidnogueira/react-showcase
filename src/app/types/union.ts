type UnionKeys<T> = T extends T ? keyof T : never;

type StrictUnionHelper<T, TAll> = T extends any
  ? T & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, undefined>>
  : never;

/**
 * Turns all properties, between union types, that are not in common, into partials.
 *
 * Useful when you want to directly access every possible property of the union instead
 * of narrowing down it's type first.
 *
 * @example
 * ```
 * type A = { a: string, c: string }
 * type B = { b: string, c: string }
 * type C = StrictUnion<A | B>
 * // returns { a?: string, b?: string, c: string }
 * ```
 */
export type StrictUnion<T> = StrictUnionHelper<T, T>;
