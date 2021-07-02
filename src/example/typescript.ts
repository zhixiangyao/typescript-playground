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
