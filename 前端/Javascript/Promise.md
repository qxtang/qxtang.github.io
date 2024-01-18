# Promise

## 描述

- 解决 es5 回调地狱
- 实例化 Promise：传入一个函数，代码在这个函数中执行，这个函数接收两个参数 resolve 和 reject，当作函数来执行
- 设置成功：在函数中调用 resolve 函数把 Promise 的状态变为成功，通过参数把结果传递出去，能在这个 Promise 对象的 then 方法中获取结果，then 方法可以链式调用多次，then 方法接受一个函数作为参数，这个函数的参数就是 resolve 传递出来的结果
- 设置失败：在函数中调用 reject 函数把 Promise 的状态变为失败，用法同 resolve，能在这个 Promise 对象的 catch 方法中获取结果
- 无论结果如何都会走 finally 方法
- Promise.all：接受一个数组作为参数（都是 Promise 实例），调用 Promise.all 的时候，这些实例会一起开始执行，返回一个结果数组，只有全部实例的状态是成功，结果的状态才会是成功，只要有一个失败，结果就是失败
- Promise.race：接受一个数组作为参数（都是 Promise 实例），返回一个结果数组，调用 Promise.race 的时候，传进去的实例是竞赛关系，哪个结果获得的快，就返回哪个结果
- Promise.resolve()：直接返回一个成功状态的 Promise 对象，接受一个参数，这个参数可以是：成功的结果\Promise 实例\不带有参数
- Promise.reject()：失败，同上

## Promise 实现链式调用原理

每个方法其实都是返回一个新的 Promise 对象

## promise.catch 是不是微任务

是的
