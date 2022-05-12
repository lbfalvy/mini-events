import { asyncVariable } from "../src/asyncVariable"

function flushMtq(): Promise<void> {
    return new Promise(r => setTimeout(r, 0))
}

test('value updated and relayed asynchronously', async () => {
    const [set, { get, changed }] = asyncVariable('foo')
    expect(get()).resolves.toBe('foo')
    const cb = jest.fn()
    changed(cb, true)
    await set('bar')
    expect(cb).toHaveBeenCalledWith('bar', 'foo')
    expect(get()).resolves.toBe('bar')
})
test('locks work', async () => {
    const [_1, _2, lock] = asyncVariable()
    const [release] = await lock()
    const cb = jest.fn()
    const p = lock()
    p.then(cb)
    await flushMtq()
    expect(cb).not.toHaveBeenCalled()
    release()
    await flushMtq()
    expect(cb).toHaveBeenCalled()
    const [release2] = await p
    release2()
    const cb2 = jest.fn()
    lock().then(cb2)
    await flushMtq()
    expect(cb).toHaveBeenCalled()
})
test('Multi-contest', async () => {
    const [_1, _2, lock] = asyncVariable()
    const [release] = await lock()
    const cb1 = jest.fn()
    const cb2 = jest.fn()
    lock().then(cb1)
    lock().then(cb2)
    release()
    await flushMtq()
    expect(cb1).toHaveBeenCalled()
    expect(cb2).not.toHaveBeenCalled()
})
