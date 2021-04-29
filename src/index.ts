import { NumMatrix } from './example/leetcode'

const obj = new NumMatrix([[-1]])
const param = obj.sumRegion.apply(obj, [0, 0, 0, 0])

console.info(param)
