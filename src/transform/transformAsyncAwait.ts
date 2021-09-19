import { identifier, blockStatement, catchClause, tryStatement } from '@babel/types'
import { transform } from '@babel/core'
import { parse } from '@babel/parser'
import { default as chalk } from 'chalk'

import type { FunctionDeclaration } from '@babel/types'
import type { PluginItem, BabelFileResult, NodePath } from '@babel/core'

const transformAsyncAwaitPlugin = (): PluginItem => {
  return {
    visitor: {
      FunctionDeclaration(path: NodePath<FunctionDeclaration>) {
        // Node: async function func() { await asyncFn(); }
        const { node } = path
        // identifier: e
        const catchParam = identifier('e')
        // BlockStatement: console.log(e);
        const catchBlock = blockStatement([parse('console.log(e);').program.body[0]])
        // CatchClause: catch (e) { console.log(e); }
        const catchHandler = catchClause(catchParam, catchBlock)
        const tryCatchBlock = tryStatement(node.body, catchHandler)
        path.replaceWith(tryCatchBlock)
      },
    },
  }
}

/**
 * try/catch an exception for async/await
 *
 * @param code async function func() { await asyncFn(); }
 * @returns async function func() { try { await asyncFn(); } catch(e) { console.log(e); } }
 */
const transformAsyncAwait = (code = `async function func() { await asyncFn();}`): string | null | undefined => {
  console.log(chalk.green.bold('old =>'))
  console.log(code)

  const data: BabelFileResult | null = transform(code, {
    plugins: [transformAsyncAwaitPlugin()],
  })

  /**
   * 转换后
   * async function func() {
   *   try {
   *     await asyncFn();
   *   } catch (e) {
   *     console.log(e);
   *   }
   * }
   */
  console.log(chalk.red.bold('New =>'))
  console.log(data?.code)

  return data?.code
}

export default transformAsyncAwait
export { transformAsyncAwaitPlugin }
