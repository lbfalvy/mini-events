import { event } from './event'
import { Emit, Variable } from './types'

/**
 * A variable whose updates can be observed
 * @param value default value
 * @returns [setter, getter, subscriber]
 */
export function variable<T>(value: T): [Emit<[T]>, Variable<T>];
export function variable<T>(): [Emit<[T | undefined]>, Variable<T | undefined>]
export function variable<T>(value?: T): [Emit<[T | undefined]>, Variable<T | undefined>] {
  let current: T | undefined = value
  const [emit, changed] = event<[T | undefined, T | undefined]>()
  return [
    v => {
      if (v === current) return
      const old = current
      current = v
      emit(v, old)
    },
    { get: () => current, changed }
  ]
}
