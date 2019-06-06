'use strict';

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

Function.prototype.bind = Function.prototype.bind || function (that) {
    // fn.bind(obj)
    var target = this;

    // 如果target不是函数，报错
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }

    // 拿到传入bind的参数，从第二个开始，第一个是指定的this
    var args = slice.call(arguments, 1);

    var bound;

    // 调用绑定参数实际执行的参数
    var binder = function () {
        // 如果把绑定函数当作构造含，通过new调用  this 应该是bound的实例
        if (this instanceof bound) {
            // 需要判断绑定函数的返回结果的类型，保证函数运行后返回的是new bound()的实例对象
            var result = target.apply(this,args.concat(slice.call(arguments)));
            // 如果返回的就是new bound()的实例，直接返回
            if (Object(result) === result) {
                return result;
            }
            // 否则返回固定值
            return this;
        } else {
            // 第一次传入的参数 + 后面传入的参数
            return target.apply(that,args.concat(slice.call(arguments)));
        }
    };

    // target.length 需要通过bind指定this的函数定义时的形参个数
    //args.length 调用bind函数时传入的实参个数，不包括第一个
    /*
        比如：
            function test(a, b){
                return a + b;
            }
            var _test = test.bind(this, a)

            target = test
            target.length = 2
            args = [2]
            args.length =1;

            target.length - args.length = 0 传入了所有参数
            target.length - args.length > 0 传了部分参数
            target.length - args.length < 0  多传了参数，会省略后面的多于参数
    */
    // boundLength 剩余参数个数, 设置剩余参数占位符
    var boundLength = Math.max(0, target.length - args.length);
    // 设置剩余参数占位
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }
    
    // 生成一个函数  第一个是参数， 第二个是函数 的函数体
    /*
        var bound = function(binder){
            // 剩余参数
            return function (a, b){
                return binder.apply(this, arguments)
            }
        }
        bound(binder);
    */
   // ${boundArgs.join(',') $0, $1 形参
    bound = Function('binder', `return function (${boundArgs.join(',')}){
                                                    return binder.apply(this,arguments); 
                                                }`)(binder);
        
    // 如果指定的函数 存在原型链 将返回的绑定函数的原型指向原函数的原型
    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
        /* var __proto__ = Object.create(target.prototype);
        bound.prototype = __proto__;
        bound.prototype.constructor = bound; */
    }

    return bound;
};