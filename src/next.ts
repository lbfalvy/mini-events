import { Subscribe } from "./types";

export function next<T extends any[]>(ev: Subscribe<T>): Promise<T> {
  return new Promise(res => ev((...args) => res(args), true, true))
}