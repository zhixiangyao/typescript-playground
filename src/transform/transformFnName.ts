import { identifier, functionDeclaration } from '@babel/types'
import { transform } from '@babel/core'
import { default as chalk } from 'chalk'

import type { PluginItem, BabelFileResult, NodePath } from '@babel/core'
import type { FunctionDeclaration } from '@babel/types'

interface transformFnNamePathPluginOptions {
  newFuncName: string
}

const transformFnNamePlugin = (opt: transformFnNamePathPluginOptions): PluginItem => {
  const { newFuncName } = opt

  return {
    visitor: {
      FunctionDeclaration(path: NodePath<FunctionDeclaration>) {
        const { node } = path
        const { id, params, body } = node

        // function name !== new function name
        if (id?.name !== newFuncName) {
          const newIdentifier = identifier(newFuncName)
          const newFunctionDeclaration = functionDeclaration(newIdentifier, params, body)
          path.replaceWith(newFunctionDeclaration)
        }
      },
    },
  }
}

const transformFnName = (code = `function getUser() { console.log() }`): string | null | undefined => {
  console.log(chalk.green('old => '))
  console.log(code)

  const data: BabelFileResult | null = transform(code, {
    plugins: [transformFnNamePlugin({ newFuncName: 'getBroker' })],
  })

  // 转换后
  // function getBroker() {
  //   console.log()
  // }
  console.log(chalk.red('new => '))
  console.log(data?.code)

  return data?.code
}

export default transformFnName
export { transformFnNamePlugin }

export { transformFnNamePathPluginOptions }
