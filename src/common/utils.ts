import readline from 'readline'
import ora, { Color } from 'ora'

const clearTerminal = (): void => {
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearLine(process.stdout, 0)
  readline.clearScreenDown(process.stdout)
}

const log = (...args: any[]) => {
  console.log(...args)
  // process.stdout.write(d + '\n')
}

interface Spinner {
  readonly interval: number
  readonly frames: string[]
}

const anime = (color: Color = 'yellow', text = '', dots: Spinner) => {
  const spinner = ora().start()

  setTimeout(() => {
    spinner.color = color
    spinner.text = text
    spinner.spinner = dots
  }, 100)
}

export { clearTerminal, log, anime }
