# Javascript

## String 原生方法

- `substr(start[, length])`：deprecated，同 slice/substring
- `split([separator[, limit]])`：按照给定规则分割字符串，返回一个由分割出来的子字符串组成的数组 `'1,2,3' => [1, 2, 3]`
- `substring(indexStart[, indexEnd])`：返回字符串在开始索引到结束索引之间的一个子集，或从开始索引直到字符串末尾的一个子集
- `slice(beginIndex[, endIndex])`：提取字符串一部分，返回一个新的字符串，不会改动原字符串

## Array 原生方法

- `push(element1, ..., elementN)`：在数组末端添加一个/多个元素，返回添加结果数组 length，改变原数组
- `pop()`：删除数组最后一个元素，返回该元素，改变原数组
- `shift()`：删除数组第一个元素，返回该元素，改变原数组
- `unshift(element1, ..., elementN)`：在数组的第一个位置添加元素，返回添加新元素后的数组 length，改变原数组
- `join([separator])`：以指定参数作为分隔符，将所有数组成员连接为一个字符串返回，如果不提供参数，默认用逗号分隔，`[1, 2, 3] => '1,2,3'`
- `slice([begin[, end]])`：提取数组的一部分，返回一个新数组，不改变原数组
- `splice(start[, deleteCount[, item1[, item2[, ...]]]])`：删除原数组的一部分成员，并可以在删除的位置添加新的成员，返回被删除的元素，改变原数组

遍历迭代方法：

- `for in` 顺序遍历一个对象自有的、继承的、可枚举的、非 Symbol 的属性。对于每个不同的属性，语句都会被执行

> 如果只考虑对象本身的属性，而不是它的原型，那么使用 getOwnPropertyNames() 或 hasOwnProperty() 来确定属性是否是对象本身的。

- `for of` ES6 新增，替代 for in 和 forEach，可以遍历 Array，String，Map，Set 等可迭代数据结构
- `forEach` 遍历数组每一项，没有返回值，对原数组没有影响，注意：在 forEach 中用 return 不会返回，break 不会跳出，函数会继续执行
- `map` 返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值
- `flat` 将嵌套的数组“拉平”，变成一维的数组，返回一个新数组，不改变原数组，默认只会“拉平”一层，如果想要“拉平”多层的嵌套数组，可以将 flat() 方法的参数写成一个整数
- `flatMap` 对原数组的每个成员执行一个函数（相当于 map），然后对返回值组成的数组执行 flat() 方法。返回一个新数组，不改变原数组，只能展开一层数组
- `filter` 返回通过过滤的元素，不改变原数组
- `some` 检测数组中某个元素是否满足指定条件，返回 boolean 值，不改变原数组
- `every` 检测数组中所有元素是否符合指定条件，返回 boolean 值，不改变原数组
- `reduce` 接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值
- `reduceRight` 同 reduce，方向相反
- `find` 返回通过测试（函数内判断）的数组的第一个元素的值

::: note

**forEach、for in、for of 区别**

- forEach 更多的用来遍历数组
- for in 一般常用来遍历对象或 json
- for of 数组对象都可以遍历，遍历对象需要通过和 Object.keys()
- for in 循环出的是 key，for of 循环出的是 value

:::

## 类数组对象

拥有 length 属性，length-0 可隐式转换为 number 类型

```javascript
var a = { 1: 'gg', 2: 'love', 4: 'meimei', length: 5 };
```

类数组对象转数组：

```javascript
Array.prototype.slice.call(arrLike);
```

```javascript
Array.from(arrLike);
```

## 内置对象

- BigInt
- URL 对象
- Error
- Math
- Date
- RegExp
- Proxy\Reflect
- URL 对象：提供用于创建和解析 URL
- DOM 变动观察器（Mutation observer）：观察 DOM 元素，并在检测到更改时触发回调

## ES6 新特性

- 箭头函数
- Promise
- 扩展运算符和解构赋值
- 对象和数组解构
- let const
- 模板字符串
- 函数的参数默认值
- class
- `for of` 和 `for in`
- 模块
- 尾调用优化 TCO

## var let const

- let 和 const 具有块级作用域，var 不存在块级作用域
- const 声明常量，不能修改，声明的对象，属性可以被修改
- 用 var 重复声明不会报错，但 let 和 const 会
- var 会使变量提升，变量可以在 var 声明之前使用。let 和 const 不会使变量提升，提前使用会报错

## 深浅拷贝

