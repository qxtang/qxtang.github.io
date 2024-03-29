# web 应用登录方案

## cookie + session

## 仅 jwt

- 后端直接签发 jwt，后端不存储
- 缺点：一旦下发，后端无法拒绝携带该 jwt 的请求，无法踢除用户

## jwt + redis

- 后端备份一份 token 存入 redis，请求进来时，使用前端传来的 jwt 从 redis 查询出对应 token，做对比
- 若 redis 中的 token 过期或不存在则视为无权限

## 长短 token

- 首次登录设置两个 token，都保存进 redis

  - access_token：标准 JWT 格式，即请求时的授权令牌，过期时间较短，一般 2 个小时，redis key：uuid-access，value：jwt
  - refresh_token：用于刷新 access_token，过期时间较长，一般 1 个月，redis key：uuid-refresh，value：jwt

- 添加凭 refresh_token 刷新 access_token 的接口
- 前端请求封装

  - 先发起请求，如果接口返回 access_token 过期，先刷新 access_token，再进行一次重试

- 为了让活跃用户保持登录，其他方案频繁续签会有性能问题，该方案解决此问题

## 实践中遇到的问题

### 前端请求刷新 token 有延迟，如何防止多次请求同时发起多次刷新 token

- 请求封装中设置刷新 token 防抖锁，如果一次刷新任务进行中，则其他刷新请求取消

### 同时发起多个请求时，access_token 正好过期，同时多次提示无权限

- 请求封装中，如果刷新 token 锁处于关闭状态，则把请求任务保存进一个数组，等待锁打开再执行

## 密码保存

### 哈希加盐

哈希函数：单向不可逆加密算法

### 直接哈希的缺陷

- 有可能被查表法、逆向查表法、彩虹表等方式破解
- 首先将一些比较常用的密码的哈希值算好，然后建立一张表，当然密码越多，这张表就越大。当你知道某个密码的哈希值时，你只需要在你建立好的表中查找该哈希值，如果找到了，你就知道对应的密码了

### 加盐

- 盐就是一个随机生成的字符串
- 将盐与原始密码连接在一起（前或后都可以），然后将连接后的字符串加密
- 盐和加密后的密码一起保存进数据库
- 登录时将盐和密码都查出来，前端传来的密码同样算法加密后进行比对

### 直接 md5 加密保存

- 不可逆加密算法，输入任意长度的信息，经过处理，输出都是 128 位的信息值
- 小于 8 位的密码用 md5 加密不安全
