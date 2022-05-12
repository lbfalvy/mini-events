import { event } from './event'
import { AsyncEmit, AsyncVariable } from './types'

/**
 * A variable whose updates can be observed
 * @param value default value
 * @returns [setter, getter, subscriber]
 */
export function asyncVariable<T>(value: T): [AsyncEmit<[T]>, AsyncVariable<T>];
export function asyncVariable<T>(): [AsyncEmit<[T | undefined]>, AsyncVariable<T | undefined>]
export function asyncVariable<T>(
    value?: T
): [AsyncEmit<[T | undefined]>, AsyncVariable<T | undefined>] {
    let current: T | undefined = value
    const [emit, changed] = event<[T | undefined, T | undefined]>()
    return [
        v => {
            const old = current
            current = v
            emit(v, old)
            return Promise.resolve()
        },
        { get: () => Promise.resolve(current), changed }
    ]
}
