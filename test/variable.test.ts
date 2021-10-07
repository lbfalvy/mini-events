import variable from "../src/variable"

test('value updated and relayed', () => {
    const [data, sub, set] = variable('foo')
    expect(data[0]).toBe('foo')
    const cb = jest.fn()
    sub(cb, true)
    set('bar')
    expect(cb).toHaveBeenCalledWith('bar', 'foo')
    expect(data[0]).toBe('bar')
})