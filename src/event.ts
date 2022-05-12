import { Emit, Subscribe } from "./types"

/**
 * Returns an emitter and a subscriber
 */
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
        (listener, sync, once) => {
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
