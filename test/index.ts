import readline from 'readline'

const clearTerminal = () => {
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearLine(process.stdout, 0)
  readline.clearScreenDown(process.stdout)
}

clearTerminal()

function fn(num: number) {
  return function <T extends { new (...arg: any[]): {} }>(constructor: T) {
    return class extends constructor {
      json = { a: num }
    }
  }
}

@fn(12)
class User {
  json: {
    a: number
  }
}

const obj = new User()
obj.json.a = 80
console.log(obj.json)

const obj2 = new User()
console.log(obj2.json)
