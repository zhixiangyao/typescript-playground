import { default as generate } from '@babel/generator'
import { default as traverse, NodePath } from '@babel/traverse'
import {
  isArrayExpression,
  memberExpression,
  arrayExpression,
  identifier,
  callExpression,
  variableDeclarator,
  variableDeclaration,
} from '@babel/types'
import { VariableDeclaration, SpreadElement } from '@babel/types'
import { default as chalk } from 'chalk'
import { parse } from '@babel/parser'

import { log } from '@common/index'

/**
 * rest to es5
 * @param code const arr = [ ...arr1, ...arr2 ];
 * @returns var arr = [].concat(arr1, arr2)
 */
const transformRest2ES5 = (code = `const arr = [ ...arr1, ...arr2 ];`): string => {
  const AST = parse(code)

  log(chalk.green.bold('old =>'))
  log(code)

  traverse(AST, {
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
  })

  const newCode = generate(AST).code

  // 转换后
  // var arr = [].concat(arr1, arr2)
  log(chalk.red.bold('New =>'))
  log(newCode)

  return newCode
}

export default transformRest2ES5
