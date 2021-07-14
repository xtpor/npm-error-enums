import * as OptionUtils from "../option-utils"
import * as ResultUtils from "../result-utils"

import { Option } from "../option"
import { Result } from "../result"

test(".isSome()", () => {
  const a = OptionUtils.some(42)
  expect(OptionUtils.isSome(a)).toBe(true)

  const b = OptionUtils.none()
  expect(OptionUtils.isSome(b)).toBe(false)
})

test(".isNone()", () => {
  const a = OptionUtils.some(42)
  expect(OptionUtils.isNone(a)).toBe(false)

  const b = OptionUtils.none()
  expect(OptionUtils.isNone(b)).toBe(true)
})

test(".contains()", () => {
  const a = OptionUtils.some(42)
  expect(OptionUtils.contains(a, 42)).toBe(true)

  const b = OptionUtils.none()
  expect(OptionUtils.contains(b, 42)).toBe(false)
})

test(".unwrap()", () => {
  const a = OptionUtils.some(42)
  expect(OptionUtils.unwrap(a)).toBe(42)

  const t = () => {
    const b = OptionUtils.none()
    return OptionUtils.unwrap(b)
  }
  expect(t).toThrow("failed to unwrap because the argument is None")
})

test(".unwrapOr()", () => {
  const a = OptionUtils.some(42)
  expect(OptionUtils.unwrapOr(a, 1)).toBe(42)

  const b = OptionUtils.none()
  expect(OptionUtils.unwrapOr(b, 1)).toBe(1)
})

test(".unwrapOrElse()", () => {
  const a = OptionUtils.some(42)
  expect(OptionUtils.unwrapOrElse(a, () => 1)).toBe(42)

  const b = OptionUtils.none()
  expect(OptionUtils.unwrapOrElse(b, () => 1)).toBe(1)
})

test(".map()", () => {
  const a = OptionUtils.some(42)
  expect(OptionUtils.map(a, (x) => x + 1)).toEqual(OptionUtils.some(43))

  const b = OptionUtils.none<number>()
  expect(OptionUtils.map(b, (x) => x + 1)).toEqual(OptionUtils.none())
})

test(".mapOr()", () => {
  const a = OptionUtils.some(42)
  expect(OptionUtils.mapOr(a, 1, (x) => x + 1)).toEqual(43)

  const b = OptionUtils.none<number>()
  expect(OptionUtils.mapOr(b, 1, (x) => x + 1)).toEqual(1)
})

test(".mapOrElse()", () => {
  const a = OptionUtils.some(42)
  expect(
    OptionUtils.mapOrElse(
      a,
      () => 1,
      (x) => x + 1
    )
  ).toEqual(43)

  const b = OptionUtils.none<number>()
  expect(
    OptionUtils.mapOrElse(
      b,
      () => 1,
      (x) => x + 1
    )
  ).toEqual(1)
})

test(".toResult()", () => {
  const a = OptionUtils.some(42)
  expect(OptionUtils.toResult(a, "error")).toEqual(ResultUtils.ok(42))

  const b = OptionUtils.none<number>()
  expect(OptionUtils.toResult(b, "error")).toEqual(ResultUtils.error("error"))
})

test(".toResultElse()", () => {
  const a = OptionUtils.some(42)
  expect(OptionUtils.toResultElse(a, () => "error")).toEqual(ResultUtils.ok(42))

  const b = OptionUtils.none<number>()
  expect(OptionUtils.toResultElse(b, () => "error")).toEqual(
    ResultUtils.error("error")
  )
})

test(".and()", () => {
  const a = OptionUtils.some(1)
  const b = OptionUtils.some(2)
  const c = OptionUtils.none<number>()

  expect(OptionUtils.and(a, b)).toEqual(b)
  expect(OptionUtils.and(a, c)).toEqual(c)
  expect(OptionUtils.and(c, a)).toEqual(c)
  expect(OptionUtils.and(c, c)).toEqual(c)
})

test(".andThen()", () => {
  const a = OptionUtils.some(1)
  const b = OptionUtils.some(2)
  const c = OptionUtils.none<number>()

  const fn = (x: number) =>
    x === 1 ? OptionUtils.some(x + 1) : OptionUtils.none()

  expect(OptionUtils.andThen(a, fn)).toEqual(b)
  expect(OptionUtils.andThen(b, fn)).toEqual(c)
  expect(OptionUtils.andThen(c, fn)).toEqual(c)
})

