import { event, Subscribe } from './event'

export type Variable<T> = [
    (v: T) => void,
    () => T,
    Subscribe<[T, T]>
]

/**
 * A variable whose updates can be observed
 * @param value default value
 * @returns [setter, getter, subscriber]
 */
export function variable<T>(value: T): Variable<T> {
    let current: [T] = [value]
    const [emit, listen] = event<T, T>()
    return [
        v => {
            const old = current[0]
            current[0] = v
            emit(v, old)
        },
        () => current[0],
        listen
    ]
}