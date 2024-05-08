# HOC、Hooks、Mixin

三种实现状态逻辑复用的技术

## Mixin

::: note

mixin 缺点

- 会相互依赖，相互耦合，不利于代码维护
- 方法可能会相互冲突，难以追溯
- React 现在已经不再推荐使用 Mixin

:::

## HOC

- 高阶组件就是一个函数，且该函数接受一个组件作为参数，并返回一个新的增强组件
- 高阶组件自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式和编程技巧
- 常见的有 react-redux 里的 connect 和 react-router 中的 withRouter
- 作用：复用组件逻辑，操作状态和参数，渲染劫持

::: tip

HOC 缺点：

- 嵌套地狱：可能出现多层包裹组件的情况，多层抽象同样增加了复杂度和理解成本
- 命名冲突：如果高阶组件多次嵌套，没有使用命名空间的话会产生冲突，然后覆盖老属性

:::

### HOC 场景和应用

- 权限控制
- 性能监控，包裹组件的生命周期，进行统一埋点
- 日志打点
- 双向绑定
- 组合渲染、条件渲染
- 可以借助 ES7 提供的 Decorators （装饰器）来让写法变得优雅，安装并配置 babel 插件：babel-plugin-transform-decorators-legacy

::: note

使用注意：

- 不要在 render 方法内创建高阶组件，会导致组件每次都会被卸载后重新挂载
- 不要改变原始组件，高阶组件应该是没有副作用的纯函数，这样破坏了对高阶组件的约定，也改变了高阶组件的初衷，使用高阶组件是为了增强而非改变

:::

## Hooks 缺点

- 写法上有限制（不能出现在条件、循环中）
- 破坏了 PureComponent、React.memo 浅比较的性能优化效果（为了取最新的 props 和 state，每次 render 都要重新创建事件处函数）
- 在闭包场景可能会引用到旧的 state、props 值
- React.memo 并不能完全替代 shouldComponentUpdate（因为拿不到 state change，只针对 props change）
- useState 使用一个元组来返回 value 和 setter，需要输入两次相同的名称来定义一个 state，导致代码看起来很长且笨重

## 参考

- <https://juejin.cn/post/6844903815762673671>
