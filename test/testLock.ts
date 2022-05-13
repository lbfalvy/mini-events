import { Lock } from '../src/types'

function flushMtq(): Promise<void> {
    return new Promise(r => setTimeout(r, 0))
}

export function testLock(mklck: () => Lock<unknown>) {
    test('locks work', async () => {
        const lock = mklck()
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
        const lock = mklck()
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
}