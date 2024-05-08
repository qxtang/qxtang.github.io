# react-router

## Link 组件和 a 标签区别

Link 做了 3 件事情：

- 有 onclick 就执行 onclick
- click 的时候阻止 a 标签默认事件、不会跳转和刷新页面
- 否则取得跳转 href（to 属性），执行跳转，此时只是链接变了，并没有刷新页面

## switch 标签作用

- 有 switch 标签包裹，则其中的在路径相同的情况下，只匹配第一个，这个可以避免重复匹配
- 无 switch 标签包裹，则其中的在路径相同的情况下全都会匹配。更严重的是，还会匹配上级路径

## withRouter 作用

- 让被修饰的组件可以从属性中获取 history、location、match
- 路由组件可以直接获取这些属性，而非路由组件就必须通过 withRouter 修饰后才能获取这些属性
