type Emit<T extends any[]> = (...args: T) => void
type Listener<T extends any[]> = (...args: T) => any
type Dispose = () => void
export type Subscribe<T extends any[]> =
    (listener: Listener<T>, sync?: boolean|void, once?: boolean|void) => Dispose

/**
 * Returns an emitter and a subscriber
 */
export function event<T0>(): [Emit<[T0]>, Subscribe<[T0]>];
export function event<T0, T1>(): [Emit<[T0, T1]>, Subscribe<[T0, T1]>];
export function event<T extends any[] = any[]>(): [Emit<T>, Subscribe<T>];
export function event<T extends any[]>(): [Emit<T>, Subscribe<T>] {
    const listeners = new Set<(args: T) => any>()
    const asyncListeners = new Set<(args: T) => any>()
    return [
        ((...args: T) => {
            listeners.forEach(listener => listener(args))
            queueMicrotask(() => {
                asyncListeners.forEach(listener => listener(args))
            })
        }) as Emit<T>,
        (listener: Listener<T>, sync?: boolean|void, once?: boolean|void) => {
            const queue = sync ? listeners : asyncListeners
            // Passing the same callback multiple times should result in multiple independent entries.
            const entry = once
                ? (e: T) => { listener(...e); queue.delete(entry) }
                : (e: T) => listener(...e)
            queue.add(entry)
            return () => { queue.delete(entry) }
        }
    ]
}