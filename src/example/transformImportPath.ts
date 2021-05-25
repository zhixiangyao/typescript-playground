import { PluginItem, BabelFileResult, NodePath, types } from '@babel/core'
import { transform } from '@babel/core'
import { importDeclaration, importDefaultSpecifier, stringLiteral, isImportDefaultSpecifier } from '@babel/types'

import { chalk, log } from '@common/index'

const transformImportPath = (code = `import { Button, Icon } from 'vant';`): string | null | undefined => {
  log(chalk.green('old => '))
  log(code)

  interface TransformImportPathPluginOptions {
    libraryDir: string
  }

  const transformImportPathPlugin = (opt: TransformImportPathPluginOptions): PluginItem => {
    const { libraryDir } = opt

    return {
      visitor: {
        ImportDeclaration(path: NodePath<types.ImportDeclaration>) {
          const { node } = path //      节点: import { Button, Icon } from 'vant'
          const { specifiers, source } = node

          if (!(specifiers.length === 1 && isImportDefaultSpecifier(specifiers[0]))) {
            const result = specifiers.map(specifier => {
              const newSource = stringLiteral(`${source.value}/${libraryDir}/${specifier.local.name}`)
              return importDeclaration([importDefaultSpecifier(specifier.local)], newSource)
            })
            path.replaceWithMultiple(result)
          }
        },
      },
    }
  }

  const data: BabelFileResult | null = transform(code, {
    plugins: [transformImportPathPlugin({ libraryDir: 'lib' })],
  })

  // 转换后
  // import { Button } from 'vant/lib/Button';
  // import { Icon } from 'vant/lib/Icon';
  log(chalk.red('new => '))
  log(data?.code)

  return data?.code
}

export default transformImportPath
