import { PluginItem, NodePath, types, BabelFileResult } from '@babel/core'
import { transform } from '@babel/core'
import { returnStatement, blockStatement, functionExpression } from '@babel/types'

import { chalk, log } from '@common/index'

const transformArrowFn = () => {
  // 转换后 const fn = function(a, b) { return a + b }
  const originCode = `const fn = (a, b) => a + b;`

  log(chalk.green('old => '), originCode)

  const arrowFnPlugin = (): PluginItem => {
    return {
      // 访问者模式
      visitor: {
        // 当访问到某个路径的时候进行匹配

        ArrowFunctionExpression(path: NodePath<types.ArrowFunctionExpression>) {
          const { node } = path //      节点 node: (a, b) => a + b
          const { params } = node //    函数的参数
          const { body }: any = node // 二进制表达式: a + b

          // returnStatement
          const newReturnStatement = returnStatement(body)

          // blockStatement
          const newBlockStatement = blockStatement([newReturnStatement])

          // functionExpression
          const newFunctionExpression = functionExpression(null, params, newBlockStatement)

          path.replaceWith(newFunctionExpression)
        },
      },
    }
  }

  const babelData: BabelFileResult | null = transform(originCode, {
    plugins: [arrowFnPlugin],
  })

  log(chalk.red('new => '), babelData?.code)
}

export default transformArrowFn
