# Webpack

- 模块打包工具，处理浏览器不认识的各种资源，让其能够运行在浏览器
- 基于入口文件，递归解析入口所需要加载的所有资源，然后用不同的 loader 来处理不同类型的文件，用 Plugin 来扩展 webpack 的功能
- 通过分析模块之间的依赖，最终将所有模块打包成一份或者多份代码包，供 HTML 直接引用
- Webpack 仅提供打包功能和文件处理，通过生态中的各种 Loader 和 Plugin 对代码进行预编译和打包
- 因此 Webpack 具有高度的可拓展性，能更好的发挥社区生态的力量

## 作用

- 模块打包
- 使我们在开发时可以使用新特性和新语法
- 能力扩展：plugin、loader

## 概念

- Entry: 入口文件，Webpack 会从该文件开始进行分析与编译；
- Output: 出口路径，打包后创建 bundler 的文件路径以及文件名；
- Module: 源码目录中的每一个文件，在 Webpack 中任何文件都可以作为一个模块，会根据配置的不同的 Loader 进行加载和打包；
- Chunk: webpack 打包过程中的产物，在进行模块的依赖分析的时候，代码分割出来的代码块，可以根据配置，将所有模块代码合并成一个或多个代码块，以便按需加载，提高性能；

::: note

### chunk 类型

- Initial Chunk：基于 Entry 配置项生成的 Chunk
- Async Chunk：异步模块引用，如 `import()` 语句对应的异步 Chunk
- Runtime Chunk：只包含运行时代码的 Chunk

:::

- Loader: 模块加载器，进行各种文件类型的加载与转换，比如 babel-loader 将 jsx 转为 React.createElement；
- Plugin: 拓展插件，可以通过 Webpack 相应的事件钩子，介入到打包过程中的任意环节，从而对代码按需修改；
- Bundle: webpack 打包出来的文件，webpack 最终输出的东西，可以直接在浏览器运行。在抽离 css(当然也可以是图片、字体文件之类的)的情况下，一个 chunk 是会输出多个 bundle 的，但是默认情况下一般一个 chunk 也只是会输出一个 bundle
- vendor: 依赖的第三方库

::: note

### 文件指纹

- hash：所有的 bundle 使用同一个 hash 值，跟每一次 webpack 打包的过程有关
- chunkhash：根据每一个 chunk 的内容进行 hash，同一个 chunk 的所有 bundle 产物的 chunkhash 值是一样的。因此若其中一个 bundle 的修改，同一 chunk 的所有产物 hash 也会被修改
- contenthash：与文件内容本身相关
- 注意：开发环境热更新下只能使用 hash 或者不使用 hash。在生产环境中我们一般使用 contenthash 或者 chunkhash，因为在热更新模式下，会导致 chunkhash 和 contenthash 计算错误

:::

## 配置示例

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Output Management',
    }),
  ],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  externals: {
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_',
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
```

## 工作流程

- 初始化

  1. 初始化配置参数：从配置文件和 Shell 参数中读取与合并得出参数
  1. 创建编译器对象 Compiler
  1. 初始化编译环境：包括注入内置插件、注册各种模块工厂、加载配置的插件等
  1. 开始编译：执行 compiler 对象的 run 方法
  1. 确定入口：根据配置中的 entry 找出所有的入口文件

- 构建

  1. 编译模块：从入口文件出发，调用 loader 将模块转译为标准 JS 内容，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理，并在合适的时机点触发广播事件，Plugin 收听这些事件执行相应方法
  1. 完成模块编译：上一步递归处理所有能触达到的模块后，得到了每个模块被翻译后的内容以及它们之间的 依赖关系图

- 生成

  1. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
  1. 写入文件系统：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

- 以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到事件后会执行特定逻辑，并且插件可以调用 Webpack 提供的 api 改变 Webpack 的运行结果

## rollup 和 webpack 区别

- webpack 支持代码拆分、按需加载
- rollup 所有资源放在同一个地方，一次性加载，利用 tree-shake 特性来剔除项目中未使用的代码，减少冗余
- 对于应用使用 webpack，对于类库使用 rollup，rollup 适用于基础库的打包，如 vue、react
- 如果你需要代码拆分(Code Splitting)，或者你有很多静态资源需要处理，再或者你构建的项目需要引入很多 CommonJS 模块的依赖，那么 webpack 是个很不错的选择
- 如果您的代码库是基于 ES2015 模块的，而且希望你写的代码能够被其他人直接使用，你需要的打包工具可能是 rollup

## Tree-Shaking

- 基于 ES Module 规范的死码删除技术
- 在运行过程中静态分析模块之间的导入导出，确定 ESM 模块中哪些导出值未曾被其它模块使用，并将其删除，以此实现打包产物的优化

::: tip

### 实现 Tree Shaking 技术的必要条件

- 在 CommonJs、AMD、CMD 等旧版本的 JavaScript 模块化方案中，导入导出行为是高度动态，难以预测的
- 而 ESM 方案则从规范层面规避这一行为，它要求所有的导入导出语句只能出现在模块顶层，且导入导出的模块名必须为字符串常量
- 所以，ESM 下模块之间的依赖关系是高度确定的，与运行状态无关，编译工具只需要对 ESM 模块做静态分析，就可以从代码字面量中推断出哪些模块值未曾被其它模块使用

:::
