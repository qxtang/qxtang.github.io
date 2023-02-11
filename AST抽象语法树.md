# AST 抽象语法树

## 参考

- <https://segmentfault.com/a/1190000016231512>
- <https://juejin.cn/post/6844903725228621832>

## 解析器 Parser

- 把 js 源码转化为抽象语法树（AST）
- 常用解析器
  - <https://github.com/babel/babel/tree/master/packages/babel-parser>
  - <https://github.com/acornjs/acorn>

## 解析步骤

- 两步：词法分析、语法分析

### 词法分析

把字符串形式的代码转换为 令牌（tokens）流，可以把令牌看作是一个扁平的语法片段数组
例如：

```javascript
// 源
n * n;

// 词法分析结果
[
  { type: { ... }, value: "n", start: 0, end: 1, loc: { ... } },
  { type: { ... }, value: "*", start: 2, end: 3, loc: { ... } },
  { type: { ... }, value: "n", start: 4, end: 5, loc: { ... } },
]
```

每一个 type 有一组属性来描述该令牌：

```javascript
const token = {
  type: {
    label: 'name',
    keyword: undefined,
    beforeExpr: false,
    startsExpr: true,
    rightAssociative: false,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: null,
  },
};
```

### 语法分析

- 根据词法分析的结果，也就是令牌 tokens，将其转换成 AST

```javascript
// 源
function square(n) {
  return n * n;
}

// ATS
const ast = {
  type: 'FunctionDeclaration',
  id: {
    type: 'Identifier',
    name: 'square',
  },
  params: [
    {
      type: 'Identifier',
      name: 'n',
    },
  ],
  body: {
    type: 'BlockStatement',
    body: [
      {
        type: 'ReturnStatement',
        argument: {
          type: 'BinaryExpression',
          operator: '*',
          left: {
            type: 'Identifier',
            name: 'n',
          },
          right: {
            type: 'Identifier',
            name: 'n',
          },
        },
      },
    ],
  },
};
```

## 应用

- IDE 使用，如代码风格检测(eslint 等)、代码的格式化，代码高亮，代码错误等等
- 代码的混淆压缩
- 转换代码工具，如 babel
- vue 模板编译过程
- prettier
- [babel-plugin-import](https://github.com/umijs/babel-plugin-import)  
  将 antd 组件 import 语句转换成按需引入写法的 babel 插件
