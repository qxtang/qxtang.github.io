# Loader

- Loader 本质上是导出函数的 JavaScript 模块，可用于实现内容转换，进行各种文件类型的加载与转换，比如 babel-loader 将 jsx 转为 React.createElement
- webpack 只认识 JavaScript，Loader 将资源转化成 Webpack 可以理解的内容
- 当 Webpack 在转换某文件类型的时候，会按顺序链式调用每一个 loader
- loader 的开发需要遵循一些规范，比如返回值必须是标准的 JS 代码字符串，以保证下一个 loader 能够正常工作

## 编写 loader

- <https://webpack.docschina.org/contribute/writing-a-loader/>
- 通常是一个函数

  ```javascript
  module.exports = function (source, sourceMap?, data?) {
    // source：为 loader 的输入，可能是文件内容，也可能是上一个 loader 处理结果
    // sourceMap：可选参数，代码的 sourcemap 结构
    // data：可选参数，其它需要在 Loader 链中传递的信息
    return source;
  };
  ```

- 通过 return 语句返回处理结果，除此之外 Loader 还可以调用 callback api 返回更多信息，供下游 Loader 或者 Webpack 本身使用
- callback 签名：

  ```typescript
  this.callback(
    // 异常信息，Loader 正常运行时传递 null 值即可
    err: Error | null,
    // 转译结果
    content: string | Buffer,
    // 源码的 sourcemap 信息
    sourceMap?: SourceMap,
    // 任意需要在 Loader 间传递的值
    // 经常用来传递 ast 对象，避免重复解析
    data?: any
  );
  ```

- loader 例子：

  ```javascript
  module.exports = function (source) {
    const content = doSomeThing2JsString(source);

    // 如果 loader 配置了 options 对象，那么this.query将指向 options
    const options = this.query;

    // 可以用作解析其他模块路径的上下文
    console.log('this.context');

    /*
     * this.callback 参数：
     * error：Error | null，当 loader 出错时向外抛出一个 error
     * content：String | Buffer，经过 loader 编译后需要导出的内容
     * sourceMap：为方便调试生成的编译后内容的 source map
     * ast：本次编译生成的 AST 静态语法树，之后执行的 loader 可以直接使用这个 AST，进而省去重复生成 AST 的过程
     */
    this.callback(null, content);
    // or return content;
  };
  ```

## 为什么 loader 执行顺序是从右到左

- webpack 选择了函数式编程的方式，
- 最左侧的 loader 返回值必须是 JS 模块，不然 webpack 无法识别其他语言模块（webpack 只认识 JS 和 JSON）

## 常见 loader

- raw-loader：加载文件原始内容（utf-8）
- image-loader：加载并且压缩图片文件
- file-loader: 加载文件资源，如 字体 / 图片 等，具有移动/复制/命名等功能、把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件
- url-loader: 通常用于加载图片，可以将小图片直接转换为 Date Url，减少请求；和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中去
- babel-loader: 加载 js / jsx 文件， 将 ES6 / ES7 代码转换成 ES5，抹平兼容性问题；
- ts-loader: 加载 ts / tsx 文件，编译 TypeScript；
- style-loader: 将 css 代码以 style 标签形式插入
