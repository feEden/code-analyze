// 自定义laoder

const loaderUtils = require("loader-utils");
const acorn = require("acorn");
const walk = require("acorn-walk");
const magicString = require("magic-string");

/**
 * content 源码
 */
module.exports = function(content, map, meta){
    //输出前置钩子的设定的值
    console.log(this.data);

    // this表示当前的loader  获取loader定义的optins
    const options = loaderUtils.getOptions(this);

    //{ data: '自定义loader' }
    console.log(options);

    // 转换成ast,对数据进行处理  将const 换成 var
    const ast = acorn.parse(content);
    const result = new magicString(content);

    // 简单遍历
    walk.simple(ast, {
        // 拦截变量声明
        VariableDeclaration(node){
            const {start} = node;
            result.overwrite(start, start + 5, "var");
        }
    })

    // 返回处理好的数据 交给下一个loader
    return result.toString();
}

/**
 *  前置钩子
 *  r 入口文件的全路径
 *  p 
 *  data 绑定的数据
 */
module.exports.pitch = function(r, p, data){
    console.log(r, p, data)
    data.value = "前置钩子....";
}