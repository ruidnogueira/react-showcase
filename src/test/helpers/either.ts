import { either } from 'fp-ts';
import { Either } from 'fp-ts/Either';

/**
 * Returns left if value is left otherwise throws error.
 */
export function fromEitherLeft<L, R>(value: Either<L, R>) {
  if (either.isRight(value)) {
    throw new Error();
  }

  return value.left;
}

/**
 * Returns right if value is right otherwise throws error.
 */
export function fromEitherRight<L, R>(value: Either<L, R>) {
  if (either.isLeft(value)) {
    throw new Error();
  }

  return value.right;
}
