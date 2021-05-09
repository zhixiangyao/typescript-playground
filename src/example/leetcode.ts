import chalk from 'chalk'
import { log } from '../common/utils'

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
    this.sums = new Array(row + 1).fill(0).map(() => new Array(column + 1).fill(0))

    for (let r = 0; r < row; r++) {
      for (let c = 0; c < column; c++) {
        // 左矩形  + 上矩形 - 左上矩形 + 自己
        this.sums[r + 1][c + 1] = this.sums[r + 1][c] + this.sums[r][c + 1] - this.sums[r][c] + matrix[r][c]
      }
    }
  }

  sumRegion(row1: number, col1: number, row2: number, col2: number): number {
    const bigRect = this.sums[row2 + 1][col2 + 1]
    const leftRect = this.sums[row2 + 1][col1]
    const topRect = this.sums[row1][col2 + 1]
    const leftTopRect = this.sums[row1][col1]
    // 大矩形 - 左矩形 - 上矩形 + 左上矩形
    return bigRect - leftRect - topRect + leftTopRect
  }
}

/**
 * 1723. Find Minimum Time to Finish All Jobs
 * 完成所有工作的最短时间
 * https://leetcode-cn.com/problems/find-minimum-time-to-finish-all-jobs/
 */
function minimumTimeRequired(jobs: number[], k: number): number {
  const len = jobs.length
  const sum = new Array(k).fill(0)
  let ans = Number.MAX_SAFE_INTEGER

  /**
   * u     : 当前处理到那个 job
   * sum   : 工人的分配情况          例如：sum[0] = x 代表 0 号工人工作量为 x
   * max   : 当前的「最大工作时间」
   */
  const dfs = (u: number, sum: number[], max: number): void => {
    log(chalk.blue(`工人的分配情况: ${sum}`), ',', `当前的「最大工作时间」: ${max}`)
    if (max >= ans) return
    if (u === len) {
      ans = max
      return
    }
    for (let i = 0; i < k; i++) {
      sum[i] += jobs[u]
      dfs(u + 1, sum, Math.max(sum[i], max))
      sum[i] -= jobs[u]
    }
  }

  dfs(0, sum, 0)

  return ans
}

export { isMonotonic, NumArray, NumMatrix, minimumTimeRequired }
