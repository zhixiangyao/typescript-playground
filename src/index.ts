;(async () => {
  const { default: transformArrowFn } = await import(
    '@example/transformArrowFn'
  )
  const { clearTerminal } = await import('@common/utils')

  clearTerminal()

  transformArrowFn()
})()
