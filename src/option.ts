export type Some<T> = { kind: "some"; value: T }
export type None = { kind: "none" }
export type Option<T> = Some<T> | None

export function some<T>(value: T): Option<T> {
  return { kind: "some", value: value }
}

export function none<T>(): Option<T> {
  return { kind: "none" }
}

export function isSome<T>(opt: Option<T>): opt is Some<T> {
  return opt.kind === "some"
}

export function isNone<T>(opt: Option<T>): opt is None {
  return opt.kind === "none"
}