test(".filter()", () => {
  const a = OptionUtils.some(1)
  const b = OptionUtils.some(2)
  const c = OptionUtils.none<number>()

  const isEven = (x: number) => x % 2 === 0

  expect(OptionUtils.filter(a, isEven)).toEqual(c)
  expect(OptionUtils.filter(b, isEven)).toEqual(b)
  expect(OptionUtils.filter(c, isEven)).toEqual(c)
})

test(".or()", () => {
  const a = OptionUtils.some(1)
  const b = OptionUtils.some(2)
  const c = OptionUtils.none<number>()

  expect(OptionUtils.or(a, b)).toEqual(a)
  expect(OptionUtils.or(a, c)).toEqual(a)
  expect(OptionUtils.or(c, a)).toEqual(a)
  expect(OptionUtils.or(c, c)).toEqual(c)
})

test(".orElse()", () => {
  const a = OptionUtils.some(1)
  const b = OptionUtils.some(2)
  const c = OptionUtils.none<number>()

  expect(OptionUtils.orElse(a, () => b)).toEqual(a)
  expect(OptionUtils.orElse(a, () => c)).toEqual(a)
  expect(OptionUtils.orElse(c, () => a)).toEqual(a)
  expect(OptionUtils.orElse(c, () => c)).toEqual(c)
})

test(".xor()", () => {
  const a = OptionUtils.some(1)
  const b = OptionUtils.some(2)
  const c = OptionUtils.none<number>()

  expect(OptionUtils.xor(a, b)).toEqual(c)
  expect(OptionUtils.xor(a, c)).toEqual(a)
  expect(OptionUtils.xor(c, b)).toEqual(b)
  expect(OptionUtils.xor(c, c)).toEqual(c)
})

test(".zip()", () => {
  const a = OptionUtils.some(1)
  const b = OptionUtils.some(2)
  const c = OptionUtils.none<number>()
  const d = OptionUtils.some([1, 2])

  expect(OptionUtils.zip(a, b)).toEqual(d)
  expect(OptionUtils.zip(a, c)).toEqual(c)
  expect(OptionUtils.zip(c, b)).toEqual(c)
  expect(OptionUtils.zip(c, c)).toEqual(c)
})

test(".zipWith()", () => {
  const a = OptionUtils.some(1)
  const b = OptionUtils.some(2)
  const c = OptionUtils.none<number>()
  const d = OptionUtils.some({ left: 1, right: 2 })

  const fn = (a: number, b: number) => ({ left: a, right: b })

  expect(OptionUtils.zipWith(a, b, fn)).toEqual(d)
  expect(OptionUtils.zipWith(a, c, fn)).toEqual(c)
  expect(OptionUtils.zipWith(c, b, fn)).toEqual(c)
  expect(OptionUtils.zipWith(c, c, fn)).toEqual(c)
})

test(".transpose()", () => {
  const a = OptionUtils.some(ResultUtils.ok(42))
  const b = OptionUtils.some(ResultUtils.error("error"))
  const c = OptionUtils.none<Result<string, number>>()

  const a0 = ResultUtils.ok(OptionUtils.some(42))
  const b0 = ResultUtils.error("error")
  const c0 = ResultUtils.ok(OptionUtils.none())

  expect(OptionUtils.transpose(a)).toEqual(a0)
  expect(OptionUtils.transpose(b)).toEqual(b0)
  expect(OptionUtils.transpose(c)).toEqual(c0)
})

test(".flatten()", () => {
  type t = Option<Option<number>>
  type t0 = Option<number>

  const a: t = OptionUtils.some(OptionUtils.some(42))
  const b: t = OptionUtils.some(OptionUtils.none())
  const c: t = OptionUtils.none()

  const a0: t0 = OptionUtils.some(42)
  const b0: t0 = OptionUtils.none()
  const c0: t0 = OptionUtils.none()

  expect(OptionUtils.flatten(a)).toEqual(a0)
  expect(OptionUtils.flatten(b)).toEqual(b0)
  expect(OptionUtils.flatten(c)).toEqual(c0)
})
