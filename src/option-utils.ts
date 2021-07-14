import { Option, some, none, isSome, isNone } from "./option"
import { Result, ok, error, isOk } from "./result"

export { some, none, isSome, isNone }

export function contains<T>(opt: Option<T>, value: T): boolean {
  return isSome(opt) && opt.value === value
}

export function unwrap<T>(opt: Option<T>): T {
  if (isSome(opt)) {
    return opt.value
  } else {
    throw new Error("failed to unwrap because the argument is None")
  }
}

export function unwrapOr<T>(opt: Option<T>, defaults: T): T {
  if (isSome(opt)) {
    return opt.value
  } else {
    return defaults
  }
}

export function unwrapOrElse<T>(opt: Option<T>, defaults: () => T): T {
  if (isSome(opt)) {
    return opt.value
  } else {
    return defaults()
  }
}

export function map<T, U>(opt: Option<T>, fn: (inner: T) => U): Option<U> {
  if (isSome(opt)) {
    return some(fn(opt.value))
  } else {
    return opt
  }
}

export function mapOr<T, U>(
  opt: Option<T>,
  defaults: U,
  fn: (inner: T) => U
): U {
  if (isSome(opt)) {
    return fn(opt.value)
  } else {
    return defaults
  }
}

export function mapOrElse<T, U>(
  opt: Option<T>,
  defaults: () => U,
  fn: (inner: T) => U
): U {
  if (isSome(opt)) {
    return fn(opt.value)
  } else {
    return defaults()
  }
}

export function toResult<T, E>(opt: Option<T>, err: E): Result<T, E> {
  if (isSome(opt)) {
    return ok(opt.value)
  } else {
    return error(err)
  }
}

export function toResultElse<T, E>(opt: Option<T>, err: () => E): Result<T, E> {
  if (isSome(opt)) {
    return ok(opt.value)
  } else {
    return error(err())
  }
}

export function and<T, U>(opt: Option<T>, opt2: Option<U>): Option<U> {
  if (isSome(opt)) {
    return opt2
  } else {
    return opt
  }
}

export function andThen<T, U>(
  opt: Option<T>,
  fn: (inner: T) => Option<U>
): Option<U> {
  if (isSome(opt)) {
    return fn(opt.value)
  } else {
    return none()
  }
}

export function filter<T>(
  opt: Option<T>,
  fn: (inner: T) => boolean
): Option<T> {
  if (isSome(opt)) {
    if (fn(opt.value)) {
      return opt
    } else {
      return none()
    }
  } else {
    return none()
  }
}

export function or<T>(opt: Option<T>, opt2: Option<T>): Option<T> {
  if (isSome(opt)) {
    return opt
  } else {
    return opt2
  }
}

export function orElse<T>(opt: Option<T>, fn: () => Option<T>): Option<T> {
  if (isSome(opt)) {
    return opt
  } else {
    return fn()
  }
}

export function xor<T>(opt: Option<T>, opt2: Option<T>): Option<T> {
  if (isSome(opt)) {
    if (isSome(opt2)) {
      return none()
    } else {
      return some(opt.value)
    }
  } else {
    if (isSome(opt2)) {
      return some(opt2.value)
    } else {
      return none()
    }
  }
}

export function zip<T, U>(opt: Option<T>, opt2: Option<U>): Option<[T, U]> {
  if (isSome(opt) && isSome(opt2)) {
    return some([opt.value, opt2.value])
  } else {
    return none()
  }
}

export function zipWith<T, U, R>(
  opt: Option<T>,
  opt2: Option<U>,
  fn: (a: T, b: U) => R
): Option<R> {
  if (isSome(opt) && isSome(opt2)) {
    return some(fn(opt.value, opt2.value))
  } else {
    return none()
  }
}

export function transpose<T, E>(
  opt: Option<Result<T, E>>
): Result<Option<T>, E> {
  if (isSome(opt)) {
    const inner = opt.value
    if (isOk(inner)) {
      return ok(some(inner.value))
    } else {
      return error(inner.error)
    }
  } else {
    return ok(none())
  }
}

export function flatten<T>(opt: Option<Option<T>>): Option<T> {
  if (isSome(opt)) {
    return opt.value
  } else {
    return none()
  }
}
