import { Emit, Variable, variable, Lock } from "../src";
import { toAsync } from "../src/toAsync";
import { testLock } from "./testLock";

testLock(() => {
    const lock: Lock<undefined> = toAsync<undefined>(<U>(init: U) => {
        const [set, { get, changed }] = variable<U>(init)
        return [
            (arg) => {
                console.log('Setting underlying value to', arg)
                set(arg)
            },
            {
                get, changed
            }
        ] as [Emit<[U]>, Variable<U>]
    }, undefined)[2]
    return async () => {
        const [release, data] = await lock()
        console.log('Lock acquired')
        return [
            () => {
                console.log('Lock released')
                release()
            },
            data
        ]
    }
})