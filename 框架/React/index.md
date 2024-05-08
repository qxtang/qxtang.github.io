# React

## API

### Refs

- 安全访问 DOM 或某个组件实例
- 不得不直接访问时才使用，否则容易造成混乱
- useRef 还可以用来保存多帧共享的数据

### Context

当不想在组件树中通过逐层传递 props 或者 state 的方式来传递数据时，可以使用 Context 来实现跨层级的组件数据传递

- React.createContext：创建一个上下文的容器（组件），defaultValue 可以设置共享的默认数据
- Provider（生产者）：用于生产共享数据
- Consumer（消费者）：专门消费 Provider 的数据。Consumer 需要嵌套在生产者下面，才能通过回调的方式拿到共享的数据，当然也可以单独使用，那就只能消费到上文提到的 defaultValue

### 其他

- React.PureComponent：与 React.Component 完全相同，但是在 shouldComponentUpdate 中实现了 props 和 state 的浅比较，可以提高性能
- React.memo：高阶组件，与 React.PureComponent 类似，用于包裹函数组件，通过记忆结果来提高性能
- React.createRef：创建一个 ref，它可以通过 ref 属性附加到 React 元素
- React.forwardRef：创建一个 React 组件，将它接收的 ref 属性转发给组件树中的另一个组件。接受渲染函数作为参数。React 将用 props 和 ref 作为两个参数来调用这个函数。此函数应返回 React 节点
- React.lazy：定义动态加载的组件。有助于减少包大小，用来延迟加载在初始渲染期间未使用的组件，要求被`<React.Suspense>`组件包裹。这是指定加载指示器的方式
- React.Suspense：指定加载指示器
- createPortal：将子节点渲染到父组件以外的 DOM 节点

::: warning

PureComponent 缺点：

- PureComponent 创建了默认的 shouldComponentUpdate 行为，这个默认的 shouldComponentUpdate 行为会一一比较 props 和 state 中所有的属性，只有当其中任意一项发生改变是，才会进行重绘
- PureComponent 使用浅比较判断组件是否需要重绘，即比较指针的异同
- 所以如果 props 和 state 是引用对象，比如对象、数组，修改属性或元素，不会导致重绘

:::

## 异步加载

示例：

```jsx
const Box = React.lazy(() => import('./components/Box'));
<Suspense fallback={<div>loading...</div>}>{show && <Box />}</Suspense>;
```

::: tip

import()：

- es2020 的规范
- import() 表达式加载模块并返回一个 promise，该 promise resolve 为一个包含其所有导出的模块。我们可以在代码中的任意位置调用这个表达式
- webpack 碰到之后会将其拆出来成一个 chunk，可以使用魔术注释自定义 chunk 名称，需要加载时会通过异步请求来加载这个 chunk
- 对应的 babel 语法插件：babel-plugin-syntax-dynamic-import

:::

## 异常处理

设置边界包裹组件，实现 componentDidCatch

## 为什么不要在 render 中声明组件

每次渲染都会声明的一个新的组件，组件的一些非受控状态就会丢失，比如聚焦状态，浏览器选中文字状态

## 实现组件之间代码重用，为什么推荐组合、HOC，而不是继承

- React 希望组件是按照最小可用思想来进行封装，一个组件只做一件事情，符合单一职责原则
- 函数式编程中，函数组合是组合两个或多个函数以产生新函数的过程。将函数组合在一起就像将一系列管道拼接在一起，让我们的数据流过

## 生命周期

1、挂载卸载过程

- constructor()：必须写 super(),否则会导致 this 指向错误
- componentWillMount()：即将过时不要使用
- componentDidMount()：dom 节点已经生成，可以在这里调用 ajax 请求
- componentWillUnmount()：在这里移除事件订阅和定时器

2、更新过程

- componentWillReceiveProps(nextProps)：即将过时不要使用，接受父组件改变后的 props 需要重新渲染
- shouldComponentUpdate(nextProps,nextState)：性能优化
- componentWillUpdate(nextProps,nextState)：即将过时不要使用
- componentDidUpdate(prevProps,prevState)
- render()：插入 jsx 生成的 dom 结构，diff 算法比较更新前后的新旧 DOM 树，找到最小的有差异的节点，重新渲染

在 Fiber 中，reconciliation 阶段进行了任务分割，涉及到 暂停 和 重启，因此可能会导致 reconciliation 中的生命周期函数在一次更新渲染循环中被 多次调用 的情况，产生一些意外错误  
新版的建议生命周期如下：

```jsx
class Component extends React.Component {
  // 替换 `componentWillReceiveProps`
  // 初始化和 update 时被调用
  // 静态函数，无法使用 this
  static getDerivedStateFromProps(nextProps, prevState) {}
  // 判断是否需要更新组件
  // 可以用于组件性能优化
  shouldComponentUpdate(nextProps, nextState) {}
  // 组件被挂载后触发
  componentDidMount() {}
  // 替换
  componentWillUpdate;
  // 可以在更新之前获取最新 dom 数据
  getSnapshotBeforeUpdate() {}
  // 组件更新后调用
  componentDidUpdate() {}
  // 组件即将销毁
  componentWillUnmount() {}
  // 组件已销毁
  componentDidUnmount() {}
}
```

### 生命周期使用建议：

