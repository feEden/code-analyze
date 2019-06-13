function Compile(node, vm) {
  if (node) {
    this.$frag = this.nodeToFragment(node, vm);
    return this.$frag;
  }
}
Compile.prototype = {
  nodeToFragment: function (node, vm) {
    var self = this;
    //创建新的空白的文档片段，将子节点添加进去，插入指定地父节点下
    var frag = document.createDocumentFragment();
    var child;

    // node中的结点每次循环会将上一次的子节点移除
    while (child = node.firstChild) {
        //解析dom中的属性值，进行双向绑定
      self.compileElement(child, vm);
      // 将所有子节点添加到fragment中,
      frag.append(child); 
    }
    return frag;
  },
  compileElement: function (node, vm) {
    var reg = /\{\{(.*)\}\}/g;

    //节点类型为元素
    if (node.nodeType === 1) {
      var attr = node.attributes;
      // 解析属性
      for (var i = 0; i < attr.length; i++) {
        if (attr[i].nodeName == 'v-model') {
          var name = attr[i].nodeValue; // 获取v-model绑定的属性名

          // 绑定一个input事件，每次输入值，更新vm中的属性值，触发该属性的set方法，通知所有观察者
          node.addEventListener('input', function (e) {
            // 给相应的data属性赋值，进而触发该属性的set方法
            //再批处理 渲染元素
            vm[name] = e.target.value;
          });
          // node.value = vm[name]; // 将data的值赋给该node 观察者订阅该属性
          new Watcher(vm, node, name, 'value');
        }
      };
    }
    //节点类型为text
    if (node.nodeType === 3) {
        // 解析模板 得到里面的key
      if (reg.test(node.nodeValue)) {
        var name = RegExp.$1; // 获取匹配到的字符串
        name = name.trim();
        // node.nodeValue = vm[name]; // 将data的值赋给该node 观察者订阅该属性
        new Watcher(vm, node, name, 'nodeValue');
      }
    }
  },
}

