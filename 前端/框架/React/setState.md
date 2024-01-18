# setState

## 为什么不要在 render 中 setState？

setState 会触发 render，造成死循环

## setState 如何深合并

- 方法一：使用展开运算符
- 方法二：先直接赋值，最后再调一次 setState({})

## setState 执行过程

- 将传递给 setState 的对象合并到组件的当前状态
- 构建一个新的虚拟 dom
- 将新树与旧树比较，计算出新旧树的节点差异，确定需要更新的真实 dom
- 调用 render 方法更新 UI

## setState 同步还是异步

- 与调用时的环境相关
- 在 合成事件 和 生命周期钩子中，setState 是异步的，会把多次调用进行合并，如果需要马上同步去获取新值，setState 可以传入第二个参数，在回调中即可获取最新值
- 在 原生事件 和 setTimeout、setInterval、promise 等异步操作中，setState 是同步的，可以马上获取更新后的值，原因: 原生事件是浏览器本身的实现，与事务流无关，而 setTimeout 是放置于定时器线程中延后执行，此时事务流已结束，因此也是同步

::: tip

**原因：**

- 在 React 的 setState 函数实现中，会根据一个变量 isBatchingUpdates 判断是直接更新 this.state 还是放到队列中回头再说，而 isBatchingUpdates 默认是 false，也就表示 setState 会同步更新 this.state
- 但是，有一个函数 batchedUpdates，这个函数会把 isBatchingUpdates 修改为 true，而当 React 在调用事件处理函数之前就会调用这个 batchedUpdates
- 就是由 React 控制的事件处理过程 setState 不会同步更新 this.state
- setState 在 react 生命周期和合成事件会批量覆盖执行
- 当遇到多个 setState 调用的时候会提取单次传递 setState 对象，将它们进行合并（类似 Object.assign，遇到相同 key 会覆盖前面的 key）

:::

::: note

合成事件：react 为了解决跨平台，兼容性问题，自己封装了一套事件机制，代理了原生的事件，像在 jsx 中常见的 onClick、onChange

:::

::: tip

**批量更新机制**

在 合成事件 和 生命周期钩子 中，setState 更新队列时，存储的是合并状态(Object.assign)。因此前面设置的 key 值会被后面所覆盖，最终只会执行一次更新

:::

## setState 函数型式

- 由于 Fiber 及 合并 的问题，官方推荐可以传入 函数 的形式。setState(fn)，在 fn 中返回新的 state 对象即可，例如 this.setState((state, props) => newState)；
- 使用函数型式，可以用于避免 setState 的批量更新的逻辑，传入的函数将会被 顺序调用

::: warning

- setState 合并，在 合成事件 和 生命周期钩子 中多次连续调用会被优化为一次
- 当组件已被销毁，如果再次调用 setState，React 会报错警告，通常有两种解决办法：

  - 将数据挂载到外部，通过 props 传入，如放到 Redux 或 父级中
  - 在组件内部维护一个状态量 (isUnmounted)，componentWillUnmount 中标记为 true，在 setState 前进行判断

:::
