;(async () => {
  const { default: modifyFnName } = await import('./example/modifyFnName')
  const utils = await import('./common/utils')
  const { log } = utils

  modifyFnName()

  log(utils)
})()
