function Dep() {
    // 存放订阅了变量的watcher的数组
  this.subs = [];
}
Dep.prototype = {
    // 订阅
  addSub: function (sub) {
    this.subs.push(sub);
  },
  // 通知所有watcher
  notify: function () {
    this.subs.forEach(function (sub) {
      // 更新watcher中的变量
        sub.update();
    })
  }
}