# NodeJS

## 特点

- 它是一个 Javascript 运行环境
- 依赖于 Chrome V8 引擎进行代码解释
- 事件驱动、非阻塞 I/O 模型（简单讲就是每个函数都是异步的）
- 单进程，单线程

## 应用场景

- 高并发连接场景

  - 异步机制、事件驱动整个过程没有阻塞新用户的连接，也不需要维护已有用户的连接。
  - 基于这样的机制，理论上陆续有用户请求连接，NodeJS 都可以进行响应，因此 NodeJS 能支持比 Java、PHP 程序更高的并发量，虽然维护事件队列也需要成本

- I/O 阻塞

  - Java、PHP 也有办法实现并行请求（子线程），但 NodeJS 通过回调函数（Callback）和异步机制会做得很自然

- 开发 RESTful API

## 优缺点

优点：

- 高并发场景
- 适合 I/O 密集型应用

缺点：

- 不适合 CPU 密集型应用，由于 JavaScript 单线程的原因，如果有长时间运行的计算（比如大循环），会导致 CPU 时间片不能释放，使得后续 I/O 无法发起
- 只支持单核 CPU，不能充分利用 CPU
- 可靠性低，一旦代码某个环节崩溃，整个系统都崩溃
- npm 太自由，开源组件库质量参差不齐，更新快，向下不兼容

解决方案：

- Nginx 反向代理，负载均衡，开多个进程，绑定多个端口
- 开多个进程监听同一个端口，使用 cluster 模块；使用比如 pm2 之类的工具

## 异常处理

- try catch，缺点明显，无法处理异步代码块内出现的异常，比如 setTimeout
- 使用 event 原生模块，监听 error 事件
- 原生模块的 callback 函数一般都会抛出错误（第一个参数）

## 包结构

- package.json：包描述文件
- bin：用于存放可执行二进制文件的目录
- lib：用于存放 JavaScript 代码的目录
- doc：用于存放文档的目录
- test：用于存放单元测试用例的代码

## cluster 原理

<!-- TODO -->

## pipe 原理

<!-- TODO -->

## 洋葱圈模型

- 每次当有一个请求进入的时候，每个中间件都会被执行两次
- 每个中间件都接收了一个 next 参数，在 next 函数运行之前的中间件代码会在一开始就执行，next 函数之后的代码会在内部的中间件全部运行结束之后才执行，就像一根筷子穿过一个洋葱，同一层皮会被筷子穿过两次

### 实现思路

- this.middleware 是中间件集合的数组
- koa-compose 模块的 compose 方法用来构建执行顺序

```javascript
// middleware 用来保存中间件
app.use = (fn) => {
  this.middleware.push(fn);
  return this;
};

// compose 组合函数来规定执行次序
function compose(middleware) {
  // context：上下文，next：传入的接下来要运行的函数
  return function (context, next) {
    function dispatch(i) {
      index = i;
      // 中间件
      let fn = middleware[i];
      if (!fn) return Promise.resolve();
      try {
        // 我们这边假设和上文中的例子一样，有A、B、C三个中间件
        // 通过dispatch(0)发起了第一个中间件A的执行
        // A中间件执行之后，next作为dispatch(1)会被执行
        // 从而发起了下一个中间件B的执行，然后是中间件C被执行
        // 所有的中间件都执行了一遍后，执行Promise.resolve()
        // 最里面的中间件C的await next()运行结束，会继续执行console.log("C2")
        // 整个中间件C的运行结束又触发了Promise.resolve
        // 中间件B开始执行console.log("B2")
        // 同理，中间件A执行console.log("A2")
        return Promise.resolve(
          fn(context, () => {
            return dispatch(i + 1);
          })
        );
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return dispatch(0);
  };
}
```

## node 多线程如何实现、如何通信与调度策略

<!-- TODO -->

## Node.js 如何处理 ES6 模块

- https://www.ruanyifeng.com/blog/2020/08/how-nodejs-use-es6-module.html
- Node.js 遇到.mjs 文件，就认为它是 ES6 模块，默认启用严格模式
- 如果不希望将后缀名改成.mjs，可以在项目的 package.json 文件中，指定 type 字段为 module

  ::: tip

  此时 import 路径要加上 `.js` 拓展名，否则会报错  
  这时还要使用 CommonJS 模块，那么需要将 CommonJS 脚本的后缀名都改成.cjs

  :::

- ES6 模块的 import 命令可以加载 CommonJS 模块，但是只能整体加载，不能只加载单一的输出项。

  ```javascript
  // 正确
  import packageMain from 'commonjs-package';

  // 报错
  import { method } from 'commonjs-package';
  ```

## pm2、forever

<!-- TODO -->
