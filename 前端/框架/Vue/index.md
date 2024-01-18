# Vue

## 参考

- <https://www.cnblogs.com/canfoo/p/6891868.html>

## Vue 生命周期

- beforeCreate
- created
- beforeMount
- mounted：dom 加载完毕，可以进行 ajax 请求和 dom 操作
- beforeUpdate
- updated
- beforeDestroy
- destroyed

## 组件通信方式

- props / $emit 适用 父子组件通信
- parent / children 适用 父子组件通信
- 事件总线 EventBus
- vuex 状态管理库

## vue2 如何监测数组变化

- 使用了函数劫持的方式，重写数组的方法，将 data 中的数组进行了原型链重写，指向了自己定义的数组原型方法
- 当调用数组 api 时，可以通知依赖更新。如果数组中包含着引用类型，会对数组中的引用类型再次递归遍历进行监控

## 为什么 vue 实例的 data 属性必须是一个函数

- js 中，对象为引用类型
- 由于数据对象都指向同一个 data 对象，在一个组件中修改 data 时，其他重用的组件中的 data 会同时被修改
- 使用返回对象的函数，每次都创建一个新对象，引用地址不同，则不会出现这个问题

## nextTick

- 用于在下次 DOM 更新循环结束之后执行延迟回调
- 在修改数据之后立即使用这个方法，获取更新后的 DOM
- 理解：nextTick，是将回调函数延迟在下一次 dom 更新数据后调用，简单的理解是：当数据更新了，在 dom 中渲染后，自动执行该函数。

::: tip

什么时候用：

- created 生命周期中进行的 DOM 操作，要放在 nextTick 的回调函数中
- 想在改变 DOM 元素的数据后，基于新的 dom 做点什么，对新 dom 一系列操作都需要放进 nextTick 回调函数中
- 在使用某个第三方插件时，希望在 vue 生成的某些 dom 动态发生变化时重新应用该插件，比如 swipebox 插件

:::

::: tip

实现原理：

使用了宏任务和微任务。根据执行环境分别尝试采用 Promise、MutationObserver、setImmediate，如果以上都不行则采用 setTimeout 定义了一个异步方法，多次调用 nextTick 会将方法存入队列中，通过这个异步方法清空当前队列

:::

## v-if 和 v-show 的区别

- v-if：动态向 DOM 树内添加或者删除 DOM 元素
- v-show：通过设置 DOM 元素的 display 样式属性控制显隐

## Vue 事件绑定原理

原生事件绑定是通过 addEventListener 绑定给真实元素的，组件事件绑定是通过 Vue 自定义的 $on 实现的

## Vue 模版编译原理

Vue 的编译过程就是将 template 转化为 render 函数的过程。会经历以下阶段：

- 生成 AST 树：首先解析模版，生成 AST 语法树，使用大量的正则表达式对模板进行解析，遇到标签、文本的时候都会执行对应的钩子进行相关处理

- 优化：Vue 的数据是响应式的，但模板中并不是所有的数据都是响应式的。有一些数据首次渲染后就不会再变化，对应的 DOM 也不会变化。优化过程就是深度遍历 AST 树，按照相关条件对树节点进行标记。这些被标记的节点(静态节点)我们就可以跳过对它们的比对

- codegen：将优化后的 AST 树转换为可执行的代码

## keep-alive

- 可以实现组件缓存，当组件切换时不会对当前组件进行卸载
- 常用的两个属性 include/exclude，允许组件有条件的进行缓存
- 两个生命周期 activated/deactivated，用来得知当前组件是否处于活跃状态
- 原理：Vue.js 内部将 DOM 节点抽象成了一个个的 VNode 节点，keep-alive 组件的缓存也是基于 VNode 节点的而不是直接存储 DOM 结构。它将满足条件的组件在一个对象中缓存起来，在需要重新渲染的时候再将 vnode 节点从 cache 对象中取出并渲染

## Vue 性能优化

- 尽量减少 data 中的数据，data 中的数据会增加 getter 和 setter，会收集对应的 watcher
- v-if 和 v-for 不能连用：v-for 的优先级比 v-if 更高，这意味着 v-if 将分别重复运行于每个 v-for 循环中。如果要遍历的数组很大，而真正要展示的数据很少时，这将造成很大的性能浪费
- 如果需要使用 v-for 给每项元素绑定事件时使用事件代理
- 使用 keep-alive
- 如果可以，使用 v-if 替代 v-show
- key 保证唯一
- 使用路由懒加载、异步组件
- 第三方模块按需引入

## vue3 新特性

- 基于 Proxy 的观察者机制：目前，Vue2 实现双向绑定是使用 Object.defineProperty 的 getter 和 setter。但是，Vue3 使用 ES2015 Proxy 作为其观察者机制。消除了以前存在的警告，使速度加倍，节省了一半的内存开销
- 更好的支持 TS 和 JSX

## vuex

### 核心组件

- state 全局唯一数据源
- getters 类似过滤器和计算属性，从 store 中的 state 中派生出一些状态
- mutations 更改 store 中的状态的唯一方法是提交 mutation，类似 redux 里的 reducer，同步任务
- actions 类似 redux 里的异步 reducer，可以执行异步任务
- modules 模块，使用单一状态树，应用的所有状态会集中到一个比较大的对象，变得复杂、臃肿。Vuex 允许我们将 store 分割成模块

### Vuex 中状态储存在哪里，怎么改变它？

- 存储在 state 中，改变 Vuex 中的状态的唯一途径就是提交 (commit) mutation

### Vuex 中状态是对象时，使用时要注意什么？

- 因为对象是引用类型，复制后改变属性还是会影响原始数据，这样会改变 state 里面的状态，是不允许，所以先用深度克隆复制对象，再修改

## vue2 的缺陷

- 数组的部分操作没有响应式：`push(), pop(), shift(), unshift(), splice(), sort(), reverse()`
- vue2 通过 Object.defineProperty 实现响应式，无法检测数组/对象属性的新增，不允许在已经创建的实例上动态添加新的响应式属性

::: tip

解决方案：

- Vue.set()
- Object.assign()
- $forcecUpdated()

:::
