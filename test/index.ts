import readline from 'readline'

const clearTerminal = () => {
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearLine(process.stdout, 0)
  readline.clearScreenDown(process.stdout)
}

clearTerminal()

import { transformFnName } from '../src'

transformFnName()
