# Typescript

- 接口命名以大写字母“I”开头，来自：http://wiki.eclipse.org/Naming_Conventions#Classes_and_Interfaces
- type 类型以大写字母“T”开头

## 类型定义文件(.d.ts)如何放置

- 临时的类型，直接在使用时定义
- 组件个性化类型，直接定义在 ts(x) 文件中
- 范围/全局数据，定义在 global.d.ts 文件中，并在 tsconfig.json 配置让其生效
