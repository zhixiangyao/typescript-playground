import { returnStatement, blockStatement, functionExpression } from '@babel/types'
import { transform } from '@babel/core'
import { default as chalk } from 'chalk'
import { log } from '@common/index'

import type { PluginItem, NodePath, BabelFileResult } from '@babel/core'
import type { ArrowFunctionExpression } from '@babel/types'

const arrowFnPlugin = (): PluginItem => {
  return {
    visitor: {
      // 当访问到某个路径的时候进行匹配
      ArrowFunctionExpression(path: NodePath<ArrowFunctionExpression>) {
        const { node } = path //      节点 node: (a, b) => a + b
        const { params } = node //    函数的参数
        const { body }: any = node // 二进制表达式: a + b

        // * returnStatement: return a + b
        const newReturnStatement = returnStatement(body)

        // * blockStatement: { return a + b }
        const newBlockStatement = blockStatement([newReturnStatement])

        // * functionExpression: function(a, b) { return a + b }
        const newFunctionExpression = functionExpression(null, params, newBlockStatement)

        path.replaceWith(newFunctionExpression)
      },
    },
  }
}

const transformArrowFn = (code = `const fn = (a, b) => a + b;`): string | null | undefined => {
  log(chalk.green('old => '))
  log(code)

  const data: BabelFileResult | null = transform(code, {
    plugins: [arrowFnPlugin()],
  })

  // 转换后 const fn = function(a, b) { return a + b }
  log(chalk.red('new => '))
  log(data?.code)

  return data?.code
}

export default transformArrowFn
export { arrowFnPlugin }
