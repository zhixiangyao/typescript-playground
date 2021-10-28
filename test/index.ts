import { clearTerminal } from './utils'
import 'reflect-metadata'
import { isSymbolObject } from 'util/types'

clearTerminal()

const ClassDecorator = (num: number) => {
  return <T extends { new (...arg: any[]): {} }>(constructor: T) => {
    return class extends constructor {
      json = { a: num }
    }
  }
}

const PropDecorator = (): PropertyDecorator => {
  return (target: Object, propertyKey: string | symbol) => {
    const type = Reflect.getMetadata('design:type', target, propertyKey)
    console.log(`${isSymbolObject(propertyKey) ? propertyKey.toString() : propertyKey} type: ${type.name}`)
  }
}

@Reflect.metadata('inClass', 'A')
@ClassDecorator(12)
class User {
  public json: {
    a: number
  }

  @Reflect.metadata('inMethod', 'B')
  @PropDecorator()
  public hello(): string {
    return 'hello world'
  }
}

const obj2 = new User()
console.log(obj2.json) // { a: 12 }

console.log(Reflect.getMetadata('inClass', User)) // 'A'
console.log(Reflect.getMetadata('inMethod', new User(), 'hello')) // 'B'
