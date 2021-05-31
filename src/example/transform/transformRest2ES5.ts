import {
  isArrayExpression,
  arrayExpression,
  identifier,
  memberExpression,
  callExpression,
  variableDeclarator,
  variableDeclaration,
} from '@babel/types'
import { transform } from '@babel/core'

import { VariableDeclaration, SpreadElement } from '@babel/types'
import { PluginItem, BabelFileResult, NodePath } from '@babel/core'

import { default as chalk } from 'chalk'

import { log } from '@common/index'

/**
 * rest to es5
 * @param code const arr = [ ...arr1, ...arr2 ];
 * @returns var arr = [].concat(arr1, arr2)
 */
const transformRest2ES5 = (code = `const arr = [ ...arr1, ...arr2 ];`): string | null | undefined => {
  log(chalk.green.bold('old =>'))
  log(code)

  const transformRest2ES5Plugin = (): PluginItem => {
    return {
      visitor: {
        VariableDeclaration(path: NodePath<VariableDeclaration>) {
          const { node } = path //         节点: const arr = [ ...arr1, ...arr2 ];
          const { declarations } = node // declarations: arr = [ ...arr1, ...arr2 ];
          const kind = 'var'

          // 边界判定
          if (node.kind !== kind && declarations.length === 1 && isArrayExpression(declarations[0].init)) {
            const args: SpreadElement[] = declarations[0].init.elements.map(item => {
              const { argument }: any = item
              return argument
            })
            // [].concat()
            const callee = memberExpression(arrayExpression(), identifier('concat'))
            // [].concat(arr1, arr2)
            const init = callExpression(callee, args)
            // arr = [].concat(arr1, arr2)
            const declaration = variableDeclarator(declarations[0].id, init)
            // var arr = [].concat(arr1, arr2)
            const newVariableDeclaration = variableDeclaration(kind, [declaration])
            path.replaceWith(newVariableDeclaration)
          }
        },
      },
    }
  }

  const data: BabelFileResult | null = transform(code, {
    plugins: [transformRest2ES5Plugin()],
  })

  // 转换后
  // var arr = [].concat(arr1, arr2)
  log(chalk.red.bold('New =>'))
  log(data?.code)

  return data?.code
}

export default transformRest2ES5
