# Redux

- 一个数据管理中心，可以保证数据健壮性、可追溯和可预测性
- 与 React 无关，独立运行于任何 JavaScript 环境
- 整个应用只有唯一的状态树，所有状态维护在一个 Store 中
- 规定只能通过一个纯函数（Reducer）来描述修改

## 核心组件

- Store：整个程序的状态/对象树保存在 Store 中，一个工程只有一个 store。具有以下方法供使用：

  - getState 获取 state
  - dispatch 触发 action，更新 state
  - subscribe 订阅数据变更，注册监听器

- State：数据
- Action：用来描述发生了什么事情的对象。作为一个行为载体，用于映射相应的 Reducer，可以成为数据的载体，将数据从应用传递至 store 中，是 store 唯一的数据源
- Action Creator
- Reducer：确定状态将如何变化的地方。描述如何修改数据的纯函数，Action 属于行为名称，而 Reducer 便是修改行为的实质

## 定义 Action

- React 中的 Action 必须具有 type 属性
- 该属性指示正在执行的类型
- 必须将它们定义为字符串常量，并且还可以向其添加更多的属性

## Reducer 的作用

- 纯函数，规定应用程序的状态怎样因响应 action 而改变
- 通过接受先前的状态和 action 来工作，返回一个新的状态
- 它根据操作的类型确定需要执行哪种更新，然后返回新的值
- 如果不需要完成任务，会返回原来的状态

## 为什么 reducer 中不能做异步操作（为什么是纯函数）

- 使用纯函数才能保证相同输入得到相同输出，保证状态的可预测，如果有副作用，那么返回的 state 就不确定
- redux 的设计思想就是不产生副作用，数据更改的状态可回溯，所以 redux 中处处都是纯函数

## React-Redux

- Provider: 从最外部封装了整个应用，将 store 通过 context 传入组件中
- connect：一个高阶组件，负责连接 React 和 Redux，可以方便在 React 组件中使用 Redux

## 异步 Action 方案

- 使用 redux-thunk、redux-saga、dva 等工具
- redux-thunk 在一个 action 中返回一个函数执行异步操作，异步操作结束后，再去 dispatch 另一个 action
- redux-saga：generator 风格
- dva：基于 redux-saga

## 源码实现

- 创建一个状态中心（state），通过纯函数来对状态中心的数据进行修改，然后将修改后的结果以发布订阅的方式通知到所有订阅者，从而达到一个共享状态的效果
- Redux 的核心是函数式编程，使用无副作用的同步函数 action 来触发 reducer 对数据进行修改
- Redux 的创建函数是 createStore，这个函数的作用是创建一个 store 对象，其中关键步骤是

  - 将 reducer 利用闭包存储在函数内
  - 导出了 subscribe 函数，subscribe 函数内部将订阅者添加到一个订阅者列表中，等待通知
  - 导出了 dispatch 函数，在 dispatch 内部执行了 reducer 函数，并将 action 作为参数传入到 reducer 中
  - 将 reducer 函数的返回结果（新的 state）存在 currentState 中，同时通知所有的订阅者 state 已经更新
  - 订阅者可以通过 getState 得到最新的 state

- Redux 中间件的原理就是 Decorator 装饰器模式，将中间件经过一些装饰器（中间件）装饰以后，返回一个增强型的 dispatch

## connect 实现

- 获取 state: connect 通过 context 获取 Provider 中的 store，通过 store.getState 获取整个 store tree 上所有 state
- 将 state 和 action 通过 props 的方式传入到原组件内部，wrapWithConnect 返回一个 ReactComponent 对象 Connect，Connect 重新 render 外部传入的原组件 WrappedComponent，并把 connect 中传入的 mapStateToProps, mapDispatchToProps 与组件上原有的 props 合并后，通过属性的方式传给 WrappedComponent
- 监听 store tree 变化：connect 缓存了 store tree 中 state 的状态，通过当前 state 状态和变更前 state 状态进行比较，从而确定是否调用 this.setState 触发 Connect 及其子组件的重新渲染

```jsx
const connect = (mapStatetoProps, mapActionstoProps) => (WrapperComponent) => {
  return class Connect extends Component {
    static contextType = storeContext; // provide 定义的 context 对象

    constructor(props) {
      super();
    }

    componentWillMount() {
      const store = this.context;
      store.subscribe(this._updateProps);
      this._updateProps(); // 初始化
    }

    _updateProps = () => {
      const store = this.context;
      // 传入state和props
      const stateProps = mapStatetoProps ? mapStatetoProps(store.getState(), this.props) : {};
      // 传入dispatch和props
      const actionProps = mapActionstoProps ? mapActionstoProps(store.dispatch, this.props) : {};
      //整合props，传给接收的组件
      this.setState({
        allProps: {
          ...stateProps,
          ...actionProps,
          ...this.props,
        },
      });
    };

    render() {
      return <WrapperComponent {...this.state.allProps} />;
    }
  };
};
```
