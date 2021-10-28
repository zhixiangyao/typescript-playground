import { clearTerminal } from './utils'
import 'reflect-metadata'

clearTerminal()

function classDecorator(num: number) {
  return function <T extends { new (...arg: any[]): {} }>(constructor: T) {
    return class extends constructor {
      json = { a: num }
    }
  }
}

@Reflect.metadata('inClass', 'A')
@classDecorator(12)
class User {
  public json: {
    a: number
  }

  @Reflect.metadata('inMethod', 'B')
  public hello(): string {
    return 'hello world'
  }
}

const obj = new User()
obj.json.a = 80
console.log(obj.json)

const obj2 = new User()
console.log(obj2.json)

console.log(Reflect.getMetadata('inClass', User)) // 'A'
console.log(Reflect.getMetadata('inMethod', new User(), 'hello')) // 'B'