- 在 constructor 初始化 state
- 在 componentDidMount 中进行事件监听，并在 componentWillUnmount 中解绑事件
- 在 componentDidMount 中进行数据的请求，而不是在 componentWillMount
- 需要根据 props 更新 state 时，使用 getDerivedStateFromProps(nextProps, prevState)
- 可以在 componentDidUpdate 监听 props 或者 state 的变化
- 在 componentDidUpdate 使用 setState 时，必须加条件，否则会死循环
- getSnapshotBeforeUpdate(prevProps, prevState) 可以在更新之前获取最新的渲染数据，它的调用是在 render 之后，update 之前
- shouldComponentUpdate: 默认每次调用 setState，一定会最终走到 diff 阶段，但可以通过 shouldComponentUpdate 的生命钩子返回 false 来直接阻止后面的逻辑执行，通常是用于做条件渲染，优化渲染的性能

### react 性能优化是哪个周期函数

- shouldComponentUpdate
- 用来判断是否需要调用 render 方法重新描绘 dom
- 因为 dom 的描绘比较消耗性能
- 如果能在 shouldComponentUpdate 方法中能够写出更优化的逻辑，可以提高性能

## 事件处理

- React 没有直接将事件绑定到元素上，而是在 document 处监听所有支持的事件
- 冒泡到 document 上的事件不是原生浏览器事件，而是 React 自己实现的合成事件
- 为了解决跨浏览器兼容性问题，React 将 浏览器原生事件 封装为 合成事件
- 提供了与原生事件相同的接口，屏蔽了底层浏览器的细节差异，保证了行为一致性
- 这样 React 在更新 DOM 的时候不需要考虑如何去处理绑定在 DOM 上的事件监听器，达到优化性能目的

### react 合成事件是什么，和原生事件的区别

- React 合成事件机制，React 并不是将 click 事件直接绑定在 dom 上面，而是采用事件冒泡的形式冒泡到 document 上面，然后 React 将事件封装给正式的函数
- 如果 DOM 上绑定了过多的事件处理函数，页面响应以及内存占用可能会受影响
- 为了避免这类 DOM 事件滥用，同时屏蔽底层不同浏览器之间的事件系统差异，React 实现了一个中间层
- 当用户在为 onClick 添加函数时，React 并没有将 Click 事件绑定在 DOM 元素上，而是在 document 处监听所有支持的事件，当事件发生并冒泡至 document 处时，React 将事件内容封装交给中间层

## constructor 中 super 与 props 参数一起使用的目的是什么

- ES6 规定，在子类的 constructor 中必须先调用 super 初始化父类才能引用 this
- 在调用方法之前，子类构造函数无法使用 this 引用 super()

## 为什么一定要 import “react”

- JSX 实际上是 React.createElement 的语法糖，jsx 会被 babel 翻译成 React.createElement

## react 性能优化

- 重写 shouldComponentUpdate 来避免不必要的 dom 操作
- 使用 production 版本的 react.js
- 使用 key 来帮助 React 识别列表中所有子组件的最小变化
- React.memo
- PureComponent
- useMemo、useCallback

## React 编程模型

### 宿主树

- 用于展示 UI
- 会随时间变化
- 稳定性，宿主树相对稳定
- 通用性，宿主树可以被拆分为外观和行为一致的 UI 模式

### 宿主实例

- 宿主树的节点

### 渲染器

- 渲染器决定如何与特定的宿主环境通信以及如何管理它的宿主实例
- 让开发者能以一种更好的方式操控宿主实例，而不用在意低级视图 API 范例

### React 元素

- 最小的构建单元
- 一个普通的 JavaScript 对象，用来描述一个宿主实例
- React 元素也能形成一棵树
- React 元素并不是永远存在的，它们总是在重建和删除之间不断循环
- React 元素具有不可变性。不能改变 React 元素中的子元素或者属性，如果想要在稍后渲染一些不同的东西，需要从头创建新的 React 元素树来描述它
- 类似电影中放映的每一帧

### 入口

- 告诉 React ，将特定的 React 元素树渲染到真正的宿主实例中去，例如，React DOM 的入口就是 ReactDOM.render()

### 组件

- 即返回 React 元素的函数

### 一致性

- React 将所有的工作分成了“渲染阶段”和“提交阶段”。渲染阶段是当 React 调用你的组件然后进行协调的时段，在此阶段进行干涉是安全的，提交阶段就是 React 操作宿主树的时候，而这个阶段永远是同步的

### 批量更新

- React 会在组件内所有事件触发完成后再进行批量更新，避免浪费的重复渲染

### 上下文

- 事实上，当 React 渲染时，维护了一个上下文栈

### 副作用

- React 会推迟执行 effect 直到浏览器重新绘制屏幕
- 有一个极少使用的 Hook 能够让你选择退出这种行为并进行一些同步的工作，请尽量避免使用它：useLayoutEffect

### 自定义 Hooks

- 自定义 Hooks 让不同的组件共享可重用的状态逻辑。注意状态本身是不共享的。每次调用 Hook 都只声明了其自身的独立状态。

### 渲染器

- react-dom、react-dom/server、 react-native、 react-test-renderer 都是常见的渲染器
- 不管你的目标平台是什么，react 包都是可用的，从 react 包中导出的一切，比如 React.Component、React.createElement、 React.Children 和 Hooks，都是独立于目标平台的
- 渲染器包则暴露特定平台的 API，例如 ReactDOM.render()
- react 包仅仅是让你使用 React 的特性，但是它不知道这些特性是如何实现的。渲染器包(react-dom、react-native 等)提供了 React 特性的实现以及平台特定的逻辑
- 每个渲染器都在已创建的类上设置了一个特殊的字段，这个字段叫做 updater
