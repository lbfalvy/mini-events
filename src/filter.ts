import { Subscribe } from "./types";
import { event } from "./event";

/**
 * Filter an event
 */
export function filter<T, U extends T>(source: Subscribe<[T]>, predicate: (arg: T) => arg is U): Subscribe<[U]>
export function filter<T extends readonly any[]>(source: Subscribe<T>, predicate: (...args: T) => boolean): Subscribe<T>
export function filter<T extends readonly any[]>(
    source: Subscribe<T>,
    predicate: (...args: T) => boolean
): Subscribe<T> {
    const [emit, subscribe] = event<T>()
    source((...args) => {
        if (predicate(...args)) emit(...args)
    }, true)
    return subscribe;
}
