# Plugin

- <https://www.webpackjs.com/contribute/writing-a-plugin/>
- 构建流程中引入自定义的行为，需要理解 webpack 底层的特性来处理相应的钩子
- 通常是一个带有 apply 方法的类
- 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果
- compiler 暴露了和 Webpack 整个生命周期相关的钩子：<https://www.webpackjs.com/api/compiler-hooks/>
- compilation 则暴露了与模块和依赖有关的粒度更小的事件钩子：<https://www.webpackjs.com/api/compilation-hooks/>

```javascript
class MyPlugin {
  apply(compiler) {
    // 找到合适的事件钩子，实现自己的插件功能
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      // compilation: 当前打包构建流程的上下文
      console.log(compilation);

      // do something...
    });
  }
}
```

## 常见 Plugin

- definePlugin：定义环境变量
- html-webpack-plugin
- mini-css-extract-plugin: 分离样式文件，CSS 提取为独立文件，支持按需加载 (替代 extract-text-webpack-plugin)
- clean-webpack-plugin
