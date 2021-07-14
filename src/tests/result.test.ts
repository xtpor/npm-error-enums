import * as OptionUtils from "../option-utils"
import * as ResultUtils from "../result-utils"

import { Option } from "../option"
import { Result } from "../result"

test(".isOk()", () => {
  const a = ResultUtils.ok(42)
  expect(ResultUtils.isOk(a)).toBe(true)

  const b = ResultUtils.error("")
  expect(ResultUtils.isOk(b)).toBe(false)
})

test(".isError()", () => {
  const a = ResultUtils.ok(42)
  expect(ResultUtils.isError(a)).toBe(false)

  const b = ResultUtils.error("")
  expect(ResultUtils.isError(b)).toBe(true)
})

test(".contains()", () => {
  const a = ResultUtils.ok(42)
  expect(ResultUtils.contains(a, 42)).toBe(true)

  const b = ResultUtils.error("")
  expect(ResultUtils.contains(b, 42)).toBe(false)
})

test(".containsError()", () => {
  const a = ResultUtils.ok(42)
  expect(ResultUtils.containsError(a, "error")).toBe(false)

  const b = ResultUtils.error("error")
  expect(ResultUtils.containsError(b, "error")).toBe(true)
})

test(".toOption()", () => {
  const a = ResultUtils.ok(42)
  expect(ResultUtils.toOption(a)).toStrictEqual(OptionUtils.some(42))

  const b = ResultUtils.error("error")
  expect(ResultUtils.toOption(b)).toStrictEqual(OptionUtils.none())
})

test(".toOptionError()", () => {
  const a = ResultUtils.ok(42)
  expect(ResultUtils.toOptionError(a)).toStrictEqual(OptionUtils.none())

  const b = ResultUtils.error("error")
  expect(ResultUtils.toOptionError(b)).toStrictEqual(OptionUtils.some("error"))
})

test(".map()", () => {
  const fn = (x: number) => x + 1

  const a = ResultUtils.ok(42)
  expect(ResultUtils.map(a, fn)).toStrictEqual(ResultUtils.ok(43))

  const b = ResultUtils.error<number, string>("error")
  expect(ResultUtils.map(b, fn)).toStrictEqual(ResultUtils.error("error"))
})

test(".mapOr()", () => {
  const fn = (x: number) => x + 1

  const a = ResultUtils.ok(42)
  expect(ResultUtils.mapOr(a, 1, fn)).toStrictEqual(43)

  const b = ResultUtils.error<number, string>("error")
  expect(ResultUtils.mapOr(b, 1, fn)).toStrictEqual(1)
})

test(".mapOrElse()", () => {
  const fn = (x: number) => x + 1
  const defaults = (_s: string) => 1

  const a = ResultUtils.ok<number, string>(42)
  expect(ResultUtils.mapOrElse(a, defaults, fn)).toStrictEqual(43)

  const b = ResultUtils.error<number, string>("error")
  expect(ResultUtils.mapOrElse(b, defaults, fn)).toStrictEqual(1)
})

test(".mapError()", () => {
  const fn = (x: string) => x + " message"

  const a = ResultUtils.ok<number, string>(42)
  expect(ResultUtils.mapError(a, fn)).toStrictEqual(ResultUtils.ok(42))

  const b = ResultUtils.error<number, string>("error")
  expect(ResultUtils.mapError(b, fn)).toStrictEqual(
    ResultUtils.error("error message")
  )
})

test(".mapError()", () => {
  const a = ResultUtils.ok<number, string>(42)
  const b = ResultUtils.ok<boolean, string>(true)
  const c = ResultUtils.error<number, string>("first error")
  const d = ResultUtils.error<number, string>("last error")

  expect(ResultUtils.and(a, b)).toStrictEqual(ResultUtils.ok(true))
  expect(ResultUtils.and(b, a)).toStrictEqual(ResultUtils.ok(42))
  expect(ResultUtils.and(c, a)).toStrictEqual(ResultUtils.error("first error"))
  expect(ResultUtils.and(a, c)).toStrictEqual(ResultUtils.error("first error"))
  expect(ResultUtils.and(c, d)).toStrictEqual(ResultUtils.error("first error"))
})

test(".andThen()", () => {
  const fn = (x: number) => {
    if (x < 0) {
      return ResultUtils.error("invalid x")
    } else {
      return ResultUtils.ok(x + " apples")
    }
  }

  const a = ResultUtils.ok<number, string>(42)
  const b = ResultUtils.ok<number, string>(-1)
  const c = ResultUtils.error<number, string>("error")

  expect(ResultUtils.andThen(a, fn)).toStrictEqual(ResultUtils.ok("42 apples"))
  expect(ResultUtils.andThen(b, fn)).toStrictEqual(
    ResultUtils.error("invalid x")
  )
  expect(ResultUtils.andThen(c, fn)).toStrictEqual(ResultUtils.error("error"))
})

