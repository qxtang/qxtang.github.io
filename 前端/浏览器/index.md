# 浏览器

## cookie

- 主要作用：会话状态管理、个性化设置、浏览器行为跟踪
- 一段一般不超过 4KB 的小型文本数据
- 由名称（name）、值（value）和其它几个用于控制 Cookie 有效期、安全性、使用范围的可选属性组成
- 标记为 Secure 的 Cookie 只应通过被 HTTPS 协议加密过的请求发送给服务端。

### 字段

- Name：cookie 的名称
- Value：cookie 的值
- Domain：指定了 Cookie 可以送达的主机名。
- Path：指定了一个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送 Cookie 首部
- Expires/Max-Age：用于设置 Cookie 的过期时间
- Size：cookie 的大小
- HTTPOnly：可以防止客户端脚本访问 Cookie，保证安全，例如 XSS 攻击
- Secure：指定是否使用 HTTPS 安全协议发送 Cookie
- SameSite：防止 CSRF 攻击 和用户追踪（第三方恶意获取 cookie），可以设置三个值：Strict、Lax、None

### cookie 缺点

- 大小只有 4kb、会增加请求大小
- 个数限制、长度限制
- 不安全，有可能被截获
- 相比 localstorage， 需要自己封装 setter 和 getter

### cookie-session

- HTTP 是一个无状态的协议
- 为了解决 HTTP 无状态导致的问题，出现了 cookie，这个状态是指后端服务的状态而非通讯协议的状态
- 第一次请求服务端的时候，服务端响应头出现一个 set-cookie 字段，在客户端设置一个 cookie
- 当再次请求服务端的时候，请求会附带这个 cookie 过去，cookie 中存有 sessionId 这样的信息来到服务端这边确认是否属于同一次会话
- 当客户端请求创建一个 session 的时候，服务端会先检查这个客户端的请求里是否已包含了一个 session 标识
- 如果已包含这个 sessionId，则说明以前已经为此客户端创建过 session，服务端就按照 sessionId 把这个 session 检索出来使用
- 现在可使用 jwt 替代

### 跨域请求如何携带 cookie

- 服务端设置 Access-Control-Allow-Origin 响应头，为允许跨域的域
- 服务端设置 Access-Control-Allow-Credentials 响应头 为 true
- 请求时设置 withCredentials 为 true

### withCredentials 是什么

- XMLHttpRequest 的一个请求配置
- 指示了是否该使用类似 cookies,authorization headers(头部授权)或者 TLS 客户端证书这一类资格证书来创建一个跨站点访问控制

## Web Worker

现代浏览器为 JavaScript 创造的 多线程环境。可以新建并将部分任务分配到 worker 线程并行运行，两个线程可 独立运行，互不干扰，可通过自带的 消息机制 相互通信。 基本用法：

```jsx
// 创建worker
const worker = new Worker('work.js');
// 向 worker 线程推送消息
worker.postMessage('Hello World');
// 监听 worker 线程发送过来的消息
worker.onmessage = function (event) {
  console.log('Received message ' + event.data);
};
```

限制:

- 同源限制
- 无法使用 document / window / alert / confirm
- 无法加载本地资源

## 安全

### XSS、CSRF 攻击原理和防御

XSS：

- 利用客户端代码漏洞，比如评论框，注入恶意 js 到网页
- 防御 xss：过滤 html 标签，转义页面上的输入内容和输出内容，过滤 on 开头属性，cookie 设置 httpOnly

CSRF：

- 设法伪造带有正确 Cookie 的 HTTP 请求
- 通常由于服务端没有对请求头做严格过滤引起的

::: tip

### CSRF 防御

- 不要使用 GET 请求来修改数据
- 不要被第三方网站访问到用户的 cookie
- Referer 头检测，设置白名单
- 接口不要被第三方网站请求、用 token 请求校验

:::

::: tip

### SameSite 属性

- 是 cookie 的一个属性，用来防止 CSRF 攻击和用户追踪，用来限制第三方 Cookie
- Strict  
  完全禁止第三方 Cookie，可能造成不好的用户体验，比如，当前网页有一个 GitHub 链接，用户点击跳转就不会带有 GitHub 的 Cookie，跳转过去总是未登陆状态
- Lax（默认值）
  大多数情况也是不发送第三方 Cookie，但是导航到目标网址的 Get 请求除外
- None
- 网站可以选择显式关闭 SameSite 属性，将其设为 None。不过，前提是必须同时设置 Secure 属性（Cookie 只能通过 HTTPS 协议发送），否则无效。

:::

## 白屏

### 如何解决

往 html 中填充内容，比如渲染根元素中间加上“加载中”几个字，让渲染结束前的这段时间有内容可以显示

### 计算白屏时间

