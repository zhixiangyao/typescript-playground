import { parseScript } from 'esprima'
import { traverse } from 'estraverse'
import { Program, Node } from 'estree'
import { dots } from 'cli-spinners'
import chalk from 'chalk'

import { clearTerminal, log, anime } from './common/utils'

const code = `function getUser() {}`
const ast: Program = parseScript(code)

anime('red', 'haha', dots)
clearTerminal()

traverse(ast, {
  // traverse 方法中有 enter 和 leave 两个钩子函数
  enter(node: Node): void {
    log(chalk.red(`enter -> node.type: ${node.type}`))
  },
  leave(node: Node): void {
    log(chalk.green(`leave -> node.type: ${node.type}`))
  },
})
