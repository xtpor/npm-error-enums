export type Ok<T> = { kind: "ok"; value: T }
export type Error<E> = { kind: "error"; error: E }
export type Result<T, E> = Ok<T> | Error<E>

export function ok<T, E>(value: T): Result<T, E> {
  return { kind: "ok", value: value }
}

export function error<T, E>(error: E): Result<T, E> {
  return { kind: "error", error: error }
}

export function isOk<T, E>(res: Result<T, E>): res is Ok<T> {
  return res.kind === "ok"
}

export function isError<T, E>(res: Result<T, E>): res is Error<E> {
  return res.kind === "error"
}
