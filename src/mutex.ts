import { Subscribe } from "./types"

export function mutex(
  set: (n: number) => Promise<void>,
  changed: Subscribe<[number, number]>
): () => Promise<() => void> {
  const log = (..._: any[]) => {};
  return () => new Promise((resolve, reject) => {
    const huid = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 1)) + 1
    let contested = false
    let released = false
    const onThrow = () => {
      unsub()
      reject()
    }
    const unsub = changed((fresh, old) => {
      if (fresh == huid) {
        if (old == 0) {
          log(huid, 'acquired')
          contested = false
          unsub()
          resolve(() => {
            log(huid, 'released')
            if (released) throw new Error('Double release')
            released = true
            set(0)
          })
        } else {
          log(huid, 'contested')
          contested = true
        }
      } else if (fresh == 0) {
        if (contested) {
          log(huid, 'reactivated')
          set(huid).catch(onThrow)
        }
      }
    })
    set(huid).catch(onThrow)
  })
}