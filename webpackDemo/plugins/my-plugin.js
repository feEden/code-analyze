const pluginName = 'MyPlugin';

class MyPlugin {
  // 执行插件的方法 传入webpack实例compiler
  apply(compiler) {
    /**
     *  实现一个订阅(tap)，当webpack启动的时候，将会触发回调函数，返回被编译的字符串
        pluginName 插件名 做标识用 可以任意
        compilation compile生成的新的编译
    **/
    /* compiler.hooks.run.tap(pluginName, compilation => {
      console.log('The webpack build process is starting!!!');
    }); */

    compiler.hooks.compilation.tap(pluginName, compilation => {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(pluginName, data =>{
        console.log(data);
        const {html, assets} = data;
      })
    });
  }
}

module.exports = MyPlugin;