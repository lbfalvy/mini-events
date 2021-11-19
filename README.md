# Mini Events
Events have never been simpler

## Usage
Obtain an emit-subscribe pair using the `event` factory method
```ts
const [emit, subscribe] = event<EventType>()
```

Subscribe by passing a callback to the second function returned by `event`
```ts
const [emit, subscribe] = event<EventType>()
subscribe(e => ...)
```

Subscribe synchronously by passing `true` as the second argument. A synchronous handler will
execute before emit would return. Use them sparingly, only attach very short handlers
synchronously.
```ts
const [emit, subscribe] = event<EventType>()
subscribe(e => ..., true)
```

Emit an event by calling the first function returned by `event`
```ts
const [emit, subscribe] = event<EventType>()
emit(...)
```

Unsubscribe by calling the function returned by the subscribe call.
```ts
const [emit, subscribe] = event<EventType>()
const unsubscribe = subscribe(e => ...)
unsubscribe()
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
const [set, get, subscribe] = variable('default')
get() // ='default'
subscribe(console.log)
set('foo') // > 'foo', 'default'
get() // ='foo'
```
Same guarantees apply as with event