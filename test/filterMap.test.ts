import { filterMap } from "../src"
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

test('only return successfully converted integers, discard others', () => {
    const results = filterMap(subscribe, s => isNaN(parseInt(s)) ? undefined : [parseInt(s)] as const)
    results(cb1, true)
    emit(".bar")
    expect(cb1).not.toHaveBeenCalled()
    emit("1")
    expect(cb1).toHaveBeenCalledWith(1)
})