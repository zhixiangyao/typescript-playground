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
    // defineMetadata has 4 params!
    // metadataKey: METADATA_KEY.PATH,
    // metadataValue: path,
    // target: target,
    // propertyKey: undefined
    Reflect.defineMetadata(METADATA_KEY.PATH, path, target)
  }
}

const createMappingDecorator =
  (method: keyof typeof METHOD) =>
  (path: string): MethodDecorator => {
    return (target, key, descriptor) => {
      // MethodDecorator: target === SomeClass.prototype
      // ClassDecorator: target === SomeClass
      // descriptor.value === (target as unknown)[key] === [Function someXXXMethod]

      Reflect.defineMetadata(METADATA_KEY.PATH, path, descriptor.value as unknown as object)
      Reflect.defineMetadata(METADATA_KEY.METHOD, method, descriptor.value as unknown as object)
    }
  }

const Get = createMappingDecorator(METHOD.GET)
const Post = createMappingDecorator(METHOD.POST)
const Put = createMappingDecorator(METHOD.PUT)

const routeGenerator = <T extends object>(instance: T) => {
  const prototype = Object.getPrototypeOf(instance)

  // prototype['constructor'] === instance.constructor
  const rootRoutePath = Reflect.getMetadata(METADATA_KEY.PATH, prototype['constructor'])

  // 筛选出类的 methodName
  const methodsNames = Object.getOwnPropertyNames(prototype).filter(
    item => !isConstructor(item) && isFunction(prototype[item])
  )

  return methodsNames.map(methodName => {
    const fn = prototype[methodName] as Function

    // 取出定义的 metadata
    const routePath = Reflect.getMetadata(METADATA_KEY.PATH, fn)
    const method = Reflect.getMetadata(METADATA_KEY.METHOD, fn)
    return {
      route: `${rootRoutePath}${routePath}`,
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
  somePostMethod() {
    return 'hello world'
  }

  @Put('/c')
  somePutMethod() {
    return 'hello world'
  }
}

/**
 * [
 *   {
 *     route: '/test/a',
 *     method: 'GET',
 *     fn: [Function: someGetMethod],
 *     methodName: 'someGetMethod'
 *   },
 *   {
 *     route: '/test/b',
 *     method: 'POST',
 *     fn: [Function: somePostMethod],
 *     methodName: 'somePostMethod'
 *   }
 *   {
 *     route: '/test/c',
 *     method: 'PUT',
 *     fn: [Function: somePutMethod],
 *     methodName: 'somePutMethod'
 *   }
 * ]
 */
console.log(routeGenerator<SomeClass>(new SomeClass()))

/**
 * Reflect.metadata:
 *
 * function metadata(metadataKey, metadataValue) {
 *   function decorator(target, propertyKey) {
 *     Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
 *   }
 *   return decorator;
 * }
 */
