import { catchClause, identifier, blockStatement, tryStatement } from '@babel/types'
import { transform } from '@babel/core'

import { FunctionDeclaration } from '@babel/types'
import { PluginItem, BabelFileResult, NodePath } from '@babel/core'

import { parse } from '@babel/parser'

import { default as chalk } from 'chalk'

import { log } from '@common/index'

/**
 * try/catch an exception for async/await
 *
 * @param code async function func() { await asyncFn(); }
 * @returns async function func() { try { await asyncFn(); } catch(e) { console.log(e); } }
 */
const transformAsyncAwait = (code = `async function func() { await asyncFn();}`): string | null | undefined => {
  log(chalk.green.bold('old =>'))
  log(code)

  const transformAsyncAwaitPlugin = (): PluginItem => {
    return {
      visitor: {
        FunctionDeclaration(path: NodePath<FunctionDeclaration>) {
          // Node: async function func() { await asyncFn(); }
          const { node } = path
          // Edentifier: e
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

  const data: BabelFileResult | null = transform(code, {
    plugins: [transformAsyncAwaitPlugin()],
  })

  // 转换后
  /**
   * async function func() {
   *   try {
   *     await asyncFn();
   *   } catch (e) {
   *     console.log(e);
   *   }
   * }
   */
  log(chalk.red.bold('New =>'))
  log(data?.code)

  return data?.code
}

export default transformAsyncAwait
