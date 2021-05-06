import readline from 'readline'

const clearTerminal = (): void => {
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearLine(process.stdout, 0)
  readline.clearScreenDown(process.stdout)
}

const log = (...args: any[]) => {
  console.log(...args)
  // process.stdout.write(d + '\n')
}

export { clearTerminal, log }
