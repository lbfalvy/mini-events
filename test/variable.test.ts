import { variable } from "../src/variable"

test('value updated and relayed', () => {
    const [set, get, sub] = variable('foo')
    expect(get()).toBe('foo')
    const cb = jest.fn()
    sub(cb, true)
    set('bar')
    expect(cb).toHaveBeenCalledWith('bar', 'foo')
    expect(get()).toBe('bar')
})