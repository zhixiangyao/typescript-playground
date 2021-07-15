// interface 能够声明合并
// 用 interface 描述-数据结构
// 用 type      描述-类型关系
interface User {
  name: string
  age: number
}

interface User {
  sex: string
}

const user: User = {
  sex: 'male',
  age: 24,
  name: 'yaozhixiang',
}

console.log(user)

// 表演体操
const extend = <T extends object, U extends object>(first: T, second: U): T & U => {
  const result = <T & U>{}
  for (const id in first) {
    ;(<T>result)[id] = first[id]
  }
  for (const id in second) {
    if (!result.hasOwnProperty(id)) {
      ;(<U>result)[id] = second[id]
    }
  }

  return result
}

const x = extend({ a: 'hello' }, { b: 42 })

console.log(x)
