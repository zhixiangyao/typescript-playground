// Angular2 Inversion Of Control, Dependency Injection
import 'reflect-metadata'

const isInjectable = Symbol('isInjectable')

const Injectable: ClassDecorator = target => {
  Reflect.defineMetadata(isInjectable, true, target)
}

class NonService {
  non = 'non!'
}

@Injectable
class OtherService {
  other = 'other!'
}

@Injectable
class MainService {
  constructor(private nonService: NonService, private otherService: OtherService) {}

  run() {
    console.log(this.nonService) // undefined
    console.log(this.otherService.other) // "other!"
  }
}

type Constructor<T = any> = new (...args: any[]) => T

const Factory = <T>(target: Constructor<T>): T => {
  const constructorParams: Constructor[] = Reflect.getMetadata('design:paramtypes', target)
  const args = constructorParams.map((constructorParam: Constructor) => {
    return Reflect.getMetadata(isInjectable, constructorParam) ? new constructorParam() : void 0
  })
  return new target(...args)
}

Factory(MainService).run() // 1
