# Mini Events
Events have never been simpler

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

## Guarantees regarding asynchronous operation
- An event handler MAY receive events emitted before the subscribe call.
- An event handler MUST receive events emitted after the subscribe call.
- An event handler MUST NOT receive events emitted after the unsubscribe call.
- An event handler MAY NOT receive events emitted before the unsubscribe call.
- An event handler subscribed in a given microtask MUST receive all events that a handler
unsubscribed on the same microtask would not receive.
- Flushing the microtask queue once MUST result in every event handler's completion.

## Variable
A little addition that I havve come to need quite often. Very simple.
```ts
const [set, { get, changed }] = variable('default')
get() // ='default'
changed(console.log)
set('foo') // > 'foo', 'default'
get() // ='foo'
```
Same guarantees apply as with event

## AsyncVariable
Changing state with asynchronity. The API expects locking support
```ts
const [set, { get, changed }, lock] = asyncVariable('default')
await get() // ='default'
await set('foo')
await get() // ='foo'
const [release, value] = await lock() // resolve after the last call's release has been called 
```

## map, filter, toAsync
Minor helper methods

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

### toAsync
Compatibility method for passing synchronous variable abstractions to
APIs that expect asynchronous ones. Note that the underlying variable
is also used to store the semaphore value.

```ts
const [set, { get, changed }, lock] = toAsync(variable, 'foo')
```