import { filter } from "./filter";
import { map } from "./map";
import { AsyncEmit, AsyncVariable, Lock, Emit, Variable } from "./types";

interface AsyncState<T> {
  semaphore: number
  value: T
}

/** Create an async variable from a sync variable.
 * 
 * This is needed because sync and async variables have very different APIs so it's impractical
 * for an async-based API to also support a sync variable directly.
 */
export function toAsync<T>(
  sync: <U>(init: U) => [Emit<[U]>, Variable<U>],
  init: undefined extends T ? T|void : T
): [AsyncEmit<[T]>, AsyncVariable<T>, Lock<T>] {
  const initState: AsyncState<T> = { semaphore: 1, value: init as T }
  const [set, { get, changed }] = sync(initState)
  const release = () => {
    const { semaphore, ...oldVal } = get()
    set({ ...oldVal, semaphore: semaphore + 1, })
  }
  return [
    value => Promise.resolve(set({ ...get(), value })),
    {
      get: () => Promise.resolve(get().value),
      changed: map(
        filter<[AsyncState<T>, AsyncState<T>]>(
          changed, 
          (fresh, old) => fresh.semaphore == old.semaphore
        ),
        (fresh, old) => [fresh.value, old.value]
      )
    },
    () => new Promise(resolve => {
      const { semaphore, ...oldVal } = get();
      set({ ...oldVal, semaphore: semaphore - 1 })
      if (get().semaphore >= 0) {
        resolve([release, get().value])
      } else {
        let place = get().semaphore
        changed((fresh, old) => {
          // Ignore wait and value change
          if (fresh.semaphore <= old.semaphore) return
          // Move ahead in line, if at front, grant access
          if (++place == 0) resolve([release, get().value])
        })
      }
    })
  ]
}
