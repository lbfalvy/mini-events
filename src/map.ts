import { event } from "./event";
import { Subscribe } from "./types";

/**
 * Transform the elements of an event stream
 * @param source Incoming event stream
 * @param predicate Mapping that returns a tuple
 * @returns Stream of return values
 */
export function map<T extends any[], U extends any[]>(
    source: Subscribe<T>,
    predicate: (...args: T) => U
): Subscribe<U> {
    const [emit, subscribe] = event<U>()
    source((...args) => emit(...predicate(...args)), true)
    return subscribe
}