test(".or()", () => {
  const a = ResultUtils.ok<number, string>(42)
  const b = ResultUtils.ok<number, boolean>(1)
  const c = ResultUtils.error<number, string>("error")
  const d = ResultUtils.error<number, boolean>(false)

  expect(ResultUtils.or(a, b)).toStrictEqual(ResultUtils.ok(42))
  expect(ResultUtils.or(a, c)).toStrictEqual(ResultUtils.ok(42))
  expect(ResultUtils.or(a, d)).toStrictEqual(ResultUtils.ok(42))

  expect(ResultUtils.or(b, a)).toStrictEqual(ResultUtils.ok(1))
  expect(ResultUtils.or(b, c)).toStrictEqual(ResultUtils.ok(1))
  expect(ResultUtils.or(b, d)).toStrictEqual(ResultUtils.ok(1))

  expect(ResultUtils.or(c, a)).toStrictEqual(ResultUtils.ok(42))
  expect(ResultUtils.or(c, b)).toStrictEqual(ResultUtils.ok(1))
  expect(ResultUtils.or(c, d)).toStrictEqual(ResultUtils.error(false))

  expect(ResultUtils.or(d, a)).toStrictEqual(ResultUtils.ok(42))
  expect(ResultUtils.or(d, b)).toStrictEqual(ResultUtils.ok(1))
  expect(ResultUtils.or(d, c)).toStrictEqual(ResultUtils.error("error"))
})

test(".orElse()", () => {
  const fn = (err: boolean) =>
    err ? ResultUtils.ok(42) : ResultUtils.error("error")

  const a = ResultUtils.ok<number, boolean>(1)
  const b = ResultUtils.error<number, boolean>(true)
  const c = ResultUtils.error<number, boolean>(false)

  expect(ResultUtils.orElse(a, fn)).toStrictEqual(ResultUtils.ok(1))
  expect(ResultUtils.orElse(b, fn)).toStrictEqual(ResultUtils.ok(42))
  expect(ResultUtils.orElse(c, fn)).toStrictEqual(ResultUtils.error("error"))
})

test(".unwrap()", () => {
  const a = ResultUtils.ok(42)
  expect(ResultUtils.unwrap(a)).toStrictEqual(42)

  const b = ResultUtils.error(new Error("my error"))
  expect(() => ResultUtils.unwrap(b)).toThrow("my error")
})

test(".unwrapOr()", () => {
  const a = ResultUtils.ok(42)
  expect(ResultUtils.unwrapOr(a, 1)).toStrictEqual(42)

  const b = ResultUtils.error("error")
  expect(ResultUtils.unwrapOr(b, 1)).toStrictEqual(1)
})

test(".unwrapOrElse()", () => {
  const fn = (x: boolean) => (x ? 1 : 0)

  const a = ResultUtils.ok<number, boolean>(42)
  const b = ResultUtils.error<number, boolean>(true)
  const c = ResultUtils.error<number, boolean>(false)

  expect(ResultUtils.unwrapOrElse(a, fn)).toStrictEqual(42)
  expect(ResultUtils.unwrapOrElse(b, fn)).toStrictEqual(1)
  expect(ResultUtils.unwrapOrElse(c, fn)).toStrictEqual(0)
})

test(".unwrap()", () => {
  const a = ResultUtils.ok(new Error("my error"))
  expect(() => ResultUtils.unwrapError(a)).toThrow("my error")

  const b = ResultUtils.error(42)
  expect(ResultUtils.unwrapError(b)).toStrictEqual(42)
})

test(".transpose()", () => {
  type T = Result<Option<number>, string>
  const a: T = ResultUtils.ok(OptionUtils.some(42))
  const b: T = ResultUtils.ok(OptionUtils.none())
  const c: T = ResultUtils.error("error")

  expect(ResultUtils.transpose(a)).toStrictEqual(
    OptionUtils.some(ResultUtils.ok(42))
  )
  expect(ResultUtils.transpose(b)).toStrictEqual(OptionUtils.none())
  expect(ResultUtils.transpose(c)).toStrictEqual(
    OptionUtils.some(ResultUtils.error("error"))
  )
})

test(".flatten()", () => {
  type T = Result<Result<number, string>, string>
  const a: T = ResultUtils.ok(ResultUtils.ok(42))
  const b: T = ResultUtils.ok(ResultUtils.error("error"))
  const c: T = ResultUtils.error("error")

  expect(ResultUtils.flatten(a)).toStrictEqual(ResultUtils.ok(42))
  expect(ResultUtils.flatten(b)).toStrictEqual(ResultUtils.error("error"))
  expect(ResultUtils.flatten(c)).toStrictEqual(ResultUtils.error("error"))
})

test(".intoOkOrError()", () => {
  const a = ResultUtils.ok<number, number>(1)
  const b = ResultUtils.error<number, number>(2)

  expect(ResultUtils.intoOkOrError(a)).toBe(1)
  expect(ResultUtils.intoOkOrError(b)).toBe(2)
})

test(".tryCatch()", () => {
  const sync1 = () => {
    return 1
  }

  const sync2 = () => {
    throw 2
  }

  const async3 = async () => {
    return 3
  }

  const async4 = async () => {
    throw 4
  }

  expect(ResultUtils.tryCatch(sync1)).toStrictEqual(ResultUtils.ok(1))
  expect(ResultUtils.tryCatch(sync2)).toStrictEqual(ResultUtils.error(2))
  expect(ResultUtils.tryCatch(async3)).resolves.toStrictEqual(ResultUtils.ok(3))
  expect(ResultUtils.tryCatch(async4)).resolves.toStrictEqual(
    ResultUtils.error(4)
  )
})
