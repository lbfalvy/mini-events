/** Trigger an event */
export type Emit<T extends readonly any[]> = (...args: T) => void

/** Attach a subscriber to an event.
 * 
 * Returns a function that disconnects the subscriber. Subscriptions are async by default but
 * synchronous subscriptions are possible with the flag
 */
export type Subscribe<T extends readonly any[]> = (
  listener: (...args: T) => any,
  sync?: boolean|void,
  once?: boolean|void
) => () => void

/** A value changing over time.
 * 
 * Represented by a getter and an event that emits the new and old values when the value changes.
 */
export type Variable<T> = {
  get: () => T,
  changed: Subscribe<[T, T]>
}

export type AsyncEmit<T extends readonly any[]> = (...args: T) => Promise<void>

export type AsyncVariable<T> = {
  get: () => Promise<T>,
  changed: Subscribe<[T, T]>
}

export type Lock<T> = () => Promise<[() => void, T]>