- 浅拷贝: 以赋值形式拷贝引用对象，仍指向同一个地址，修改时原对象也会受到影响，实现：Object.assign 或 展开运算符
- 深拷贝：

  - JavaScript 包含基本类型 和 引用类型
  - 基本类型按值访问、引用类型按引用访问
  - 直接复制引用类型的值，实际上是同一个内存地址的指针，修改新的变量，原变量也会被修改

- 手写深拷贝：

```jsx
function deepCopy(obj) {
  // 判断是否是简单数据类型，
  if (typeof obj == 'object') {
    // 复杂数据类型
    var result = obj.constructor == Array ? [] : {};
    for (let i in obj) {
      result[i] = typeof obj[i] == 'object' ? deepCopy(obj[i]) : obj[i];
    }
  } else {
    // 简单数据类型 直接赋值
    var result = obj;
  }
  return result;
}
```

## Generator 函数

- function 关键字与函数名之间有一个星号
- 函数体内部使用 yield 表达式
- 返回一个指向内部状态的指针对象，是一个遍历器对象
- 调用遍历器对象的 next 方法，使指针移向下一个状态
- 内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个 yield 表达式（或 return 语句）为止
- next 方法返回一个对象，它的 value 属性是当前 yield 表达式的值，done 属性的值表示遍历是否结束

## async/await

- async 用来声明函数，告诉解释器这是一个异步函数，只有 async 声明的函数里面才能用 await
- await 等待一个 promise 执行结束，可以返回 promise 对象 resolve 出来的结果
- 如果 await 等待的这个 Promise 对象出错或者结果为 reject，可以通过 try catch 捕获到错误

实现原理：

- Generator 函数的语法糖
- 将 Generator 函数和自动执行器，包装在一个函数里

```js
async function fn(args) {
  // ...
}

// 等同于
function fn(args) {
  return spawn(function* () {
    // ...
  });
}
```

spawn 函数就是自动执行器，spawn 函数的实现：

```js
function spawn(genF) {
  return new Promise(function (resolve, reject) {
    const gen = genF();

    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch (e) {
        return reject(e);
      }
      if (next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(
        function (v) {
          step(function () {
            return gen.next(v);
          });
        },
        function (e) {
          step(function () {
            return gen.throw(e);
          });
        }
      );
    }

    step(function () {
      return gen.next(undefined);
    });
  });
}
```

## apply、call、bind

- 都是用来改变函数 this 的指向

区别：

- apply 和 call 的区别是 call 方法接受的是若干个参数列表，而 apply 接收的是一个包含多个参数的数组
- bind 方法创建新的函数，在 bind 被调用时，这个新函数的 this 被指定为 bind 的第一个参数，而其余参数将作为新函数的参数，供调用时使用，bind 与 apply/call 一样都能改变函数 this 指向，但 bind 并不会立即执行函数，而是返回一个绑定了 this 的新函数，你需要再次调用此函数才能达到最终执行

手写：

```javascript
// call
Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new Error('Type error');
  }

  // 判断 context 是否传入，如果没有传就设置为 window
  context = context || window;

  // 使用 Symbol 来保证属性唯一
  // 保证不会重写用户自己原来定义在 context 中的同名属性
  const fnSymbol = Symbol();

  // 将被调用的方法设置为 context 的属性
  // this 即为我们要调用的方法
  context[fnSymbol] = this;

  // 将执行结果返回
  try {
    return context[fnSymbol](...args);
  } finally {
    // 最后删除手动增加的属性方法
    delete context[fnSymbol];
  }
};

var foo = {
  value: 1,
};

function bar() {
  console.log(this.value);
}

bar.call(foo); // 1
bar.myCall(foo); // 1

// apply
// 与 call 相比仅获取参数方式不同

// bind
Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new Error('Type error');
  }

  const fn = this;

  return function Fn() {
    return fn.apply(
      this instanceof Fn ? this : context,
      // 当前的这个 arguments 是指 Fn 的参数
      args.concat(...arguments)
    );
  };
};
```

## 作用域

用来管理引擎如何在当前作用域以及嵌套子作用域中根据标识符名称（变量名或者函数名）进行变量查找  
作用域类型：全局作用域和函数作用域

### 块级作用域

解决 ES5 的问题：

- 内层变量可能覆盖外层变量
- 用来计数的循环变量泄露为全局变量

### 作用域链

当访问一个变量时，编译器在执行这段代码时，会首先从当前的作用域中查找是否有这个标识符，如果没找到，就去父作用域查找，如果父作用域还没找到继续向上查找，直到全局作用域为止，作用域链，就是由当前作用域与上层作用域的一系列变量对象组成，保证了当前执行的作用域对符合访问权限的变量和函数的有序访问

### 词法作用域和动态作用域

