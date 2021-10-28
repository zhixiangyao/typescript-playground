import { isConstructor, isFunction } from './utils'

const METHOD_METADATA = 'method'
const PATH_METADATA = 'path'

const Controller = (path: string): ClassDecorator => {
  return target => {
    Reflect.defineMetadata(PATH_METADATA, path, target)
  }
}

const createMappingDecorator =
  (method: string) =>
  (path: string): MethodDecorator => {
    return (target, key, descriptor) => {
      Reflect.defineMetadata(PATH_METADATA, path, descriptor.value as unknown as object)
      Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value as unknown as object)
    }
  }

const Get = createMappingDecorator('GET')
const Post = createMappingDecorator('POST')

function mapRoute(instance: Object) {
  const prototype = Object.getPrototypeOf(instance)

  // 筛选出类的 methodName
  const methodsNames = Object.getOwnPropertyNames(prototype).filter(
    item => !isConstructor(item) && isFunction(prototype[item])
  )

  return methodsNames.map(methodName => {
    const fn = prototype[methodName]

    // 取出定义的 metadata
    const route = Reflect.getMetadata(PATH_METADATA, fn)
    const method = Reflect.getMetadata(METHOD_METADATA, fn)
    return {
      route,
      method,
      fn,
      methodName,
    }
  })
}

@Controller('/test')
class SomeClass {
  @Get('/a')
  someGetMethod() {
    return 'hello world'
  }

  @Post('/b')
  somePostMethod() {}
}

Reflect.getMetadata(PATH_METADATA, SomeClass) // '/test'

console.log(mapRoute(new SomeClass()))
