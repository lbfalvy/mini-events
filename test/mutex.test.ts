import { mutex } from "../src/mutex";
import { testLock } from "./testLock";
import { asyncVariable } from "../src";

testLock(() => {
  const [set, { changed }] = asyncVariable<number>(0)
  const lock = mutex(set, changed)
  return () => lock().then(release => [release, null])
})