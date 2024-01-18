# adb 通过 wifi 调试微信 h5

- 手机和 pc 连接在同一 wifi 环境下
- 手机启用开发者选项和无线调试模式
- 手机选择"使用配对码配对设备"，pc 执行 `adb pair {配对ip}:{配对端口}`，输入手机给的配对码
- pc 执行 `adb connect {无线调试ip}:{无线调试端口}`
- 微信打开 `http://debugxweb.qq.com/?inspector=true`，是微信客户端的内置域名，开启微信的远程调试功能
- 即可通过 chrome 的 Remote debugging 功能进行调试

## 参考

- <https://developer.android.com/studio/command-line/adb?hl=zh-cn#connect-to-a-device-over-wi-fi>