- JavaScript 采用词法作用域，也就是静态作用域
- 函数的作用域在函数定义的时候就决定了
- 而与词法作用域相对的是动态作用域，函数的作用域是在函数调用的时候才决定

```javascript
var value = 1;

function foo() {
  console.log(value);
}

function bar() {
  var value = 2;
  foo();
}

bar();

// 1
```

### 执行上下文

- 当函数执行时，会创建一个称为执行上下文的内部对象
- 一个执行上下文定义了一个函数执行时的环境，函数每次执行时对应的执行上下文都是独一无二的，所以多次调用一个函数会导致创建多个执行上下文，
- 当函数执行完毕，执行上下文被销毁

## 参数传递

- 参数如果是基本类型是按值传递，如果是引用类型按共享传递
- 但是当值是一个复杂的数据结构的时候，拷贝就会产生性能上的问题

### 按值传递

- 把函数外部的值复制给函数内部的参数，就和把值从一个变量复制到另一个变量一样

### 共享传递

- 在传递对象的时候，传递对象的引用的副本
- 假设 arg 是一个对象参数，修改 arg.value，可以通过引用找到原值，但是直接修改 arg，并不会修改原值

### arguments

- 一个类数组对象，存储传入函数的全部参数
- callee 属性：当前函数的引用
- 妙用：递归、参数累加

::: tip

为什么 arguments 是类数组：

BE 本人也承认 arguments 的设计是因为当时只花了十天所以整得太糙了

:::

::: tip

为什么 ES6 不推荐 arguments.callee()：

- 访问 arguments 是个很昂贵的操作，因为它是个很大的对象，每次递归调用时都需要重新创建。影响浏览器的性能，还会影响闭包
- 当一个函数必须调用自身的时候，假如它是函数表达式则给它命名，或者使用函数声明，避免使用 callee

:::

## delete 机制

- 使用 delete 操作符不会直接释放内存，与 V8 引擎有关
- 最有效的方式，应该是将不需要的属性设置为 undefined
- 在实际业务中可以考虑使用 Map 来代替 object，map 包装对象有 delete 方法，比以上方式都快

## 设置一个对象所有属性不能修改

- `Object.preventExtensions()`
- `Object.seal()` 封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置，当前属性的值只要原来是可写的就可以改变
- `Object.freeze()` 使用 Object.freeze() 冻结的对象中的现有属性值是不可变的。用 Object.seal() 密封的对象可以改变其现有属性值

## 代理对

- 参考：<https://zh.javascript.info/string>
- 所有常用的字符都是一个 2 字节的代码。大多数欧洲语言，数字甚至大多数象形文字中的字母都有 2 字节的表示形式
- 但 2 字节只允许 65536 个组合，这对于表示每个可能的符号是不够的。所以稀有的符号被称为“代理对”的一对 2 字节的符号编码
- 代理对在 JavaScript 被创建时并不存在，因此无法被编程语言正确处理
- 这些符号的 length 是 2：

  ```js
  alert('𝒳'.length); // 2，大写数学符号
  alert('😂'.length); // 2，部分 emoji 表情
  alert('𩷶'.length); // 2，罕见的中国象形文字
  ```

## 并发控制实现

```javascript
async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = []; // 存储所有的异步任务
  const executing = []; // 存储正在执行的异步任务
  for (const item of array) {
    // 调用iteratorFn函数创建异步任务
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p); // 保存新的异步任务

    // 当poolLimit值小于或等于总任务个数时，进行并发控制
    if (poolLimit <= array.length) {
      // 当任务完成后，从正在执行的任务数组中移除已完成的任务
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e); // 保存正在执行的异步任务
      if (executing.length >= poolLimit) {
        await Promise.race(executing); // 等待较快的任务执行完成
      }
    }
  }
  return Promise.all(ret);
}
```

```javascript
function multiRequest(urls = [], maxNum) {
  // 请求总数量
  const len = urls.length;
  // 根据请求数量创建一个数组来保存请求的结果
  const result = new Array(len).fill(false);
  // 当前完成的数量
  let count = 0;

  return new Promise((resolve, reject) => {
    // 请求maxNum个
    while (count < maxNum) {
      next();
    }
    function next() {
      let current = count++;
      // 处理边界条件
      if (current >= len) {
        // 请求全部完成就将promise置为成功状态, 然后将result作为promise值返回
        !result.includes(false) && resolve(result);
        return;
      }
      const url = urls[current];
      console.log(`开始 ${current}`, new Date().toLocaleString());
      fetch(url)
        .then((res) => {
          // 保存请求结果
          result[current] = res;
          console.log(`完成 ${current}`, new Date().toLocaleString());
          // 请求没有全部完成, 就递归
          if (current < len) {
            next();
          }
        })
        .catch((err) => {
          console.log(`结束 ${current}`, new Date().toLocaleString());
          result[current] = err;
          // 请求没有全部完成, 就递归
          if (current < len) {
            next();
          }
        });
    }
  });
}
```

