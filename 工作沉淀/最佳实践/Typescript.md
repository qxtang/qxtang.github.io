# Typescript

## 风格

- 少写 any
- 接口命名以大写字母“I”开头，来自：http://wiki.eclipse.org/Naming_Conventions#Classes_and_Interfaces
- type 类型以大写字母“T”开头
- 编译 ts 时，在把 ES6 语法转换成 ES5 语法时，会在每一个文件重复注入许多辅助函数，为了不让同样的辅助函数重复的出现在多个文件中，通过配置 importHelpers 为 true，并将 tslib 做为运行时依赖，可以解决这个问题，减少冗余代码：https://www.typescriptlang.org/tsconfig#importHelpers
- 匹配某个对象的属性：`keyof typeof obj`

## 类型定义文件(.d.ts)如何放置

- 临时的类型，直接在使用时定义
- 组件个性化类型，直接定义在 ts(x) 文件中
- 范围/全局数据，定义在 global.d.ts 文件中，并在 tsconfig.json 配置让其生效
