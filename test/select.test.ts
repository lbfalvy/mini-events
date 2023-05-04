import { variable } from "../src"
import { select } from "../src/select";

test('tracks subvalue', () => {
  const [set, original] = variable([1, 2]);
  const sub = select(original, t => t[1]);
  const cb = jest.fn()
  sub.changed(cb, true)
  expect(sub.get()).toBe(2)
  set([3, 4])
  expect(cb).toHaveBeenLastCalledWith(4, 2)
  set([5, 4, 3, 2, 1])
  expect(cb).toHaveBeenCalledTimes(1)
  set([1, 1])
  expect(cb).toHaveBeenCalledTimes(2)
  expect(cb).toHaveBeenLastCalledWith(1, 4)
})