export type Result<T, E> =
  | {
    success: true;
    value: T;
  } | {
    success: false;
    error: E;
  };


export function success(): Result<void, never>;
export function success<T>(value: T): Result<T, never>;
export function success<T>(value?: T): Result<T | void, never> {
  return {
    success: true,
    value: value as T,
  };
}

export function failure<E>(error: E): Result<never, E> {
  return {
    success: false,
    error,
  };
}