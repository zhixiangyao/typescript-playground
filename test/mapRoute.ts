import { isConstructor, isFunction } from './utils'
import 'reflect-metadata'

enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
enum METADATA_KEY {
  METHOD = 'method',
  PATH = 'path',
}

const Controller = (path: string): ClassDecorator => {
  return target => {
    Reflect.defineMetadata(METADATA_KEY.PATH, path, target)
  }
}

const createMappingDecorator =
  (method: keyof typeof METHOD) =>
  (path: string): MethodDecorator => {
    return (target, key, descriptor) => {
      Reflect.defineMetadata(METADATA_KEY.PATH, path, descriptor.value as unknown as object)
      Reflect.defineMetadata(METADATA_KEY.METHOD, method, descriptor.value as unknown as object)
    }
  }

const Get = createMappingDecorator(METHOD.GET)
const Post = createMappingDecorator(METHOD.POST)

const mapRoute = (instance: Object) => {
  const prototype = Object.getPrototypeOf(instance)

  // 筛选出类的 methodName
  const methodsNames = Object.getOwnPropertyNames(prototype).filter(
    item => !isConstructor(item) && isFunction(prototype[item])
  )

  return methodsNames.map(methodName => {
    const fn = prototype[methodName]

    // 取出定义的 metadata
    const route = Reflect.getMetadata(METADATA_KEY.PATH, fn)
    const method = Reflect.getMetadata(METADATA_KEY.METHOD, fn)
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

/**
 * /test
 */
console.log(Reflect.getMetadata(METADATA_KEY.PATH, SomeClass))

/**
 * [
 *   {
 *     route: '/a',
 *     method: 'GET',
 *     fn: [Function: someGetMethod],
 *     methodName: 'someGetMethod'
 *   },
 *   {
 *     route: '/b',
 *     method: 'POST',
 *     fn: [Function: somePostMethod],
 *     methodName: 'somePostMethod'
 *   }
 * ]
 */
console.log(mapRoute(new SomeClass()))
