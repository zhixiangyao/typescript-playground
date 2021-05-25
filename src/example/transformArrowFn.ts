import { PluginItem, NodePath, types, BabelFileResult } from '@babel/core'
import { transform } from '@babel/core'
import { returnStatement, blockStatement, functionExpression } from '@babel/types'

import { chalk, log } from '@common/index'

const transformArrowFn = () => {
  const code = `const fn = (a, b) => a + b;`

  log(chalk.green('old => '), code)

  const arrowFnPlugin = (): PluginItem => ({
    visitor: {
      // 当访问到某个路径的时候进行匹配
      ArrowFunctionExpression(path: NodePath<types.ArrowFunctionExpression>) {
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
  })

  const data: BabelFileResult | null = transform(code, {
    plugins: [arrowFnPlugin],
  })

  // 转换后 const fn = function(a, b) { return a + b }
  log(chalk.red('new => '), data?.code)
}

export default transformArrowFn
