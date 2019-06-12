/**
 * 分析webpack打包文件 入口文件import了其他文件
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
        modules[moduleId].call(module.exports, module, module.exports,__webpack_require__);
        
        // Return the exports of the module
        return module.exports;
    }

    // Load entry module and return exports
    return __webpack_require__("./src/index.js");
})(
    {

        "./src/data.js": function (module, __webpack_exports__, __webpack_require__) {

            "use strict";
            // 替代了 export default 
            __webpack_exports__["default"] = ("data init...");
        },

        "./src/index.js": function (module, __webpack_exports__, __webpack_require__) {

            "use strict";
            // 替代了import data from "./data.js"
            var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/data.js");
            console.log(_data__WEBPACK_IMPORTED_MODULE_0__["default"]);
            console.log("webpack demo");

        }

    }
);