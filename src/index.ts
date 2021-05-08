import { parseScript } from 'esprima'
import { traverse } from 'estraverse'
import { generate } from 'escodegen'
import { Program, Node } from 'estree'
import chalk from 'chalk'

import { clearTerminal, log } from './common/utils'

clearTerminal()

const code = `function getUser() {}`
const ast: Program = parseScript(code)

log(chalk.green.bold('Ast:'), ast, '\n')

log(chalk.green.bold('Old:'), chalk.yellow(generate(ast)), '\n')

traverse(ast, {
  // traverse 方法中有 enter 和 leave 两个钩子函数
  enter(node: Node): void {
    log(chalk.red(`enter -> node.type: ${node.type}`))

    if (node.type === 'Identifier') {
      node.name = 'getBroker'
    }
  },
  leave(node: Node): void {
    log(chalk.blue(`leave -> node.type: ${node.type}`))
  },
})

log()

log(chalk.green.bold('New:'), chalk.yellow(generate(ast)))
