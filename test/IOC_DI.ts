// Inversion Of Control, Dependency Injection

type Constructor<T = any> = new (...args: any[]) => T

const Injectable: ClassDecorator = () => {}

class OtherService {
  a = 1
}

const otherService = new (OtherService as Constructor)()

@Injectable
class TestService {
  constructor(public otherService: OtherService) {}

  testMethod() {
    console.log(this.otherService.a)
  }
}

console.log(new TestService(new OtherService()))

const Factory = <T>(target: Constructor<T>): T => {
  // 获取所有注入的服务
  const providers: Constructor[] = Reflect.getMetadata('design:paramtypes', target) // [OtherService]
  console.log('providers:', providers)
  const args = providers.map((provider: Constructor) => new provider())
  console.log('args', args)
  return new target(...args)
}

Factory(TestService).testMethod() // 1
