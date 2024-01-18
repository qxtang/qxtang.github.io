# spa 路由原理

## 基本原理

页面切换实质是切换 url，监听 url 变化，从而渲染不同的页面组件。

## hash 模式

- hash 包含在 URL 中，但不包括在请求中，用来指导浏览器动作，修改 hash 不会刷新页面
- hash 模式下，井号之前的内容才会被包含在请求中，因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回 404 错误
- 原理是监听 hashchange 事件执行对应回调

## history 模式

- 历史记录、网页标题修改：HTML5 特性 pushState 和 replaceState
- 监听 window 对象的 popState 事件执行对应回调更新页面，一个文档的 history 对象出现变化时（在浏览器某些行为下触发，比如点击后退、前进按钮或者调用 history.back()、history.forward()、history.go()方法），就会触发 popstate 事件
- history 模式下，前端的 URL 和实际向后端发起请求的 URL 一致。服务端如果缺少对该页面请求的处理，就会返回 404 错误
- 需要服务器的支持：需要在服务端增加一个覆盖所有情况的候选资源：比如 URL 匹配不到任何资源时，则返回同一个 index.html 页面，这个页面就是前端应用的入口页面

::: tip

更推荐用 history 模式，history 模式更利于 seo 优化，url 也比较美观

:::
