import { Subscribe } from "./types";
import { event } from "./event";

/**
 * Transform an event stream and discard any undefined values from the output
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
