import { isSymbolObject } from 'util/types'
import 'reflect-metadata'

const ClassDecorator = (num: number) => {
  return <T extends { new (...arg: any[]): {} }>(target: T) => {
    // 在类上定义元数据，key 为 `classMetaData`，value 为 `aaaa`
    Reflect.defineMetadata('classMetaData', 'aaaa', target)
    return class extends target {
      json = { a: num }
    }
  }
}

const MethodDecorator = (): MethodDecorator => {
  return (target: Object, propertyKey: string | symbol, descriptor) => {
    const methodName = isSymbolObject(propertyKey) ? propertyKey.toString() : propertyKey

    const type = Reflect.getMetadata('design:type', target, propertyKey) as Function
    const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey) as Function[]
    const returnType = Reflect.getMetadata('design:returntype', target, propertyKey) as Function

    console.log('类的方法名:', methodName)
    console.log('类的方法类型:', type)

    paramTypes.forEach((paramType, i) => {
      console.log(`类的方法第 ${i} 参数的类型:`, paramType)
    })

    console.log('类的方法返回值类型:', returnType)

    // 在类的原型属性 'someMethod' 上定义元数据，key 为 `methodMetaData`，value 为 `bbbb`
    Reflect.defineMetadata('methodMetaData', 'bbbb', target, propertyKey)
  }
}

class MessageHello {
  constructor(public msg: string) {}
}

class ParamAge {
  constructor(public age: number) {}
}

@ClassDecorator(12)
class User {
  public json?: { a: number }

  @MethodDecorator()
  public hello(name: string, age: ParamAge): MessageHello {
    return new MessageHello('hello world, hi~ my name is' + name + ', ' + age + '.')
  }
}

const user = new User()

console.log()
console.log(user.json) // { a: 12 }
console.log(Reflect.getMetadata('classMetaData', User)) // 'aaaa'
console.log(Reflect.getMetadata('methodMetaData', new User(), 'hello')) // 'bbbb'
