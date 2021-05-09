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
