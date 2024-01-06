import { Subscribe } from "./types";

/** Convert an async iterable into an event stream */
export function fromAsyncIterable<T>(
  it: AsyncIterable<T>
): Subscribe<[T]> {
  return (cb, _, once) => {
    let stop = false;
    const disable = () => { stop = true; };
    if (once) {
      const oldcb = cb;
      cb = t => { disable(); oldcb(t); };
    }
    (async () => {
      for await (const ev of it) {
        if (stop) return;
        cb(ev);
      }
    })();
    return disable;
  };
}