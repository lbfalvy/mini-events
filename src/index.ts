type Emit<T> = void extends T
    ? (event?: T) => void
    : (event: T) => void
type Listener<T> = (event: T) => any
type Dispose = () => void
export type Subscribe<T> = (listener: Listener<T>, sync?: boolean|void) => Dispose

export function event<T = any>(): [Emit<T>, Subscribe<T>] {
    const listeners = new Set<(event: T) => any>()
    const asyncListeners = new Set<(event: T) => any>()
    return [
        ((event: T) => {
            listeners.forEach(listener => listener(event))
            queueMicrotask(() => {
                asyncListeners.forEach(listener => listener(event))
            })
        }) as Emit<T>,
        (listener: Listener<T>, sync?: boolean|void) => {
            // Passing the same callback multiple times should result in multiple independent entries.
            const entry = (e: T) => listener(e)
            const queue = sync ? listeners : asyncListeners
            queue.add(entry)
            return () => { queue.delete(entry) }
        }
    ]
}