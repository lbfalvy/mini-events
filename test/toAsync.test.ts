import { Emit, Variable, variable, Lock } from "../src";
import { toAsync } from "../src/toAsync";
import { testLock } from "./testLock";

const LOGGING = false;
const log = LOGGING ? console.log : (..._: any[]) => {};
testLock(() => {
  const lock: Lock<undefined> = toAsync<undefined>(<U>(init: U) => {
    const [set, { get, changed }] = variable<U>(init)
    return [
      (arg) => {
        log('Setting underlying value to', arg)
        set(arg)
      },
      {
        get, changed
      }
    ] as [Emit<[U]>, Variable<U>]
  }, undefined)[2]
  return async () => {
    const [release, data] = await lock()
    log('Lock acquired')
    return [
      () => {
        log('Lock released')
        release()
      },
      data
    ]
  }
})