import { event, Subscribe } from "../src/event"

let emit!: (event: string) => void
let subscribe!: Subscribe<[string]>
let cb1!: jest.Mock
let cb2!: jest.Mock

beforeEach(() => {
    [emit, subscribe] = event<string>()
    cb1 = jest.fn()
    cb2 = jest.fn()
})

test('subscribe, emit, unsubscribe with two events', () => {
    const unsub1 = subscribe(cb1, true)
    emit('foo')
    expect(cb1).toHaveBeenLastCalledWith('foo')
    expect(cb1).toHaveBeenCalledTimes(1)
    const unsub2 = subscribe(cb2, true)
    emit('bar')
    expect(cb1).toHaveBeenLastCalledWith('bar')
    expect(cb1).toHaveBeenCalledTimes(2)
    expect(cb2).toHaveBeenLastCalledWith('bar')
    expect(cb2).toHaveBeenCalledTimes(1)
    unsub1()
    emit('baz')
    expect(cb1).toHaveBeenCalledTimes(2)
    expect(cb2).toHaveBeenLastCalledWith('baz')
    expect(cb2).toHaveBeenCalledTimes(2)
    unsub2()
    emit('quz')
    expect(cb2).toHaveBeenCalledTimes(2)
})
test('same callback subscribed multiple times', () => {
    const unsub1 = subscribe(cb1, true)
    emit('foo')
    const unsub2 = subscribe(cb1, true)
    emit('bar')
    expect(cb1).toHaveBeenCalledTimes(3)
    expect(cb1).toHaveBeenNthCalledWith(2, 'bar')
    expect(cb1).toHaveBeenLastCalledWith('bar')
    unsub1()
    emit('baz')
    expect(cb1).toHaveBeenCalledTimes(4)
    expect(cb1).toHaveBeenLastCalledWith('baz')
    unsub2()
    emit('quz')
    expect(cb1).toHaveBeenCalledTimes(4)
})
test('async operation', async () => {
    subscribe(cb1)
    await Promise.resolve() // flush microtask queue
    emit('foo')
    expect(cb1).toHaveBeenCalledTimes(0)
    await Promise.resolve()
    expect(cb1).toHaveBeenCalledTimes(1)
})
test('events dispatched to async handlers attached in the same microtask', async () => {
    subscribe(cb1)
    emit('foo')
    await Promise.resolve()
    expect(cb1).toHaveBeenCalledTimes(1)
})
test('events not dispatched to async handlers removed in the same microtask', async () => {
    const unsub = subscribe(cb1)
    await Promise.resolve()
    emit('foo')
    unsub()
    await Promise.resolve()
    expect(cb1).toHaveBeenCalledTimes(0)
})
test('once handlers unsubscribed', () => {
    const unsub = subscribe(cb1, true, true)
    emit('foo')
    emit('bar')
    expect(cb1).toHaveBeenCalledTimes(1)
})