import { parseScript } from 'esprima'
import { traverse } from 'estraverse'
import { generate } from 'escodegen'
import { default as chalk } from 'chalk'
import { log } from '@common/index'

import { Program, Node } from 'estree'

/**
 * 使用 esprima 库的 parseScript 方法
 * 把 code 转换成 AST（抽象代码树 Abstract Ayntax Tree）
 * 然后在 enter 钩子里修改 funciton 名
 */
const transformFnName = (code = `function getUser() {}`): string | null | undefined => {
  const AST: Program = parseScript(code)

  log(chalk.green.bold('Old =>'))
  log(chalk.yellow(generate(AST)))

  traverse(AST, {
    enter(node: Node): void {
      log(chalk.red(`enter => node.type: ${node.type}`))

      // 修改 Identifier，也就是 方法名
      if (node.type === 'Identifier') node.name = 'getBroker'
    },
    leave(node: Node): void {
      log(chalk.blue(`leave => node.type: ${node.type}`))
    },
  })
  const newCode = generate(AST)

  log(chalk.green.bold('New =>'))
  log(chalk.yellow(newCode))

  return newCode
}

export default transformFnName
