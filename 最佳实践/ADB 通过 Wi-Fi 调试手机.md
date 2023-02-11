# ADB 通过 Wi-Fi 调试手机

- 手机和电脑需连接在同一 WiFi 下
- 手机启用开发者选项和无线调试模式
- 允许无线调试后，选择使用配对码配对，`adb pair ip:port`，填写显示的配对码、IP 地址和端口号
- 运行 `adb connect ip:port`
