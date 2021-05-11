# TypeScript Playground

## Scripts overview

### npm run start

首先使用 **npm run build** 构建项目，然后再执行编译的 JavaScript **node build/index.js** ，从而在生产环境中启动该 app。

### npm run start:dev

使用 **nodemon** 和 **ts-node** 进行冷加载开发。

### npm run build

在构建应用程序时，会先用 rimraf ./build 清理 **build** 文件夹，再执行 tsc --project tsconfig.json 进行编译。

### npm run lint:prettier

美化代码

### npm run lint:eslint

检查代码是否符合要求

```jsonc
{
  "dependencies": {
    /* console.log 打印彩色 */
    "chalk": "^4.1.1",
    "cli-spinners": "^2.6.0",
    /* AST2Code */
    "escodegen": "^2.0.0",
    /* Code2AST */
    "esprima": "^4.0.1",
    /* traverse AST */
    "estraverse": "^5.2.0",
    /* 颜色库 */
    "ora": "^5.4.0"
  },
  "devDependencies": {
    "@types/escodegen": "^0.0.6",
    "@types/esprima": "^4.0.2",
    "@types/estraverse": "^5.1.0",
    "@types/estree": "^0.0.47",
    "@types/node": "^15.0.2",
    "@typescript-eslint/eslint-plugin": "^4.22.1",
    "@typescript-eslint/parser": "^4.22.1",
    "eslint": "^7.25.0",
    "eslint-config-prettier": "^8.3.0",
    "eslint-plugin-prettier": "^3.4.0",
    /* 监听文件修改自动运行 ts-node 脚本 nodemon.json */
    "nodemon": "^2.0.7",
    "prettier": "^2.2.1",
    /* rm -rf */
    "rimraf": "^3.0.2",
    "ts-node": "^9.1.1",
    "tsconfig-paths": "^3.9.0",
    "typescript": "^4.2.2"
  }
}
```
