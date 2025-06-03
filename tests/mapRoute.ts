import { isConstructor, isFunction } from './utils'
import 'reflect-metadata'

enum ENUM_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

enum ENUM_METADATA_KEY {
  METHOD = 'method',
  PATH = 'path',
}

const Controller = (path: string): ClassDecorator => {
  return target => {
    Reflect.defineMetadata(ENUM_METADATA_KEY.PATH, path, target)
  }
}

const createMappingDecorator =
  (method: ENUM_METHOD) =>
  (path: string): MethodDecorator => {
    return (target, key, descriptor) => {
      Reflect.defineMetadata(ENUM_METADATA_KEY.PATH, path, descriptor.value as unknown as object)
      Reflect.defineMetadata(ENUM_METADATA_KEY.METHOD, method, descriptor.value as unknown as object)
    }
  }

const Get = createMappingDecorator(ENUM_METHOD.GET)
const Post = createMappingDecorator(ENUM_METHOD.POST)
const Put = createMappingDecorator(ENUM_METHOD.PUT)

const routeGenerator = <T extends object>(instance: T) => {
  const target = Object.getPrototypeOf(instance)
  const rootRoutePath = Reflect.getMetadata(ENUM_METADATA_KEY.PATH, target['constructor'])
  const propertyKeys = Object.getOwnPropertyNames(target).filter(
    item => !isConstructor(item) && isFunction(target[item])
  )

  return propertyKeys.map(propertyKey => {
    const func = target[propertyKey] as Function
    const routePath = Reflect.getMetadata(ENUM_METADATA_KEY.PATH, func)
    const method = Reflect.getMetadata(ENUM_METADATA_KEY.METHOD, func)

    return {
      route: `${rootRoutePath}${routePath}`,
      method,
      func,
      funcName: propertyKey,
      funcPramTypes: Reflect.getMetadata('design:paramtypes', target, propertyKey),
    }
  })
}

@Controller('/test')
class SomeClass {
  @Get('/a')
  someGetMethod(body: object) {
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

console.log(routeGenerator<SomeClass>(new SomeClass()))
