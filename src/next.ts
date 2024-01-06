import { Subscribe } from "./types";

/** Block until the next event arrives on the stream */
export function next<T extends any[]>(ev: Subscribe<T>): Promise<T> {
  return new Promise(res => ev((...args) => res(args), true, true))
}