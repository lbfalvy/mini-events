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
    let mutex: Subscribe<[]> | undefined
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
            const obtain = () => {
                const [release, onRelease] = event()
                onRelease(() => {
                    if (mutex == onRelease) mutex = undefined
                }, true, true)
                mutex = onRelease
                res([release, current])
            }
            if (!mutex) obtain()
            else mutex(obtain, false, true)
        })
    ]
}
