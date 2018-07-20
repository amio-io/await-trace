# await-trace
[![npm version](https://badge.fury.io/js/await-trace.svg)](https://badge.fury.io/js/await-trace) 

(Ugly) solution for complete stack traces in async/await. Production ready.

We needed complete stack traces that has a very low performance overhead. 
This mini-module is created as a response to the closed issue [Missing stack traces from async functions after the first await](https://github.com/nodejs/node/issues/11865).
I hope that NodeJS team will create a native solution.

It may be ugly but you can refactor your codebase quickly to use this module AND also you can quickly refactor it back
to the original `async/await`.

### Installation

`npm install await-trace --save`

### Usage

Replace your `await promise` with `await nab(() => E(), promise)`. For example, convert this:

```
async function sideEffect(dummy){
  const data = await fetchData()
  return await updateData(data)
}
```

to this:
```
const {nab, E} = require('await-trace')

async function sideEffect(dummy){
  const data = await nab(() => E(), fetchData())
  return await nab(() => E(), updateData(data))
}
```

### Quick refactoring

If you want to quickly refactor your code, I recommend you to use a replace tool that accepts regex patterns.
I have done my refactoring using Jetbrains IDEs: 

![Replace with regex](./docs/regex-replace.png)

**Find:** `await\s(.*)(\)$)`
**Replace:** `await nab(() => E(), $1$2)` 

### Explanation

- `E()` is an alias to `Error()`. Module exports `Err()` too.
- The lazy initialization of error via `() => E()` is necessary in order **not** to degrade performance. 
- NodeJS builds stack trace from the place where an error is created. That's why you have to pass `E()` in every single `nab()`


### Caveats

- I don't know how to make it work with `setTimeout()`. With promises you'll be fine.
- For stack traces longer than 10 lines use `--stack-trace-limit` flag, e.g.:
  ```node --stack-trace-limit=100 index.js```

### Invitation

NodeJS is great for development and this is just a pain in the ass in otherwise wonderful ecosystem!
We'll be glad if you find any improvements (make a PR. ;) or if you offer a better solution than this one.
 

