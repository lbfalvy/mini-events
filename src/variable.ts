import { event, Subscribe } from './event'

/**
 * A variable whose updates can be observed
 * @param value default value
 * @returns [ref to data, subscriber, setter]
 */
export function variable<T>(value: T): [
    [T],
    Subscribe<[T, T|undefined]>,
    (v: T) => void
] {
    let current: [T] = [value]
    const [emit, listen] = event<T, T|undefined>()
    return [
        current,
        listen,
        v => {
            const old = current[0]
            current[0] = v
            emit(v, old)
        }
    ]
}