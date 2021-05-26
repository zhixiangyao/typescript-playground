import { default as generate } from '@babel/generator'
import { default as traverse, NodePath } from '@babel/traverse'
import { VariableDeclaration } from '@babel/types'
import { default as chalk } from 'chalk'
import { parse } from '@babel/parser'

import { log } from '@common/index'

const transformRest2ES5 = (code = `const arr = [ ...arr1, ...arr2 ];`) => {
  const AST = parse(code)

  log(chalk.green.bold('old =>'))
  log(code)

  traverse(AST, {
    VariableDeclaration(path: NodePath<VariableDeclaration>) {
      const { node } = path //      节点: const arr = [ ...arr1, ...arr2 ];

      log(node)
    },
  })

  log(chalk.red.bold('New =>'))
  log(generate(AST).code)
}

export default transformRest2ES5
