import { Variable } from "./types";
import { variable } from "./variable";

export function select<T, U>(t_var: Variable<T>, predicate: (t: T) => U): Variable<U> {
  let [update, ret] = variable(predicate(t_var.get()))
  t_var.changed(next => update(predicate(next)), true)
  return ret
}