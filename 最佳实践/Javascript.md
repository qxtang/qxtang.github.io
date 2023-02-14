# Javascript

- 先声明后调用
- 优先 const
- 常量大写
- 少写魔法值，常量需要命名
- 不污染全局
- 不要忽略抛异常、不要忘了在 Promise\async await 抛异常
- 缓存耗时的计算，比如 dom 查找、设备信息查询等
- 尽可能使用原生方法，因为原生方法是用低级语言写的（C/C++），并且被编译成机器码，效率更高，比如 Array 的 filter
- 少用 for-in，慢，for-in 要搜索原型属性
- 基于函数的迭代 forEach 比一般的循环要慢，如果对运行速度要求很严格，不要使用
- 使用枚举或策略模式减少 elseif，使用 Map、Object 优化 switch-case
- ?? 空值合并操作符、?. 链合并运算符
- 少写 console（或提交代码时删除 console），项目跑起来一堆的日志让队友很头疼
- 多元判断时，可将条件拼接成字符串存到 Object 里

```js
/**
 * 按钮点击事件
 * @param {number} status 活动状态：1未开始 2进行中 3结束
 * @param {string} identity 身份标识：guest游客 admin管理员
 */
const onButtonClick = (status, identity) => {
  if (identity == 'guest') {
    if (status == 1) {
      //do sth
    } else if (status == 2) {
      //do sth
    } else if (status == 3) {
      //do sth
    } else {
      //do sth
    }
  } else if (identity == 'admin') {
    if (status == 1) {
      //do sth
    } else if (status == 2) {
      //do sth
    } else if (status == 3) {
      //do sth
    } else {
      //do sth
    }
  }
};

// 可优化为
const actions = new Map([
  ['guest_1', () => {} /*do sth*/],
  ['guest_2', () => {} /*do sth*/],
  ['guest_3', () => {} /*do sth*/],
  ['admin_1', () => {} /*do sth*/],
  ['admin_2', () => {} /*do sth*/],
  ['admin_3', () => {} /*do sth*/],
  ['default', () => {} /*do sth*/],
]);

/**
 * 按钮点击事件
 * @param {string} identity 身份标识：guest游客 admin管理员
 * @param {number} status 活动状态：1未开始 2进行中 3 结束
 */
const onButtonClick = (identity, status) => {
  let action = actions.get(`${identity}_${status}`) || actions.get('default');
  action.call(this);
};
```

- 可适当使用对象区分作用域
- 使用 Array.includes 来优化多个条件的判断
- 使用 Array.every 和 Array.some 来处理全部/部分满足条件
- 减少嵌套，提前使用 return
- 用有意义且常用的单词命名变量

```js
// 错误：
const yyyymmdstr = moment().format('YYYY/MM/DD');
// 正确:
const currentDate = moment().format('YYYY/MM/DD');
```

- 保持统一命名  
  可能同一个项目对于获取用户信息，会有三个不一样的命名，应该保持统一。

```js
// 错误：
getUserInfo();
getClientData();
getCustomerRecord();

// 正确：
getUser();
```

- 避免无意义前缀  
  如果创建了一个对象 car，就没有必要把它的颜色命名为 carColor。

```js
// 错误：
const car = {
  carMake: 'Honda',
  carModel: 'Accord',
  carColor: 'Blue',
};

function paintCar(car) {
  car.carColor = 'Red';
}

// 正确：
const car = {
  make: 'Honda',
  model: 'Accord',
  color: 'Blue',
};

function paintCar(car) {
  car.color = 'Red';
}
```

- 使用函数参数默认值

```js
// 错误：
function doSomeThing(name) {
  const username = name || 'tony';
  // ...
}

// 正确：
function doSomeThing(name = 'tony') {
  // ...
}
```

- 参数越少越好  
  如果参数超过两个，使用解构语法，不用考虑参数顺序。

```js
// 错误：
function createMenu(title, body, buttonText, cancellable) {
  // ...
}

// 正确：
function createMenu({ title, body, buttonText, cancellable }) {
  // ...
}

createMenu({
  title: 'Foo',
  body: 'Bar',
  buttonText: 'Baz',
  cancellable: true,
});
```

- 抽象重复代码  
  很多时候虽然是同一个功能，但由于一两个不同点，让你不得不写两个几乎相同的函数，要想优化重复代码需要有较强的抽象能力。

- 不传 flag 参数  
  不要通过 flag 的 true 或 false，来判断执行逻辑。

- 删除弃用代码  
  可以在代码库历史版本中找到它。

- 使用 class
- 链式调用  
  这种模式让的代码简洁优雅，在类的方法最后返回 this 就可以了。

```js
class Car {
  constructor(make, model, color) {
    this.make = make;
    this.model = model;
    this.color = color;
  }

  setMake(make) {
    this.make = make;
    return this;
  }

  setModel(model) {
    this.model = model;
    return this;
  }

  setColor(color) {
    this.color = color;
    return this;
  }

  save() {
    console.log(this.make, this.model, this.color);
    return this;
  }
}

const car = new Car('Ford', 'F-150', 'red').setColor('pink').save();
```

- 单一功能原则  
  如果一个类干的事情太多太杂，会导致后期很难维护。我们应该厘清职责，各司其职减少相互之间依赖。

- 封闭开放原则  
  “当需要改变一个程序的功能或者给这个程序增加新功能的时候，可以使用增加代码的方式，但是不允许改动程序的源代码”  
  比如我想修改一个公共组件的样式来适配自己的页面，但又需要保证其他使用这个组件的页面不受影响，可以通过增加一个主题参数，根据该参数加载一份新的样式文件
