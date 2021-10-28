import { clearTerminal } from './utils'
import { isSymbolObject } from 'util/types'
import 'reflect-metadata'

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
    const methodName = isSymbolObject(propertyKey) ? propertyKey.toString() : propertyKey

    const type = Reflect.getMetadata('design:type', target, propertyKey) as Function
    const paramtypes = Reflect.getMetadata('design:paramtypes', target, propertyKey) as Function[]
    const returntype = Reflect.getMetadata('design:returntype', target, propertyKey) as Function

    console.log(`Method: ${methodName}, Method   type: ${type.name}`)
    paramtypes.forEach(({ name }, index) => console.log(`Method: ${methodName}, param[${index}] type: ${name}`))
    console.log(`Method: ${methodName}, return   type: ${returntype.name}`)
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
  public hello(name: string, age: number): string {
    return 'hello world, hi~ my name is' + name + ', ' + age + '.'
  }
}

const obj2 = new User()
console.log(obj2.json) // { a: 12 }

console.log(Reflect.getMetadata('inClass', User)) // 'A'
console.log(Reflect.getMetadata('inMethod', new User(), 'hello')) // 'B'
