# 前端

## 帧动画

- 概念：每隔一个短暂时间进行图像替代，使其连续播放而成动画
- 可以自由控制播放、暂停和停止
- 可以控制播放次数，播放速度
- 可以添加交互，在播放完成后添加事件
- 浏览器兼容性好
- https://juejin.cn/post/6844903790370357262

::: note 实现

- CSS3 阶梯函数：<https://codesandbox.io/s/jie-ti-han-shu-shi-xian-zheng-dong-hua-shi-li-8r65b1>
- 通过 JS 来控制 img 的 src 属性切换（不推荐）
- 通过 JS 来控制 Canvas 图像绘制，用 drawImage 方法将图片绘制到 Canvas 上，不断擦除和重绘
- 通过 JS 来控制 CSS 属性值变化

:::

## Browserslist

- 用特定的语句来查询浏览器列表
  ```sh
  # 查询 Chrome 最后的两个版本
  npx browserslist "last 2 Chrome versions"
  chrome 96
  chrome 95
  ```
- autoprefixer 和 babel 都会用到
- 开发过程中为了减小垫片的体积，避免使用过多没必要的垫片
- 当我们确认的浏览器版本号，那么它的垫片体积就可以确认
- 例如：当我们确认的浏览器版本号，那么它的垫片体积就会确认

### caniuse-lite 与 caniuse-db

- browserslist 是从 caniuse-lite 这个库中查询数据的，caniuse-lite 是 caniuse-db 的精简版本，对 caniuse-db 的数据按一定规则做了简化，减少了库的大小
- caniuse-db 则是 can i use 网站的数据源，提供了网站查询所需的所有数据，caniuse-db 发布时会同步发布 caniuse-lite
- caniuse-lite 这个库也由 browserslist 团队进行维护
- 由于它们都不属于线上数据库，使用时会将数据克隆至本地，所以可能会存在本地数据不是最新的情况，browserslist 提供了更新 caniuse-lite 的命令，可定期运行以获取最新数据
  ```sh
  npx browserslist@latest --update-db
  ```

### 原理

- browserslist 根据正则解析查询语句，对浏览器版本数据库 caniuse-lite 进行查询，返回所得的浏览器版本列表
- 因为 browserslist 并不维护数据库，因此它会经常提醒你去更新 caniuse-lite 这个库

## 虚拟列表

- 不能分页的情况下渲染多条（上万级别）数据
- 只对可见区域进行渲染，对非可见区域中的数据不渲染或部分渲染的技术，从而达到极高的渲染性能

### 实现描述

- 首屏加载时，只加载可视区域内需要的列表项
- 滚动发生时，计算出可视区域内的列表项，并将非可视区域内存在的列表项销毁

::: note 列表项动态高度问题

- 列表项包含文字或图片，图片加载完成是异步的，无法预判高度
- 对组件属性 itemSize 进行扩展，支持传递类型为数字、数组、函数
- 将列表项渲染到屏幕外，对其高度进行测量并缓存，然后再将其渲染至可视区域内
- 以预估高度先行渲染，然后获取真实高度并缓存
- 使用新 api：ResizeObserver 监听图片尺寸变化，但需要考虑浏览器兼容性

:::

::: note scroll 事件频繁触发问题

- IntersectionObserver

:::

## 函数式编程

### 是什么

- 函数式编程是一种编程范式，目标是使用函数来抽象作用在数据之上的控制流与操作，从而在系统中消除副作用并减少对状态的改变，
- 旨在尽可能地提高代码的无状态性和不变性
- 主要思想是把运算过程尽量写成一系列嵌套的函数调用，比如柯里化、react 的高阶函数

### 函数式库：Ramda.js、lodash、RxJS

### 命令模式中 run 函数的好处

- 将函数本身参数化，非侵入式的修改函数，无需重写任何内部逻辑

### 为什么纯函数

- 易于维护：无状态的代码不会改变或破坏全局的状态
- 易于测试：不依赖外部资源的算法
- 灵活便于重用、保持业务逻辑代码的纯净
- 任务分解，一定程度增加代码可读性
- 函数式的控制流能够在不需要研究任何内部细节的条件下提供该程序意图的清晰结构，这样就能更深刻地了解代码，并获知数据在不同阶段是如何流入和流出的

## 多包项目

- <https://juejin.cn/post/6844903568751722509>

## Blob

- 表示二进制类型的大对象，不可变的类似文件对象的原始数据
- 含有两个属性：size 和 type，size 属性表示数据大小（以字节为单位），type 是 MIME 类型的字符串

## File

- 基于 Blob，继承了 Blob 的功能并将其扩展使其支持用户系统上的文件
- 提供有关文件的信息，并允许网页中的 JavaScript 访问其内容，比如 input 上传文件返回的 FileList 中的元素

## 后端一次给 10 万条数据，如何处理展示

- 直接遍历渲染（耗时最高，不推荐）
- setTimeout 分页渲染：把 10w 按照每页数量 limit 分成总共 Math.ceil(total / limit)页，然后利用 setTimeout，每次渲染 1 页数据
- 使用 requestAnimationFrame 代替上一条的 setTimeout
- 文档碎片(createDocumentFragment) + requestAnimationFrame
- 懒加载：在列表尾部放一个空节点 blank，等到 blank 出现在视图中（使用 getBoundingClientRect），就说明到底了，这时候再加载第二页，以此类推
- 虚拟列表

## 如何拿到动画帧数

- <https://www.cnblogs.com/coco1s/p/8029582.html>

## sourceMap

- 将编译、打包、压缩后的代码映射回源代码的技术
- 由于打包压缩后的代码并没有阅读性可言，一旦在开发中报错或者遇到问题，直接在混淆代码中 debug 问题会带来非常糟糕的体验
- sourceMap 可以帮助我们快速定位到源代码的位置，提高我们的开发效率
- 需要浏览器支持
- 在压缩代码的末端加上，即可让 sourceMap 生效

  ```javascript
  //# sourceURL=/path/to/file.js.map
  ```

- 有了这段注释后，浏览器就会通过 sourceURL 去获取这份映射文件

## 单页应用（SPA）优缺点

优点：

- 内容的改变不需要重新加载整个页面，用户体验好
- 相对对服务器压力小
- 前后端职责分离，架构清晰，前端进行交互逻辑，后端负责数据处理

缺点：

- 首屏加载慢
- 前进后退路由需要自己管理，不能使用浏览器的前进后退功能
- SEO（搜索优化）难度大
