import { event } from "../src/event"
import { map } from "../src/map"
import { Subscribe } from "../src/types"

let emit!: (event: string) => void
let subscribe!: Subscribe<[string]>
let cb1!: jest.Mock

beforeEach(() => {
    [emit, subscribe] = event<[string]>()
    cb1 = jest.fn()
})

test('change strings to numbers', () => {
    const results = map(subscribe, s => [Number.parseFloat(s)])
    results(cb1, true)
    emit("1")
    expect(cb1).toHaveBeenCalledWith(1)
    emit("0.5")
    expect(cb1).toHaveBeenCalledWith(0.5)
})