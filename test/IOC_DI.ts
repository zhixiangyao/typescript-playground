// InversionOfControlDependencyInjection

type Constructor<T = any> = new (...args: any[]) => T

const Injectable = (): ClassDecorator => target => {}

class OtherService {
  a = 1
}

@Injectable()
class TestService {
  constructor(public otherService: OtherService) {}

  testMethod() {
    console.log(this.otherService.a)
  }
}

console.log(new TestService(new OtherService()))

const Factory = <T>(target: Constructor<T>): T => {
  // 获取所有注入的服务
  const providers = Reflect.getMetadata('design:paramtypes', target) // [OtherService]
  console.log(providers)
  const args = providers.map((provider: Constructor) => new provider())
  console.log(args)
  return new target(...args)
}

Factory(TestService).testMethod() // 1
