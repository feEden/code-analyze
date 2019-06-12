/**
 * 分析webpack的打包文件 单文件
 * @param {Object} modules 入口文件：执行函数 
 */
(function (modules) {
    // 缓存加载过的模块
    var installedModules = {};

    /**
     * 用来加载模块
     * @param {*} moduleId  模块ID
     */
    function __webpack_require__(moduleId) {
    
        // 判断这个模块是否加载过 是直接从缓存中返回
        if (installedModules[moduleId]) {
          return installedModules[moduleId].exports;
        }

        // 没有的话，加载，并放在缓存中
        var module = installedModules[moduleId] = {
          exports: {}
        };
        
        // 加载模块 执行入口文件对应的函数
        modules[moduleId].call(module.exports, module, module.exports);
        
        // Return the exports of the module
        return module.exports;
    }

    // Load entry module and return exports
    return __webpack_require__("./src/index.js");
})(
    {

        "./src/index.js":function (module, exports) {
            console.log("webpack demo");
        }
    }
);