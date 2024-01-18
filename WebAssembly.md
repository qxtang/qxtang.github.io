# WebAssembly

## 定义

- 可移植、体积小、加载快并且兼容 Web 的全新格式，十六进制的 Binary Code，是一种编译产出物
- 与 JavaScript 是协作关系
- <https://webassembly.org/>

## 由来

- 为了更好的性能，javascript 执行过程：代码 -> AST -> 字节码 -> 字节码进入翻译器，将字节码一行一行的翻译成机器码
- 执行 WebAssembly 没有这些步骤

## 使用场景

- 对性能有很高要求的 App/Module/ 游戏
- 在 Web 中使用 C/C++/Rust/Go 的库

## 工具

- <https://github.com/AssemblyScript/assemblyscript>
- <https://github.com/kripken/emscripten>
- <https://github.com/WebAssembly/wabt>
