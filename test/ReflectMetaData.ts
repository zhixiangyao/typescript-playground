import { isSymbolObject } from 'util/types'

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
    const paramtypes = Reflect.getMetadata('design:paramtypes', target, propertyKey) as Function[]
    const returntype = Reflect.getMetadata('design:returntype', target, propertyKey) as Function

    console.log(`Method: ${methodName}, Method   type: ${type.name}`)
    paramtypes.forEach(({ name }, index) => console.log(`Method: ${methodName}, param[${index}] type: ${name}`))
    console.log(`Method: ${methodName}, return   type: ${returntype.name}`)

    // 在类的原型属性 'someMethod' 上定义元数据，key 为 `methodMetaData`，value 为 `bbbb`
    Reflect.defineMetadata('methodMetaData', 'bbbb', target, propertyKey)
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
console.log(Reflect.getMetadata('classMetaData', User)) // 'aaaa'

console.log(Reflect.getMetadata('inMethod', new User(), 'hello')) // 'B'
console.log(Reflect.getMetadata('methodMetaData', new User(), 'hello')) // 'bbbb'
