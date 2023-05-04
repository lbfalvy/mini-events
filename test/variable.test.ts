import { variable } from "../src/variable"

test('value updated and relayed', () => {
  const [set, { get, changed }] = variable('foo')
  expect(get()).toBe('foo')
  const cb = jest.fn()
  changed(cb, true)
  set('bar')
  expect(cb).toHaveBeenCalledWith('bar', 'foo')
  expect(get()).toBe('bar')
})

test('no change event if equal', () => {
  const [set, { get, changed }] = variable('foo')
  const cb = jest.fn()
  changed(cb, true)
  set('foo')
  expect(cb).toHaveBeenCalledTimes(0)
  set('bar')
  expect(cb).toHaveBeenCalledTimes(1)
  set('bar')
  expect(cb).toHaveBeenCalledTimes(1)
})