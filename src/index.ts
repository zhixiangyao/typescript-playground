;(async () => {
  // const { default: modifyFnName } = await import('./example/modifyFnName')
  const { clearTerminal } = await import('./common/utils')
  const { minimumTimeRequired } = await import('./example/leetcode')

  clearTerminal()

  // modifyFnName()
  minimumTimeRequired([3, 2, 3], 3)
})()
