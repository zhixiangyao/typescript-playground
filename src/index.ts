;(async () => {
  const { default: modifyFnName } = await import('./example/modifyFnName')
  const { clearTerminal } = await import('@common/utils')

  clearTerminal()

  modifyFnName()
})()
