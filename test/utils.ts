import readline from 'readline'

const clearTerminal = () => {
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearLine(process.stdout, 0)
  readline.clearScreenDown(process.stdout)
}

const isConstructor = (value: string) => {
  return value === 'constructor'
}

const isFunction = (f: any) => {
  if (typeof f === 'function') {
    return true
  }
  return false
}

export { clearTerminal, isConstructor, isFunction }
