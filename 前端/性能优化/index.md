# 性能优化

## gzip

- 只对文本文件有效，比如 js、css，流文件无效，比如图片
- 需要浏览器和服务端的同时支持
- 浏览器支持：请求头中添加 accept-encoding，标识对压缩的支持，说明自己接受哪些压缩方法
- 服务端支持：能够返回经过 gzip 压缩的文件，响应头添加 content-encoding: gzip，这个字段用于说明数据的压缩方法
- 服务器实时压缩：可通过配置 nginx 开启，express 框架中有一个 compression 中间件，也可以开启 gzip
- 构建时压缩：可在前端构建时使用 compression-webpack-plugin 插件，减少耗费服务器 CPU 和时间开销
- <https://segmentfault.com/a/1190000012800222>

## Javascript

- 缓存 dom 查找结果
- 用 innerHTML 代替 DOM 操作，减少 DOM 操作次数
- 不频繁修改 DOM
- 如果要修改 DOM 的多个样式可以用 cssText 一次性将要改的样式写入，或将样式写到 class 里，再修改 DOM 的 class 名称

```jsx
// bad
const el = document.querySelector('.myDiv');
el.style.borderLeft = '1px';
el.style.borderRight = '2px';
el.style.padding = '5px';

// good
const el = document.querySelector('.myDiv');
el.style.cssText += 'border-left: 1px; border-right: 2px; padding: 5px;';
// cssText 会覆盖已存在的样式，所以使用 +=
```

- 列表绑定事件，使用事件委托
- 如无必要，不要重写原生方法，因为原生方法底层是用 C/C++实现的，速度更快
- CSS 能做的事情，尽量不用 JS 来做
- 使用 requestAnimationFrame

## CSS

- 避免 css 表达式比如 calc
- 减少选择层级，最高不超过 3 层
- 尽量使用 class 选择器，避免使用标签选择器
- 少使用后代选择器，后代选择器开销高
- 避免对可继承的属性重复定义
- 避免使用通配规则器 `*`，只对需要的元素进行处理
- 属性值为 0 时，不加单位

## webpack

- 压缩 js、css 代码
- webpack 按需加载，React.lazy + import()，Webpack 4 之后，只需要用异步语句 `require.ensure("./xx.js")` 或 `import("./xx.js")` 方式引入模块，就可以实现模块动态加载，遇到异步引入语句时会为该模块单独生成一个 chunk
- 配置 external，将通用库抽离，不打包进 bundle，比如 jquery、lodash，使用 CDN，并开启强缓存
- 配置 babel 动态 polyfill，只针对不支持的浏览器引入 polyfill
- 配置 file-loader 的 limit 选项，小图转 base64
- 开启 tree-shaking 删除多余代码
- antd 按需加载，babel-plugin-import
- webpack 拆包优化
- 第三方库按需加载

## 动态 polyfill 方案

### ​polyfill.io​​（Polyfill Service）（推荐）

- 是一个 script 资源：<https://cdn.polyfill.io/v2/polyfill.js>
- 识别请求中的 User Agent，判断浏览器是否支持某些特性，然后下发不同的 Polyfill

### babel-polyfill

- React 16 官方推荐
- 包体积 200k+，难以单独抽离 Map、Set；项目里 react 是单独引用的 cdn，如果要用它需要单独构建一份放 react 前加载

### babel-plugin-transform-runtime

- 能只 polyfill 用到的类或方法，相对体积较小
- 不能 polyfill 原型上的方法，不适用于业务项目的复杂开发环境

## 其他

- 不常修改的资源（jquery），开启强缓存，配置响应头 Cache-Control 与 Expires
- 减少 http 请求次数：雪碧图、小图片使用字体图标代替
- css 放顶部、js 放底部，非关键性的脚本（比如百度统计），script 标签加上 defer 或者 async
- 单页应用首屏加载放个 loading，优化用户感知，利用一些过渡效果、骨架屏
- 使用 link 标签的 rel 属性，设置 prefetch、preload（preload 将会把资源得下载顺序权重提高，使得关键数据提前下载好，优化页面打开速度）
- 注意项目中是否使用了字体，字体加载也会让首屏加载变得很慢
- 减少 cookie 的体积
- 使用公共 CDN，好处：如果其他网站刚好也用过同一个资源，浏览器会有缓存
- 服务端开启 gzip（gzip 只对文本文件有效，比如 js、css，流文件无效，比如图片）
- 路由懒加载
- 图片懒加载
- 使用字体图标 iconfont 代替图片图标，不会失真，生成的文件体积小

::: tip

将静态资源放在其他域名的原因（CDN）：

- 浏览器对于相同域名有并发请求数限制
- 请求时不会发送 cookie，节省流量
- cookie 会发送给二级域名，所以这些静态资源不放在二级域名，放在单独一级域名

:::

## script 标签的 defer 和 async

- 没有 defer 或 async 属性，浏览器会立即加载并执行相应的脚本
- async：立即下载，下载完立即执行，不确定顺序执行。对于完全独立的脚本来才去使用 async，比如谷歌统计百度统计。一定会在页面的 load 事件前执行，但不确定在 DOMContentLoaded 事件触发前后执行。
- defer：立即下载，将延迟到整个页面都解析完毕后再运行

## js 为什么放最下面？

- 当文档加载过程中遇到 js 文件，html 文档会挂起渲染（加载解析渲染同步）的线程，不仅要等待文档中 js 文件加载完毕，还要等待解析执行完毕，才可以恢复 html 文档的渲染线程，因为 js 有可能会修改 DOM，比如 document.write，这意味着，在 js 执行完成前，后续所有资源的下载可能是没有必要的，这是 js 阻塞后续资源下载的原因。所以平时的代码中，js 是放在 html 文档末尾的

## css 为什么放最上面？

- css 不会阻塞 DOM 的解析，但会阻塞 DOM 渲染
- css 是由单独的下载线程异步下载的
- 但会阻塞 render 树渲染（渲染时需等 css 加载完毕，因为 render 树需要 css 信息）

## 如何判断一个页面卡顿的原因

- 内存泄漏，由于疏忽或者程序的某些错误造成未能释放已经不再使用的内存的情况（比如不再使用的变量额外创建）
- Chrome devTools Performance 查看内存情况
- 打开 Chrome 的无痕模式，这样做的目的是为了屏蔽掉 Chrome 插件对我们之后测试内存占用情况的影响
