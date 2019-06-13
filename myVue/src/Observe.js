    function defineReactive(vm, key, val) {
        // 存放定义好的观察者watcher(携带了唯一标识和数据)
      var dep = new Dep();

      /**
       * 将data依次注入到vm上，拦截get、set方法
       *    get: 第一次获取值的时候，将watcher保存，订阅
       *    set: 当值被修改时，通知dep中所有订阅了该变量的watcher
       */
      Object.defineProperty(vm, key, {
        get: function () {
          if (Dep.target) {
            // JS的浏览器单线程特性，保证这个全局变量在同一时间内，只会有同一个监听器使用
            dep.addSub(Dep.target);
          }
          return val;
        },
        set: function (newVal) {
          if (newVal === val) return;
          val = newVal;
          // 作为发布者发出通知
          dep.notify();
        }
      })
    }

    /**
     * 将data中的属性依次定义当Vue实例上
     * @param {*} obj 传入的数据对象 
     * @param {*} vm  Vue实例
     */
    function observe(obj, vm) {
      Object.keys(obj).forEach(function (key) {
        defineReactive(vm, key, obj[key]);
      })
    }