使用 Performance API：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>白屏</title>
    <script type="text/javascript">
      // 不兼容performance.timing 的浏览器，如IE8
      window.pageStartTime = Date.now();
    </script>
    <!-- 页面 CSS 资源 -->
    <link rel="stylesheet" href="common.css" />
    <link rel="stylesheet" href="page.css" />
    <script type="text/javascript">
      // 白屏时间结束点
      window.firstPaint = Date.now();
    </script>
  </head>
  <body>
    <!-- 页面内容 -->
  </body>
</html>
```

可使用 Performance API 时：

```javascript
白屏时间 = firstPaint - performance.timing.navigationStart;
```

不可使用 Performance API 时：

```javascript
白屏时间 = firstPaint - pageStartTime;
```

## 同源策略（跨域）

- 不同协议、域名、端口，禁止请求，iframe、image、script、link 标签可以

::: tip

### 为什么会有同源策略

如果没有同源策略，不同源的数据和资源（如 HTTP 头、Cookie、DOM、localStorage 等）就能相互随意访问，没有安全性。

:::

### 解决

- nginx，tomcat，apache 等任何有代理相关功能的服务器
- jsonp
- cors

### jsonp

- 使用 script 标签来帮助我们跨域
- 服务端返回 `函数名({json数据})`，放在 script src 请求执行，前后端约定好函数名（或者由前端传给后端，即 callbackName）
- jquery 封装了 jsonp

::: warning

缺点：

- 不好调试，在调用失败的时候不会返回任何状态码
- 安全性，提供 jsonp 的服务可能存在页面注入漏洞

:::

### cors

- 服务器设置响应头：`Access-Control-Allow-Origin:<origin>|*`，origin 参数指定允许访问该资源的外域 URL
- 默认 CORS 仅支持客户端向服务器发送如下的 9 个请求头：

  Accept  
  Accept-Language  
  Content-Language  
  DRP  
  DownLink  
  Save-Data  
  Viewport-Width  
  Width  
  Content-Type(值仅限于 text/plain、multipart/form-data、application/x-www-form-urlencoded 三者之一)

- 如果客户端向服务器发送了额外的请求头信息，则需要在服务器端，通过 Access-Control-Allow-Headers 对额外的请求头进行声明

  ```javascript
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Custom-Header');
  ```

- 默认 CORS 仅支持客户端发起 GET、POST、HEAD 请求，如果客户端希望通过 PUT、DELETE 等方式请求，需要在服务器端，通过 Access-Control-Alow-Methods 来指明允许使用的 HTTP 方法

  ```javascript
  // 只允许 POST、GET、DELETE、HEAD 请求方法
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,DELETE,HEAD');
  // 允许所有的 HTTP 请求方法
  res.setHeader('Access-Control-Allow-Methods', '*');
  ```

同时满足以下两大条件的请求，就属于简单请求，反之为非简单请求：

- 请求方式：GET、POST、HEAD 三者之一
- HTTP 头部信息不超过以下几种字段：
  - Accept
  - Accept-Language
  - Content-Language
  - Last-Event-ID
  - Content-Type：只限于三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain

::: note

简单请求：

- 请求头自动带上 Origin
- 如果 Origin 指定的源不在允许范围之内，服务器会返回一个正常的 HTTP 回应，然后浏览器发现头信息中没有包含 Access-Control-Allow-Origin 字段，就表示出错
- 否则会出现如下响应头

  ```yaml
  Access-Control-Allow-Origin: http://api.bob.com ## 接受请求的域(*为所有)
  Access-Control-Allow-Credentials: true ## 是否可以发送cookie
  Access-Control-Expose-Headers: FooBar ## 该字段可选，XHMHttpRequest 对象的方法只能够拿到六种字段: Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma，如果想拿到其他的需要使用该字段指定
  Content-Type: text/html; charset=utf-8
  ```

- 如果请求时需要带上 cookie，请求头需要设置 withCredentials 为 true

:::

::: note

非简单请求：

- 非简单请求的 CORS 会在正式通信之前进行一次预检请求
- 浏览器先询问服务器，当前网页所在的域名是否可以请求您的服务器，以及可以使用哪些 HTTP 请求类型和头信息，只有得到正确的答复，才会进行正式的请求
- 预检使用的请求方法是 OPTIONS，表示这个请求是用来询问的

  ```yaml
  ## 预检请求示例

  OPTIONS /cors HTTP/1.1
  Origin: localhost:2333
  Access-Control-Request-Method: PUT // 表示使用的什么HTTP请求方法
  Access-Control-Request-Headers: X-Custom-Header // 表示浏览器发送的自定义字段
  Host: localhost:2332
  Accept-Language: zh-CN,zh;q=0.9
  Connection: keep-alive
  User-Agent: Mozilla/5.0...
  ```

- 服务器收到预检请求以后，检查了 Origin、Access-Control-Request-Method 和 Access-Control-Request-Headers 字段以后，确认允许跨域请求，就可以做出回应

  ```yaml
  ## 预检响应头示例

  HTTP/1.1 200 OK
  Date: Mon, 01 Dec 2008 01:15:39 GMT
  Server: Apache/2.0.61 (Unix)
  Access-Control-Allow-Origin: http://localhost:2332 // 表示 http://localhost:2332可以访问数据
  Access-Control-Allow-Methods: GET, POST, PUT
  Access-Control-Allow-Headers: X-Custom-Header
  Content-Type: text/html; charset=utf-8
  Content-Encoding: gzip
  Content-Length: 0
  Keep-Alive: timeout=2, max=100
  Connection: Keep-Alive
  Content-Type: text/plain
  ```

- 如未通过预检，会返回一个正常的 HTTP 响应，但是没有任何 CORS 的头相关信息，浏览器认定为失败
- 当预检请求通过之后就发出正常的 HTTP 请求

:::

## 事件流

描述接收事件的顺序，包括几个阶段：

- 事件捕获阶段
- 处于目标阶段
- 事件冒泡阶段
- addEventListener 第三个参数：  
  false（默认） - 事件在冒泡阶段执行  
  true - 事件在捕获阶段执行

### 事件流的应用：事件委托（事件代理）

- 不直接在目标 dom 上设置监听函数，而是在其父元素上设置监听函数
- 通过事件冒泡，父元素可以监听到子元素上事件的触发，通过判断事件发生元素 DOM 的类型，来做出不同的响应
- 举例：ul 和 li 标签的事件监听，在添加事件时候，采用事件委托机制，不在 li 标签上直接添加，而是在 ul 父元素上添加
- 比较合适动态元素的绑定，新添加的子元素也会有监听函数，也可以有事件触发机制

### target 和 currentTarget 区别

- event.target 返回触发事件的元素
- event.currentTarget 返回绑定事件的元素

### 事件冒泡

如果一个元素触发事件，那么其所有祖先元素都会依次执行触发该事件，这种机制称为冒泡  
（好比气泡从水底下一直向上冒泡，像 dom 树一样，一直到根元素。）

### 事件捕获

捕获与事件冒泡相反

### 如何取消事件冒泡

当我们只希望事件发生在它的目标而非它的父级元素上，封装 stopBubble 方法如下

```javascript
// 阻止事件冒泡的通用函数
function stopBubble(e) {
  // 如果传入了事件对象，那么就是非ie浏览器
  if (e && e.stopPropagation) {
    // 因此它支持W3C的stopPropagation()方法
    e.stopPropagation();
  } else {
    // 否则我们使用 ie 的方法来取消事件冒泡
    window.event.cancelBubble = true;
  }
}

