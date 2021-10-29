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
const Put = createMappingDecorator(METHOD.PUT)

const routeGenerator = <T extends Object>(instance: T) => {
  const prototype = Object.getPrototypeOf(instance) as T

  const rootRoutePath = Reflect.getMetadata(METADATA_KEY.PATH, prototype['constructor'])

  // 筛选出类的 methodName
  const methodsNames = Object.getOwnPropertyNames(prototype).filter(
    item => !isConstructor(item) && isFunction(prototype[item])
  )

  return methodsNames.map(methodName => {
    const fn = prototype[methodName]

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

const someClass: SomeClass = new SomeClass()
const FakeSomeClass0: new (...args: any[]) => SomeClass = SomeClass
const FakeSomeClass1: typeof SomeClass = SomeClass

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
