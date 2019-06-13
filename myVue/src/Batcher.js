/**
 * 批处理构造函数
 * @constructor
 */
function Batcher() {
    this.reset();
}

/**
 * 批处理重置
 */
Batcher.prototype.reset = function () {
    this.has = {};
    this.queue = [];
    this.waiting = false;
};

/**
 * 将事件添加到队列中
 * @param job {Watcher} watcher事件
 */
Batcher.prototype.push = function (job) {
    let id = job.id;

    // 判断当前watcher是否正在处理
    if (!this.has[id]) {
        console.log(batcher);

        // watcher执行队列
        this.queue.push(job);

        //设置元素的ID
        this.has[id] = true;

        // 观察同一种属性的观察者，触发一次更新，将任务队列中的watcher全部更新
        if (!this.waiting) {
            this.waiting = true;

            // 不阻塞主线程地条件下，尽早地执行更新
            if ("Promise" in window) {
                Promise.resolve().then( ()=> {
                    this.flush();
                })
            } else {
                setTimeout(() => {
                    this.flush();
                }, 0);
            }
        }
    }
};

/**
 * 执行并清空事件队列
 */
Batcher.prototype.flush = function () {
    this.queue.forEach((job) => {
        // 更新dom
        job.cb();
    });
    this.reset();
};