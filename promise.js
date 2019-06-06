(function (window, undefined) {

    // resolve 和 reject 最终都会调用该函数
    var final = function (status, value) {
        var promise = this, fn, st;

        if (promise._status !== 'PENDING') return;

        // 所以的执行都是异步调用，保证then是先执行的
        setTimeout(function () {
            promise._status = status;
            st = promise._status === 'FULFILLED'
            queue = promise[st ? '_resolves' : '_rejects'];

            while (fn = queue.shift()) {
                // 执行then传递的回调
                value = fn.call(promise, value) || value;
            }

            promise[st ? '_value' : '_reason'] = value;
            promise['_resolves'] = promise['_rejects'] = undefined;
        });
    }

    //参数是一个函数，内部提供两个函数作为该函数的参数,分别是resolve 和 reject
    var Promise = function (resolver) {
        if (!(typeof resolver === 'function'))
            throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
        //如果不是promise实例，就new一个
        if (!(this instanceof Promise)) return new Promise(resolver);

        var promise = this;
        promise._value;
        promise._reason;
        promise._status = 'PENDING';
        //存储状态
        promise._resolves = [];
        promise._rejects = [];

        // 执行回调 将回调的结果保存，提供给下一个thenalbel使用
        var resolve = function (value) {
            //由於apply参数是数组
            final.apply(promise, ['FULFILLED'].concat([value]));
        }

        var reject = function (reason) {
            final.apply(promise, ['REJECTED'].concat([reason]));
        }

        resolver(resolve, reject);
    }

    /**
     * 1. 保存回调函数
     * 2. 返回promise对象，保证链式调用
     * 3. 如果then的回调函数有返回值，需要传递给下一个promise
     */
    Promise.prototype.then = function (onFulfilled, onRejected) {
        var promise = this;
        // 每次返回一个promise，保证是可thenable的
        return new Promise(function (resolve, reject) {

            // 处理resolved
            function handle(value) {
                // 這一步很關鍵，只有這樣才可以將值傳遞給下一個resolve
                /**
                 * 如果onFulfilled是个函数，并且有返回值
                 */
                var ret = typeof onFulfilled === 'function' && onFulfilled(value) || value;

                //判断是不是promise 对象 或者有thenable方法的对象
                if (ret && typeof ret['then'] == 'function') {
                    // 如果回调函数的返回值是一个promsie,将promise中的值取出来
                    ret.then(function (value) {
                        resolve(value);
                    }, function (reason) {
                        reject(reason);
                    });
                } else {
                    // ret不是promise对象，直接将值传递给下一个then
                    resolve(ret);
                }
            }

            // 处理rejected
            function errback(reason) {
                reason = typeof onRejected === 'function' && onRejected(reason) || reason;
                reject(reason);
            }

            if (promise._status === 'PENDING') {
                promise._resolves.push(handle);
                promise._rejects.push(errback);
            } else if (promise._status === "FULFILLED") { // 状态改变后的then操作，立刻执行
                onFulfilled(promise._value);
            } else if (promise._status === "REJECTED") {
                onRejected(promise._reason);
            }
        });
    }

    Promise.prototype.catch = function (onRejected) {
        return this.then(undefined, onRejected)
    }

    Promise.prototype.delay = function (ms, value) {
        return this.then(function (ori) {
            return Promise.delay(ms, value || ori);
        })
    }

    Promise.delay = function (ms, value) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
                console.log('1');
            }, ms);
        })
    }

    Promise.resolve = function (arg) {
        return new Promise(function (resolve, reject) {
            resolve(arg)
        })
    }

    Promise.reject = function (arg) {
        return Promise(function (resolve, reject) {
            reject(arg)
        })
    }

    Promise.all = function (promises) {
        if (!Array.isArray(promises)) {
            throw new TypeError('You must pass an array to all.');
        }
        return Promise(function (resolve, reject) {
            var i = 0,
                result = [],
                len = promises.length,
                count = len

            //这里与race中的函数相比，多了一层嵌套，要传入index
            function resolver(index) {
                return function (value) {
                    resolveAll(index, value);
                };
            }

            function rejecter(reason) {
                reject(reason);
            }

            function resolveAll(index, value) {
                result[index] = value;
                if (--count == 0) {
                    resolve(result)
                }
            }

            for (; i < len; i++) {
                promises[i].then(resolver(i), rejecter);
            }
        });
    }

    Promise.race = function (promises) {
        if (!Array.isArray(promises)) {
            throw new TypeError('You must pass an array to race.');
        }
        return Promise(function (resolve, reject) {
            var i = 0,
                len = promises.length;

            function resolver(value) {
                resolve(value);
            }

            function rejecter(reason) {
                reject(reason);
            }

            for (; i < len; i++) {
                promises[i].then(resolver, rejecter);
            }
        });
    }

    window.Promise = Promise;

})(window);
