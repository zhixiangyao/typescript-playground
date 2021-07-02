import { clearTerminal } from '@common/index'

clearTerminal()

const extend = <T extends object, U extends object>(first: T, second: U): T & U => {
  const result = <T & U>{}
  for (const id in first) {
    ;(<T>result)[id] = first[id]
  }
  for (const id in second) {
    if (!result.hasOwnProperty(id)) {
      ;(<U>result)[id] = second[id]
    }
  }

  return result
}

const x = extend({ a: 'hello' }, { b: 42 })

console.log(x)
