export type Result<S, E> =
  | { success: true; result: S }
  | { success: false; result: E };

export function failure<S, E>(errors: E): Result<S, E> {
  return { success: false, result: errors };
}

export function success<S, E>(result: S): Result<S, E> {
  return { success: true, result: result };
}
