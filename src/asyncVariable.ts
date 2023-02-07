import { event } from './event'
import { AsyncEmit, AsyncVariable, Emit, Lock, Subscribe } from './types'

/**
 * A variable whose updates can be observed
 * @param value default value
 * @returns [setter, getter, subscriber]
 */
export function asyncVariable<T>(value: T): [AsyncEmit<[T]>, AsyncVariable<T>, Lock<T>];
export function asyncVariable<T>(): [AsyncEmit<[T | undefined]>, AsyncVariable<T | undefined>, Lock<T | undefined>]
export function asyncVariable<T>(
  value?: T
): [AsyncEmit<[T | undefined]>, AsyncVariable<T | undefined>, Lock<T | undefined>] {
  let current: T | undefined = value
  // Subscribe of latest lock request's release
  let mutexTail: Subscribe<[]> | undefined
  const [emit, changed] = event<[T | undefined, T | undefined]>()
  return [
    v => {
      const old = current
      current = v
      emit(v, old)
      return Promise.resolve()
    },
    { get: () => Promise.resolve(current), changed },
    () => new Promise(res => {
      const [release, onRelease] = event() // New release event
      onRelease(() => {
        if (mutexTail == onRelease) mutexTail = undefined
      }, true, true) // Clear lock if last
      // Acquisition yields release and latest value
      const acquire = () => res([release, current])
      if (!mutexTail) acquire() // Instantly acquire if clear
      else mutexTail(acquire, false, true) // Enqueue otherwise
      mutexTail = onRelease // Update tail
    })
  ]
}
