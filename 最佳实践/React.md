# React

- 使用 hooks
- 使用 styled-components <https://medium.com/building-crowdriff/styled-components-to-use-or-not-to-use-a6bb4a7ffc21>
- 考虑使用 unstated-next 代替 redux
- 组件属性超过 3 个则换行
- 没有子元素的组件写成自闭合
- 多用函数组件，更小的打包体积，更高的执行效率
- 多用 PureComponent，PureComponent 会先对 state 和 props 进行浅比较，不同的时候才会 render
- 遵循单一职责原则，使用 HOC / 装饰器 / Render Props 增加职责
- react 组件文件用 jsx，用大驼峰命名 jsx 文件
- 表达式中的 jsx 使用圆括号包裹
- 每个文件只写一个组件，但是多个无状态组件可以放在单个文件中，文件名要与默认导出的类名一致
- 组合优于继承
- 性能原因尽量不写内联函数，比如点击事件
- React 应用中的权限管理：https://isamatov.com/react-permissions-and-roles/
- 多使用解构，例如声明函数组件的 props 和 默认值

```jsx
export default ({ name = '小明', sex = '男' }) => (
  <>
    我叫 {name}，性别 {sex}
  </>
);
```

- 组件属性命名保持统一，使兼容性良好，避免无意义前缀

```jsx
// 错误
<MyInput inputValue onInputChange wrapStyle wrapClassName />

// 正确
<MyInput value onChange style className />
```

- 避免在 render 里面动态创建对象 / 方法，否则会导致子组件每次都 render

```jsx
// 错误：
render() {
  const obj = {num: 1}

  return (
    <Child obj={obj} onClick={()=>{...}} />
  );
}
```

- 避免在 JSX 中写复杂的三元表达式，应通过封装函数或组件实现

```jsx
// 错误：
render() {
  const a = 8;
  return (
    <div>
      {
        a > 0 ? a < 9 ? ... : ... : ...
      }
    </div>
  );
}
```

```jsx
// 正确：
f() {
  // ...
}

render() {
  const a = 8;

  return (
    <div>
      {
        this.f()
      }
    </div>
  );
}
```

- 使用运算符`&&`简化三元运算  
  在 JavaScript 中，true && expression 总是会返回 expression, 而 false && expression 总是会返回 false，因此，如果条件是 true，&& 右侧的元素就会被渲染，如果是 false，React 会忽略并跳过它。

例如：

```jsx
{
  loading ? <Loading /> : null;
}
```

可简化为

```jsx
{
  loading && <Loading />;
}
```

- 尽量避免使用展开运算符来展开 props  
  变得难以理解和维护，容易出 bug

- 遇到事件处理，可以使用一个返回新函数的方法  
  例如：

```jsx
import React from 'react';

export default function SampleComponent({ onValueChange }) {
  const handleChange = (key) => {
    return (e) => onValueChange(key, e.target.value);
  };

  return (
    <form>
      <input onChange={handleChange('name')} />
      <input onChange={handleChange('email')} />
      <input onChange={handleChange('phone')} />
    </form>
  );
}
```

- 使用 Hook components  
  比如要封装一个弹窗组件：

```jsx
// 组件
import React, { useCallback, useState } from 'react';
import ConfirmationDialog from 'components/global/ConfirmationDialog';

export default function useConfirmationDialog({ headerText, bodyText, confirmationButtonText, onConfirmClick }) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  };

  const Dialog = useCallback(
    () => (
      <ConfirmationDialog
        headerText={headerText}
        bodyText={bodyText}
        isOpen={isOpen}
        onConfirmClick={onConfirmClick}
        onCancelClick={() => setIsOpen(false)}
        confirmationButtonText={confirmationButtonText}
      />
    ),
    [isOpen]
  );

  return {
    Dialog,
    onOpen,
  };
}
```

```jsx
// 使用
import React from 'react';
import { useConfirmationDialog } from './useConfirmationDialog';

function Client() {
  const { Dialog, onOpen } = useConfirmationDialog({
    headerText: 'Delete this record?',
    bodyText: 'Are you sure you want delete this record? This cannot be undone.',
    confirmationButtonText: 'Delete',
    onConfirmClick: handleDeleteConfirm,
  });

  function handleDeleteConfirm() {}

  const handleDeleteClick = () => {
    onOpen();
  };

  return (
    <div>
      <Dialog />
      <button onClick={handleDeleteClick} />
    </div>
  );
}

export default Client;
```

这种模式可以少写很多与组件相关的 state，比如弹窗的 visible、title 之类的

- 将业务逻辑封装进 hooks，业务逻辑与 UI 分离（关注点分离）

```jsx
// 例如：
import React from 'react';
import ItemDisplay from './ItemDisplay';

export default function SampleComponent() {
  const { data, handleDelete, handleEdit, handleAdd } = useCustomHook();

  return (
    <div>
      <div>
        {data.map((item) => (
          <ItemDisplay item={item} />
        ))}
      </div>
      <div>
        <button onClick={handleDelete} />
        <button onClick={handleAdd} />
        <button onClick={handleEdit} />
      </div>
    </div>
  );
}
```

- 不要把所有状态存放在 redux，redux 只用于存放用户登录信息、主题等信息
- 不要任何变量都使用状态，可以使用 useRef 或成员属性（类组件）来储存与更新渲染无关的变量，可以通过已保存的状态来推断出的状态可使用 useMemo 来计算，而不要创建新状态
- 尽量不要在组件中声明新的组件

  ```jsx
  // 错误，不建议
  function A() {
    const B = () => {
      return <p>hello</p>;
    };

    return (
      <div>
        <B />
      </div>
    );
  }
  ```

  原因：

  高耦合  
  影响性能，A 每一次渲染都会重新声明一遍 B

- 避免为了优化少量性能过度设计代码，牺牲代码的可维护性、易读性，浪费时间
