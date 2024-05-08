# Proxy 和 Reflect

- 通过 Proxy 创建对象的代理对象，在代理对象中使用 Reflect 达到对于 JavaScript 原始操作的拦截

## Proxy 为什么需要 Reflect 来配合

- 简化 Proxy 的创建
- 统一将 Object 的一些明显属于语言内部的方法（比如 Object.defineProperty），放到 Reflect 对象上。现阶段，某些方法同时在 Object 和 Reflect 对象上部署，未来的新方法将只部署在 Reflect 对象上。也就是说，从 Reflect 对象上可以拿到语言内部的方法。
- 统一某些 Object 方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而 Reflect.defineProperty(obj, name, desc)则会返回 false
- 让 Object 操作都统一变成函数行为。某些 Object 操作是命令式，比如 name in obj 和 delete obj[name]，而 Reflect.has(obj, name)和 Reflect.deleteProperty(obj, name)让它们变成了函数行为
- Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法。这就让 Proxy 对象可以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。也就是说，不管 Proxy 怎么修改默认行为，你总可以在 Reflect 上获取默认行为

## Proxy 的局限性

- 一些内置对象具有“内部插槽”，对这些对象的访问无法被代理

  ```js
  let map = new Map();
  let proxy = new Proxy(map, {});
  proxy.set('test', 1); // Error
  ```

  解决：

  ```js
  let map = new Map();

  let proxy = new Proxy(map, {
    get(target, prop, receiver) {
      let value = Reflect.get(...arguments);
      return typeof value == 'function' ? value.bind(target) : value;
    },
  });

  proxy.set('test', 1);
  alert(proxy.get('test')); // 1
  ```

- 私有字段

  私有字段是通过内部插槽实现的，在调用 getName() 时，this 的值是代理后的 user，它没有带有私有字段的插槽

  ```js
  class User {
    #name = 'Guest';

    getName() {
      return this.#name;
    }
  }

  let user = new User();
  user = new Proxy(user, {});
  alert(user.getName()); // Error
  ```

  解决：

  ```js
  // 该解决方案也有缺点：它将原始对象暴露给该方法，可能使其进一步传递并破坏其他代理功能
  class User {
    #name = 'Guest';

    getName() {
      return this.#name;
    }
  }

  let user = new User();

  user = new Proxy(user, {
    get(target, prop, receiver) {
      let value = Reflect.get(...arguments);
      return typeof value == 'function' ? value.bind(target) : value;
    },
  });

  alert(user.getName()); // Guest
  ```

- 无法拦截严格相等性检查 `===`

## 使用示例

```js
// 要包装的对象
let target = {};

// 代理配置
const handler = {
  // 拦截写入
  set(target, prop, val, receiver) {
    return Reflect.set(target, prop, val, receiver);
  },
  // 拦截读取
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver);
  },
};

// 代理对象
let proxy = new Proxy(target, handler);
```

## 可撤销 Proxy

```js
let object = {
  data: 'Valuable data',
};

let { proxy, revoke } = Proxy.revocable(object, {});

alert(proxy.data); // Valuable data

revoke();

alert(proxy.data); // Error
```
