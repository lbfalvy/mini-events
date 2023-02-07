import { event } from "../src/event"
import { filter } from "../src/filter"
import { map } from "../src/map"
import { Subscribe } from "../src/types"

let emit!: (event: string) => void
let subscribe!: Subscribe<[string]>
let cb1!: jest.Mock

beforeEach(() => {
  [emit, subscribe] = event<[string]>()
  cb1 = jest.fn()
})

test('only return strings starting with a dot', () => {
  const results = filter(subscribe, s => s.startsWith('.'))
  results(cb1, true)
  emit("1")
  expect(cb1).not.toHaveBeenCalled()
  emit(".bar")
  expect(cb1).toHaveBeenCalledWith('.bar')
})
