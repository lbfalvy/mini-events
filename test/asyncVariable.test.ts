import { asyncVariable } from "../src/asyncVariable"
import { testLock } from "./testLock"

test('value updated and relayed asynchronously', async () => {
  const [set, { get, changed }] = asyncVariable('foo')
  expect(get()).resolves.toBe('foo')
  const cb = jest.fn()
  changed(cb, true)
  await set('bar')
  expect(cb).toHaveBeenCalledWith('bar', 'foo')
  expect(get()).resolves.toBe('bar')
})

testLock(() => asyncVariable()[2])