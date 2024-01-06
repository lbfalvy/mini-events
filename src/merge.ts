import { Subscribe } from "./types";

/** Merge events of identical type into an event that fires when either constituent fires */
export function merge<T extends readonly any[]>(...argv: Subscribe<T>[]): Subscribe<T> {
  return (cb, sync, once) => {
    const unsubs = argv.map(f => f(cb, sync, once));
    return () => { unsubs.map(f => f()) };
  };
}