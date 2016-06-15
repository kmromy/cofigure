# cofigure
Your own generator based flow-control

Supply `processors` which will get used to process yielded values.  
Processors consist of two things : an `identify` function, and a `process` function.

For each processor, the identify function will be used to check if the yielded value should be processed by the process function.
```js
import cofigure, { makeProcessor } from 'cofigure'

const stringToUpperProcessor = makeProcessor(
  (value) => typeof value === 'string',
  (value, next, error, run) => {
    next(value.toUpperCase())
  }
)
```

Supply your processors to `cofigure` and you should be good to go.
```js
function* lowercaseText(text) {
  return yield text
}

const myRunner = cofigure(stringToUpperProcessor)

myRunner(lowercaseText('Hello World !'))
  .then(console.log) // HELLO WORLD !
```

`cofigure` runners return a `Promise` which will get resolved with the generator return value, or rejected with the uncaught threw `Error`.

> Note : under the hood, processors are plain objects.
> ```js
> const myProcessor = {
>   identify: identifyFn,
>   process: processFn
> }
> ```
> We still recommend using `makeProcessor` in case thoses keys change in the future.

## Examples
### Promise processor
```js
const promiseProcessor = makeProcessor(
  (value) => typeof value.then == 'function',
  (value, next, error) => {
    value
      .then(next)
      .catch(error)
  }
)
```
### Generator processor
```js
const generatorProcessor = makeProcessor(
  (value) => 'function' == typeof value.next && 'function' == typeof value.throw,
  (value, next, error, run) => {
    run(value)
      .then(next)
      .catch(error)
  }
)
```
