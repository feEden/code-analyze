const acorn = require("acorn");
const walk = require("acorn-walk");
const magicString = require("magic-string");

const source = "const app = 'is Koa2';";
const ast = acorn.parse(source);

const result = new magicString(source);
/* Node {
    type: 'Program',
    start: 0,
    end: 21,
    body:[
        Node {
            type: 'VariableDeclaration',
            start: 0,
            end: 21,
            declarations: [Array],
            kind: 'const'
        }
    ],
    sourceType: 'script'
} */
//console.log(ast);

// 简单遍历
walk.simple(ast, {
    // 拦截所有字面量
    /* Node {
        type: 'Literal',
        start: 12,
        end: 21,
        value: 'is Koa2',
        raw: '\'is Koa2\'' } */
    Literal(node){
        //is Koa2
        //console.log(node.value);
    },
    // 拦截变量声明
    VariableDeclaration(node){
        const {start} = node;
        result.overwrite(start, start + 5, "var");
    }
})

//执行“简单”遍历树，构建祖先节点数组 传给ancestors
/* walk.ancestor(ast, {
    Literal(_, ancestors){
        //console.log(_);
        console.log(ancestors.map(n => n))
    }
}) */

//处理后的值：var app = 'is Koa2';
console.log("处理后的值：" + result.toString());