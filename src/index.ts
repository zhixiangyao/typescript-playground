import { parseScript } from 'esprima'
import { traverse } from 'estraverse'
import { Program, Node } from 'estree'
import { dots } from 'cli-spinners'
import chalk from 'chalk'
import ora from 'ora'

import { clearTerminal, log } from './common/utils'

const code = `function getUser() {}`

const ast: Program = parseScript(code)

const spinner = ora('Loading unicorns').start()

setImmediate(() => {
  spinner.color = 'yellow'
  spinner.text = 'Loading rainbows'
  spinner.spinner = dots
}, 1000)

clearTerminal()

traverse(ast, {
  // traverse 方法中有 enter 和 leave 两个钩子函数
  enter(node: Node): void {
    log(chalk.bgYellow.bold(`enter -> node.type: ${node.type}`))
  },
  leave(node: Node): void {
    log(chalk.bgMagenta.bold(`leave -> node.type: ${node.type}`))
  },
})
