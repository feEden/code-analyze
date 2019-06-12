// 将源代码字符串转化成ast
const esprima = require('esprima');
// 遍历ast,替换const
const estraverse = require("estraverse");
// 将ast转换成string
const escodegen = require("escodegen");

const program = 'const answer = 42';

//const result = esprima.parse(program);
// 同上
const result = esprima.parseScript(program);

/* Module {
    type: 'Program',
    body: 
     [ VariableDeclaration {
         type: 'VariableDeclaration',
         declarations: [Array],
         kind: 'const' } ],
    sourceType: 'module' } */
//const result = esprima.parseModule(program);

/* Script {
    type: 'Program',
    body: 
     [ VariableDeclaration {
         type: 'VariableDeclaration',
         declarations: [Array],
         kind: 'const' } ],
    sourceType: 'script' } */
/* console.log(result) */
estraverse.traverse(result, {
    enter(node, parent){
        if(node.type === "VariableDeclaration"){
            node.kind = "var";
        }
    },
    /* leave(node, parent){
        console.log(node);
    } */
});

const code = escodegen.generate(result);
//var answer = 42;
console.log(code);