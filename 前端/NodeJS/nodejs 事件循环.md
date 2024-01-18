## nodejs 事件循环

执行顺序如下：

- timers：计时器，执行 setTimeout 和 setInterval 的回调
- pending callbacks：执行延迟到下一个循环迭代的 I/O 回调
- idle, prepare：队列的移动，仅系统内部使用
- poll 轮询：检索新的 I/O 事件；执行与 I/O 相关的回调。事实上除了其他几个阶段处理的事情，其他几乎所有的异步都在这个阶段处理。
- check：执行 setImmediate 回调，setImmediate 在这里执行
- close callbacks: 执行 close 事件的 callback，一些关闭的回调函数，如：socket.on('close', ...)

## 什么是事件循环

- 通过将操作转移到系统内核中来执行非阻塞 I/O 操作（尽管 JavaScript 是单线程的）
- 当这些操作之一完成时，内核会告诉 Node.js，以便可以将适当的回调添加到轮询队列中以最终执行。
