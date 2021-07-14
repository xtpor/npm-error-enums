import { Result, ok, error, isOk, isError } from "./result"
import { Option, some, none, isSome } from "./option"

export { ok, error, isOk, isError }

export function contains<T, E>(res: Result<T, E>, value: T): boolean {
  return isOk(res) && res.value === value
}

export function containsError<T, E>(res: Result<T, E>, value: E): boolean {
  return isError(res) && res.error === value
}

export function toOption<T, E>(res: Result<T, E>): Option<T> {
  if (isOk(res)) {
    return some(res.value)
  } else {
    return none()
  }
}

export function toOptionError<T, E>(res: Result<T, E>): Option<E> {
  if (isError(res)) {
    return some(res.error)
  } else {
    return none()
  }
}

export function map<T, U, E>(
  res: Result<T, E>,
  fn: (inner: T) => U
): Result<U, E> {
  if (isOk(res)) {
    return ok(fn(res.value))
  } else {
    return res
  }
}

export function mapOr<T, U, E>(
  res: Result<T, E>,
  defaults: U,
  fn: (inner: T) => U
): U {
  if (isOk(res)) {
    return fn(res.value)
  } else {
    return defaults
  }
}

export function mapOrElse<T, U, E>(
  res: Result<T, E>,
  defaults: (err: E) => U,
  fn: (inner: T) => U
): U {
  if (isOk(res)) {
    return fn(res.value)
  } else {
    return defaults(res.error)
  }
}

export function mapError<T, E, F>(
  res: Result<T, E>,
  fn: (inner: E) => F
): Result<T, F> {
  if (isOk(res)) {
    return res
  } else {
    return error(fn(res.error))
  }
}

export function and<T, U, E>(
  res: Result<T, E>,
  res2: Result<U, E>
): Result<U, E> {
  if (isOk(res)) {
    return res2
  } else {
    return res
  }
}

export function andThen<T, U, E>(
  res: Result<T, E>,
  fn: (inner: T) => Result<U, E>
): Result<U, E> {
  if (isOk(res)) {
    return fn(res.value)
  } else {
    return res
  }
}

export function or<T, E, F>(
  res: Result<T, E>,
  res2: Result<T, F>
): Result<T, F> {
  if (isOk(res)) {
    return res
  } else {
    return res2
  }
}

export function orElse<T, E, F>(
  res: Result<T, E>,
  fn: (err: E) => Result<T, F>
): Result<T, F> {
  if (isOk(res)) {
    return res
  } else {
    return fn(res.error)
  }
}

export function unwrap<T, E>(res: Result<T, E>): T {
  if (isOk(res)) {
    return res.value
  } else {
    throw res.error
  }
}

export function unwrapOr<T, E>(res: Result<T, E>, defaults: T): T {
  if (isOk(res)) {
    return res.value
  } else {
    return defaults
  }
}

export function unwrapOrElse<T, E>(
  res: Result<T, E>,
  defaults: (err: E) => T
): T {
  if (isOk(res)) {
    return res.value
  } else {
    return defaults(res.error)
  }
}

export function unwrapError<T, E>(res: Result<T, E>): E {
  if (isOk(res)) {
    throw res.value
  } else {
    return res.error
  }
}

export function transpose<T, E>(
  res: Result<Option<T>, E>
): Option<Result<T, E>> {
  if (isOk(res)) {
    const inner = res.value
    if (isSome(inner)) {
      return some(ok(inner.value))
    } else {
      return none()
    }
  } else {
    return some(error(res.error))
  }
}

export function flatten<T, E>(res: Result<Result<T, E>, E>): Result<T, E> {
  if (isOk(res)) {
    return res.value
  } else {
    return res
  }
}

export function intoOkOrError<T>(res: Result<T, T>): T {
  if (isOk(res)) {
    return res.value
  } else {
    return res.error
  }
}

export function tryCatch<T>(fn: () => Promise<T>): Promise<Result<T, unknown>>
export function tryCatch<T>(fn: () => T): Result<T, unknown>
export function tryCatch<T>(
  fn: () => T
): Result<T, unknown> | Promise<Result<T, unknown>> {
  function isPromiseLike(a: unknown): a is Promise<any> {
    if (typeof a === "object" && a !== null) {
      const a1 = a as { then?: unknown }
      return typeof a1.then === "function"
    } else {
      return false
    }
  }

  async function capturePromiseRejection<T>(
    p: Promise<T>
  ): Promise<Result<T, unknown>> {
    try {
      return ok(await p)
    } catch (e) {
      return error(e)
    }
  }

  try {
    const returnValue = fn()
    if (isPromiseLike(returnValue)) {
      return capturePromiseRejection(returnValue)
    } else {
      return ok(returnValue)
    }
  } catch (e) {
    return error(e)
  }
}
