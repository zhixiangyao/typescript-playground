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

const MethodDecorator = (): MethodDecorator => {
  return (target: Object, propertyKey: string | symbol, descriptor) => {
    const type = Reflect.getMetadata('design:type', target, propertyKey) as Function
    const paramtypes = Reflect.getMetadata('design:paramtypes', target, propertyKey) as Function[]
    const methodName = isSymbolObject(propertyKey) ? propertyKey.toString() : propertyKey
    console.log(`Method: ${methodName}, type: ${type.name}`)

    paramtypes.forEach(({ name }, index) => console.log(`Method: ${methodName}, param[${index}] type: ${name}`))
  }
}

@Reflect.metadata('inClass', 'A')
@ClassDecorator(12)
class User {
  public json: {
    a: number
  }

  @Reflect.metadata('inMethod', 'B')
  @MethodDecorator()
  public hello(name: string): string {
    return 'hello world' + name
  }
}

const obj2 = new User()
console.log(obj2.json) // { a: 12 }

console.log(Reflect.getMetadata('inClass', User)) // 'A'
console.log(Reflect.getMetadata('inMethod', new User(), 'hello')) // 'B'
