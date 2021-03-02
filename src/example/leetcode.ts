/**
 * 896. Monotonic Array 单调数列
 * https://leetcode-cn.com/problems/monotonic-array/
 * @param A
 * @returns
 */
function isMonotonic(A: number[]): boolean {
  let lastValue = A[0]
  let state: boolean | null = null
  for (let i = 1; i < A.length; i++) {
    if (state === null) {
      if (A[i] > lastValue) state = true
      if (A[i] < lastValue) state = false
    } else {
      if (state && A[i] < lastValue) return false
      if (!state && A[i] > lastValue) return false
    }

    lastValue = A[i]
  }
  return true
}

/**
 * 303. Range Sum Query - Immutable 区域和检索 - 数组不可变
 * https://leetcode-cn.com/problems/range-sum-query-immutable/
 * Your NumArray object will be instantiated and called as such:
 * var obj = new NumArray(nums)
 * var param_1 = obj.sumRange(i,j)
 */
class NumArray {
  public nums: number[]
  public sub: number[]
  constructor(nums: number[]) {
    const len = nums.length
    const sub: number[] = new Array(len).fill(0)
    let sum = 0
    for (let i = 0; i < len; i++) {
      sum += nums[i]
      sub[i] = sum
    }
    this.nums = nums
    this.sub = sub
    return this
  }

  sumRange(i: number, j: number): number {
    if (i === 0) return this.sub[j]
    else return this.sub[j] - this.sub[i - 1]
  }
}

/**
 * 304. Range Sum Query 2D - Immutable 二维区域和检索 - 矩阵不可变
 * https://leetcode-cn.com/problems/range-sum-query-2d-immutable/
 * Your NumMatrix object will be instantiated and called as such:
 * var obj = new NumMatrix(matrix)
 * var param_1 = obj.sumRegion(row1,col1,row2,col2)
 */
class NumMatrix {
  private sums: number[][]

  constructor(matrix: number[][]) {
    const row = matrix.length
    const column = row !== 0 ? matrix[0].length : 0
    let sum = 0
    this.sums = new Array(row).fill(0).map(() => new Array(column).fill(0))

    for (let r = 0; r < row; r++) {
      sum = 0
      for (let c = 0; c < column; c++) {
        sum += matrix[r][c]
        this.sums[r][c] = sum
      }
    }
  }

  sumRegion(row1: number, col1: number, row2: number, col2: number): number {
    let sum = 0
    for (let r = row1; r <= row2; r++) {
      sum += (this.sums[r][col2] || 0) - (this.sums[r][col1 - 1] || 0)
    }

    return sum
  }
}

export { isMonotonic, NumArray, NumMatrix }
