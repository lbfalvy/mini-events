import { mutex } from "../src/mutex";
import { event } from '../src/event';
import { testLock } from "./testLock";
import { asyncVariable } from "../src";

const wait = async (ms: number) => new Promise(r => setTimeout(r, ms)) 

testLock(() => {
    const [set, { changed }] = asyncVariable<number>(0)
    const lock = mutex(set, changed)
    return () => lock().then(release => [release, null])
})