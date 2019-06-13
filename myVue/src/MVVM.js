function Vue(options) {
    // { test: Hello world}
  this.data = options.data;
  var data = this.data;
  // 将data注入到Vue实例中, 实现数据绑定
  observe(data, this);

  // 注入编译后模板的父节点
  var id = options.el;
  // 进行模板编译
  var dom = new Compile(document.getElementById(id), this);
  // 编译完成后，将dom添加到id结点下
  document.getElementById(id).appendChild(dom);
}