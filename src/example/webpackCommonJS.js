/**
 * webpack 将模块作为对象（key为模块名，value为模块体函数）传入 IIFE（immediately-invoked function expression 立即调用函数表达式） 里
 */

const modules = {
  './index.js'(module, exports, webpackRequire) {
    'use strict'
    //index.js
    const test = new webpackRequire(/*! ./test */ './test.js')
    test.test()
    //# sourceURL=webpack:///./index.js?
  },
  './test.js'(module, exports) {
    'use strict'
    exports.test = function () {
      return 1
    }
    //# sourceURL=webpack:///./test.js?
  },
}

;(function (modules) {
  // webpackBootstrap
  // 模块的缓存
  var installedModules = {}

  // 请求模块函数
  function __webpack_require__(moduleId) {
    // 检查该 module 是否缓存，如果有导出
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports
    }
    // 创建新的模块 (并且 put 到缓存里)
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    })

    // 执行模块函数
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)

    // 将模块标记为已加载
    module.l = true

    // 返回 module.exports 的内容
    return module.exports
  }

  // 曝光 modules 对象 (__webpack_modules__)
  __webpack_require__.m = modules

  // 曝光 modules 缓存
  __webpack_require__.c = installedModules

  // ····· 省略无关代码

  // __webpack_public_path__
  __webpack_require__.p = '/dev-to-b/'

  // 首次加载模块并返回导出
  return __webpack_require__((__webpack_require__.s = './index.js'))
})(modules)

/**
 * - 在立即执行函数内，首先定义了 installedModules 对象 ，这个对象被用来缓存已加载的模块。
 * - 定义了 __webpack_require__ 这个函数，用来 hack 模块的请求，函数参数为模块的 id。
 * - __webpack_require__ 内：
 *  - 首先会检查是否缓存了该模块，
 *   - 如果有，则直接返回缓存模块的exports（所以 commonjs 和 es module 的一个区别是输出拷贝，而不是输出引用）。
 *   - 如果没有，表示首次加载，则首先初始化模块，并将模块进行缓存。
 *  - 然后 bind 执行模块函数（bind 的目的是将 module.exports 作为模块函数 this 指向），将 module、module.exports 和 __webpack_require__ 作为参数传入，
 *  - 执行完成后，将模块标记为已加载。
 *  - 返回模块 exports 的内容。
 * - 最后执行 __webpack_require__ 函数，require 默认的 './index.js' 模块，也就是入口模块。
 */
