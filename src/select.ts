import { Variable } from "./types";
import { variable } from "./variable";

/** Select a subvalue from a variable.
 * 
 * Whenever the source changes, the mapper is used to get the new value of the selected variable.
 * Change events for the selected variable are only emitted when the mapper returns a new value.
 * 
 * The update listener is disconnected when the selected variable is GC'd, so it's safe to derive
 * many short-lived variables from a very long-lived variable.
 */
export function select<T, U>(t_var: Variable<T>, predicate: (t: T) => U): Variable<U> {
  let [update, ret] = variable(predicate(t_var.get()))
  const disconnect = t_var.changed(next => update(predicate(next)), true);
  const reg = new FinalizationRegistry(disconnect);
  reg.register(ret, undefined);
  return ret
}