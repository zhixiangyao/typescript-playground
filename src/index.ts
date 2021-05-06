import * as esprima from 'esprima'
import * as estraverse from 'estraverse'

const code = `function getUser() {}`
// 生成 AST
const ast = esprima.parseScript(code)
// 转换 AST，只会遍历 type 属性
// traverse 方法中有进入和离开两个钩子函数

estraverse.traverse(ast, {
  enter(node: any) {
    console.log('enter -> node.type', node.type)
  },
  leave(node: any) {
    console.log('leave -> node.type', node.type)
  },
})