a.onclick = function (e) {
  stopBubble(e);
};
```

## dom 元素的各种位置区别

clientHeight：表示的是可视区域的高度，不包含 border 和滚动条
offsetHeight：表示可视区域的高度，包含了 border 和滚动条
scrollHeight：表示了所有区域的高度，包含了因为滚动被隐藏的部分。
clientTop：表示边框 border 的厚度，在未指定的情况下一般为 0
scrollTop：滚动后被隐藏的高度，获取对象相对于由 offsetParent 属性指定的父坐标(css 定位的元素或 body 元素)距离顶端的高度。

## localStorage、sessionStorage、cookie 区别

- 关闭选项卡后，将删除存储在 sessionStorage 中的数据
- localStorage 永远存在，除非手动删除
- cookie 根据 expires 字段（过期时间）决定

## requestAnimationFrame

- 使用一个回调函数作为参数。这个回调函数会在浏览器重绘之前调用
- 浏览器用于定时循环操作的一个接口，类似于 setTimeout，主要用途是按帧对网页进行重绘
- 设置这个 API 的目的是为了让各种网页动画效果（DOM 动画、Canvas 动画、SVG 动画、WebGL 动画）能够有一个统一的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果
- 代码中使用这个 API，就是告诉浏览器希望执行一个动画，让浏览器在下一个动画帧安排一次网页重绘
- 优势在于可以充分利用显示器的刷新机制，比较节省系统资源
- 显示器有固定的刷新频率（60Hz 或 75Hz），也就是说，每秒最多只能重绘 60 次或 75 次，requestAnimationFrame 的基本思想就是与这个刷新频率保持同步
- cancelAnimationFrame 用于取消重绘，它的参数是 requestAnimationFrame 返回的一个代表任务 ID 的整数值
- 为了提高性能和电池寿命，因此在大多数浏览器里，当 requestAnimationFrame() 运行在后台标签页或者隐藏的 `<iframe>` 里时，requestAnimationFrame() 会被暂停调用以提升性能和电池寿命
- 当浏览器渲染线程被过度占用时这个 API 调用间隔会非常不稳定，它并不是银弹

**使用：**

```javascript
function test(timestamp) {
  console.log(timestamp);
  requestAnimationFrame(test);
}
requestAnimationFrame(test);
```
