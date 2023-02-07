export type Emit<T extends readonly any[]> = (...args: T) => void

export type Subscribe<T extends readonly any[]> = (
  listener: (...args: T) => any,
  sync?: boolean|void,
  once?: boolean|void
) => () => void

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