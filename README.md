# mini-events <!-- omit in toc -->

Simplified event stream and state management

## Table of Contents <!-- omit in toc -->
- [Usage](#usage)
- [Timing guarantees](#timing-guarantees)
- [variable](#variable)
- [asyncVariable](#asyncvariable)
- [Helper functions](#helper-functions)
  - [filter](#filter)
  - [map](#map)
    - [filterMap](#filtermap)
  - [merge](#merge)
  - [next](#next)
  - [select](#select)
  - [toAsync](#toasync)
  - [fromAsyncIterable](#fromasynciterable)

## Usage
Obtain an emit-subscribe pair using the `event` factory method
```ts
const [emit, subscribe] = event<[EventType]>()
```

Subscribe by passing a callback to the second function returned by `event`
```ts
const [emit, subscribe] = event<[EventType]>()
subscribe(e => ...)
```

Subscribe synchronously by passing `true` as the second argument. A synchronous handler will
execute before emit would return. Use them sparingly, only attach very short handlers
synchronously.
```ts
const [emit, subscribe] = event<[EventType]>()
subscribe(e => ..., true)
```

Emit an event by calling the first function returned by `event`
```ts
const [emit, subscribe] = event<[EventType]>()
emit(...)
```

Unsubscribe by calling the function returned by the subscribe call.
```ts
const [emit, subscribe] = event<[EventType]>()
const unsubscribe = subscribe(e => ...)
unsubscribe()
```

Multi-parameter calls
```ts
const [emit, subscribe] = event<[A, B]>()
const unsubscribe = subscribe((a, b) => ...)
emit(a, b)
```

## Timing guarantees
- An event handler MAY receive events emitted before the subscribe call.
- An event handler MUST receive events emitted after the subscribe call.
- An event handler MUST NOT receive events emitted after the unsubscribe call.
- An event handler MAY NOT receive events emitted before the unsubscribe call.
- An event handler subscribed in a given microtask MUST receive all events that a handler
unsubscribed on the same microtask would not receive.
- Flushing the microtask queue once MUST result in every event handler's completion.

## variable
A little addition that I havve come to need quite often.
`changed` is only fired if the new value doesn't `===` the previous value.
```ts
const [set, { get, changed }] = variable('default')
get() // ='default'
changed(console.log)
set('foo') // > 'foo', 'default'
get() // ='foo'
```
Same guarantees apply as with event

## asyncVariable
Changing state with asynchronity. The API expects locking support
```ts
const [set, { get, changed }, lock] = asyncVariable('default')
await get() // ='default'
await set('foo')
await get() // ='foo'
const [release, value] = await lock() // resolve after the last call's release has been called 
```

## Helper functions

### filter
```ts
const [emit, subscribe] = event<[string]>()
const filtered = filter(subscribe, s => s.startsWith('.'))
emit('foo') // nothing
emit('.foo') // > '.foo'
```

### map
```ts
const [emit, subscribe] = event<[string]>()
const mapped = map(subscribe, s => [Number.parseFloat(s)])
emit('0') // > 0
emit('0.5') // > 0.5
emit('meow') // > NaN
```

#### filterMap
Same as map except the function can return undefined to indicate that no event should be mapped. This functionality isn't included in map because accidentally returning undefined is a common JS
mistake

### merge
```ts
const [emit1, subscribe1] = event<[string]>()
const [emit2, subscribe2] = event<[string]>()
const merged = merge(subscribe1, subscribe2);
emit1('foo') // merged> 'foo'
emit2('bar') // merged> 'bar'
```

### next
Take the next event from a stream

```ts
const [emit, subscribe] = event<[string]>()
(async function() {
  const [data] = await next(subscribe)
  console.log(data)
})()
emit("foo") // > "foo"
```

### select
Derive a variable from another

```ts
const [set, original] = variable([1, 2])
const derived = select(original, t => t[1])
derived.get() // = 2
derived.changed(console.log)
set([3, 4]) // > 4
set([5, 4]) // nothing
```

### toAsync
Compatibility method for passing synchronous variable abstractions to
APIs that expect asynchronous ones. Note that the underlying variable
is also used to store the semaphore value.

```ts
const [set, { get, changed }, lock] = toAsync(variable, 'foo')
```

### fromAsyncIterable
Converts an `AsyncIterable` into an event

```ts
const changes = fromAsyncIterable(fs.watch('./foo.txt'))
```