# Typescript

- 强类型 Javascript 超集，支持 ES6 语法，支持面向对象，不直接在浏览器上运行，需要编译器编译成 Javascript 来运行，对 js 进行静态类型检查
- 使工程更严谨、增强可维护性、ide 提示
- 参数校验，利于团队规范
- 有学习成本

## 基础类型

number、string、boolean、Array、object、Symbol、Tuple、enum、never、void、null、undefined、any

::: note

any 和 unknown 的区别：

- any 直接放弃类型检查（我不在乎它的类型）
- unkonwn，类型安全的 any，会对 unknown 类型的变量执行类型检查

:::

## 类型断言

- 不确定类型的时候访问其中一个类型的属性或方法时使用断言
- 类型断言对运行没有影响，仅供编译器使用
- 向编译器提供我们所希望的分析代码的提示
- 表示断言的两种方式：1：<类型>变量 2：变量 as 类型 （在 tsx 中只能使用这种方式）

## 接口

- 可以定义对象、数组、函数、类等
- 为一个变量类型进行命名，定义契约
- 可以相互继承
- 可以继承类
- 可选属性与额外检查

## 装饰器

- 是一种特殊类型的声明，它能被附加在类、方法、属性、访问符、参数上
- 装饰器使用 @expression 这种方式，expression 求值后必须为一个函数，它在运行时调用，被装饰器声明的信息作为参数传入

## Declare

- 在 .ts 中使用第三方库时没有 .d.ts 声明文件的时候，我们可以通过 declare 来写声明文件
- 可以声明该模块，甚至可以直接声明一个值为 any 的同名的变量，然后我们就可以在代码中直接使用该三方库了

## tsconfig.json

- 该文件存在于 Typescript 项目的根目录里，其作用是指定相关选项告诉 ts 编译器如何编译 ts 文件
- 所有选项：<https://www.tslang.cn/docs/handbook/compiler-options.html>

## infer 的含义

声明一个类型变量并且对它进行使用

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

## project references

- TypeScript 3.0 新功能，允许将 TypeScript 程序构建为更小的部分
- 缩短构建时间，实现组件之间的逻辑分离，以更好方式组织代码
- <https://www.tslang.cn/docs/handbook/project-references.html>
- <https://blog.csdn.net/qiwoo_weekly/article/details/126295762>

意义：

- 假设 a 模块和 b 模块都很大，编译要很久，但是两者的关联不是特别大。a 模块下的变动基本和 b 模块下的没啥关系，但是 a 变了，b 也要重新编译，b 变了 a 也要重新编译，很没必要

使用：

- 模块下各自创建一个 tsconfig.json，要求 compilerOptions.composite 设置为 true
- 在根目录的 tsconfig.json 里加上一个 references 的配置，引入 a 模块 和 b 模块
  ```json
  {
    "references": [
      {
        "path": "packages/a"
      },
      {
        "path": "packages/b"
      }
    ]
  }
  ```
- 执行 `tsc --build` 进行编译

## dts 文件

- 使用 js 编写的库的类型声明文件
- 用 ts 写的模块在发布时仍然是用 js 发布，这就导致一个问题：ts 那么多类型数据都没了，所以需要一个 d.ts 文件来标记某个 js 库里面导出对象的类型
- 调用时编辑器能根据这个文件给出提示
- 可以通过 npm 安装对应类库的类型包，<https://www.npmjs.com/~types>，类型包会安装在 `./node_modules/@types` 文件夹中

## 重载

- 定义以多种方式调用的函数
- 定义一组带有参数和返回类型的函数
- 用于实现不同参数输入并且对应不同参数输出的函数

```typescript
function getMessage(id: number): Message | undefined;
function getMessage(type: MessageType): Message[];
function getMessage(query: any): any {
  if (typeof query === 'number') {
    return data.find((message) => message.id === query);
  } else {
    return data.filter((message) => message.type === query);
  }
}
```

## 定义一个 interface，如何依据 a 参数的值来决定 b 参数是否可选？

使用联合类型

```typescript
type IParams = { type: 'a' } | { type: 'b'; params: string };
const a: IParams = { type: 'a' };
const b: IParams = { type: 'b', params: '' };
```

## 三斜线指令

- 理解成 import，必须放在文件最顶部
- 已经不推荐
