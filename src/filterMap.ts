import { Subscribe } from "./types";
import { event } from "./event";

/**
 * Filter an event
 */
export function filterMap<T extends readonly any[], U extends readonly any[]>(
  source: Subscribe<T>,
  predicate: (...args: T) => U | undefined
): Subscribe<U> {
  const [emit, subscribe] = event<U>()
  source((...args) => {
    const result = predicate(...args);
    if (result !== undefined) emit(...result)
  }, true)
  return subscribe;
}
