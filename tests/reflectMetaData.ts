import { isSymbolObject } from 'util/types'
import 'reflect-metadata'

const ClassDecorator = (num: number) => {
  return <T extends { new (...arg: any[]): {} }>(target: T) => {
    // 在类上定义元数据，key 为 `classMetaData`，value 为 `aaaa`
    Reflect.defineMetadata('classMetaData', 'aaaa', target)

    console.log('============= Class Decorator Called ================')
    console.log(`Target: ${target.name || target}`)
    console.log('======================================================')
    console.log()

    return class extends target {
      json = { a: num }
    }
  }
}

const MethodDecorator = (): MethodDecorator => {
  return <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
    const methodName = isSymbolObject(propertyKey) ? propertyKey.toString() : propertyKey

    const type = Reflect.getMetadata('design:type', target, propertyKey) as Function
    const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey) as Function[]
    const returnType = Reflect.getMetadata('design:returntype', target, propertyKey) as Function

    console.log('============= Method Decorator Called ================')
    console.log(`Target: ${target.constructor.name || target}`)
    console.log(`Method Name: ${methodName}`)
    console.log(`Method Overall Type: ${type.name}`)
    paramTypes.forEach((paramType, i) => {
      console.log(`Parameter ${i} Type: ${paramType?.name ?? 'N/A'}`)
    })
    console.log('Method Return Type:', returnType?.name ?? 'N/A')
    console.log('======================================================')
    console.log()

    // 在类的原型属性 'someMethod' 上定义元数据，key 为 `methodMetaData`，value 为 `bbbb`
    Reflect.defineMetadata('methodMetaData', 'bbbb', target, propertyKey)
  }
}

const ParameterDecorator = (): ParameterDecorator => {
  return (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    console.log('============= Parameter Decorator Called =============')
    console.log(`Target: ${target.constructor.name || target}`)
    console.log(`Method Name: ${String(propertyKey)}`)
    console.log(`Parameter Index: ${parameterIndex}`)
    const designParamTypes = propertyKey ? Reflect.getMetadata('design:paramtypes', target, propertyKey) : void 0
    if (designParamTypes) {
      console.log(`Parameter Type: ${designParamTypes[parameterIndex].name}`)
    }
    console.log('======================================================')
    console.log()
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
  #start?: MessageHello

  @MethodDecorator()
  public hello(@ParameterDecorator() name: string, age: ParamAge): MessageHello {
    return new MessageHello('hello world, hi~ my name is' + name + ', ' + age.age + '.')
  }

  @MethodDecorator()
  set start(value: MessageHello) {
    this.#start = value
  }

  get start() {
    return this.#start ?? new MessageHello('empty')
  }
}

const user = new User()

console.log(Reflect.getMetadata('classMetaData', User)) // 'aaaa'
console.log(Reflect.getMetadata('methodMetaData', new User(), 'hello')) // 'bbbb'
const hello = user.hello('yzx', new ParamAge(123))
user.start = hello
console.log(hello.msg)
console.log(user)