## WeakMap\Map 区别

- Map 的键可以是任意类型，WeakMap 只接受对象作为键（null 除外），不接受其他类型的值作为键
- WeakMap 的键名所指向的对象，不计入垃圾回收机制，设计目的在于，有时想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。一旦不再需要这两个对象，就必须手动删除这个引用，否则垃圾回收机制就不会释放对象占用的内存
- Map 的键跟内存地址绑定，只要内存地址不一样，就视为两个键；WeakMap 的键是弱引用，键所指向的对象可以被垃圾回收，此时键是无效的
- Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键；WeakMap 的键是弱引用，键所指向的对象可以被垃圾回收，此时键是无效的

## escape\encodeURI\encodeURIComponent 区别

- escape 和它们不是同一类，是对字符串进行编码(而另外两种是对 url)，作用是让它们在所有电脑上可读
- encodeURI\encodeURIComponent 唯一区别就是编码的字符范围
- encodeURIComponent 比 encodeURI 编码的范围更大

## 扩展运算符的应用

- 取出参数对象中的所有可遍历属性，拷贝到当前对象之中
- 合并对象，覆盖对象属性
- 将一个数组转为用逗号分隔的参数序列，且每次只能展开一层数组

  ```javascript
  console.log(...[1, 2, 3]);
  // 1 2 3
  console.log(...[1, [2, 3, 4], 5]);
  // 1 [2, 3, 4] 5
  ```

- 合并数组
- 字符串转真数组

  ```javascript
  [...'hello']; // [ "h", "e", "l", "l", "o" ]
  ```

- 转任何部署了 Iterator 接口的对象为真数组

## 位运算

- 计算机对二进制数据进行的运算，加减乘除等，叫位运算

## JavaScript 为什么要进行变量提升

- js 引擎在代码执行前有一个解析的过程，创建了执行上下文，初始化了一些代码执行时需要用到的对象
- 当访问一个变量时，会到当前执行上下文中的作用域链中去查找
- 提高性能 容错性更好

## 解析和执行

解析: 检查语法，并对函数进行预编译。解析的时候会先创建一个全局执行上下文环境，先把代码中即将执行的变量、函数声明都拿出来，变量先赋值为 undefined，函数先声明好可使用。在一个函数执行之前，也会创建一个函数执行上下文环境，跟全局执行上下文类似，不过函数执行上下文会多出 this、arguments 和函数的参数

执行: 按照代码的顺序依次执行

## 严格模式

文件顶部添加 `'use strict'` 开启

意义：

- 消除 Javascript 语法的不合理、不严谨之处，减少怪异行为
- 消除代码运行的不安全之处，保证代码运行的安全
- 提高编译器效率，增加运行速度
- 为未来新版本的 Javascript 做好铺垫

区别：

- 禁止使用 with 语句
- 禁止 this 关键字指向全局对象
- 对象不能有重名的属性

## DOM api

### 创建新节点

- createDocumentFragment() //创建一个 DOM 片段
- createElement() //创建一个具体的元素
- createTextNode() //创建一个文本节点

### 添加、移除、替换、插入

- appendChild() //添加
- removeChild() //移除
- replaceChild() //替换
- insertBefore() //插入

### 查找

- getElementsByTagName()
- getElementsByName()
- getElementById()
- document.querySelector()
- document.querySelectorAll()

## 手写 Ajax

```jsx
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  // 通信成功时，状态值为4
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    } else {
      console.error(xhr.statusText);
    }
  }
};
xhr.onerror = function (e) {
  console.error(xhr.statusText);
};
xhr.open('GET', 'http://www.example.com/page.php', true);
xhr.send(null);
```

XMLHttpRequest.readyState 返回一个整数，表示实例对象的当前状态。该属性只读。它可能返回以下值。

0，XMLHttpRequest 实例已经生成，但是实例的 open() 方法还没有被调用。  
1，open() 方法已经调用，但是实例的 send() 方法还没有调用，仍然可以使用实例的 setRequestHeader() 方法，设定 HTTP 请求的头信息。  
2，实例的 send() 方法已经调用，并且服务器返回的头信息和状态码已经收到。  
3，正在接收服务器传来的数据体（body ）。这时，如果实例的 responseType 属性等于 text 或者空字符串，responseText 属性就会包含已经收到的部分信息。  
4，服务器返回的数据已经完全接收，或本次接收已经失败。
