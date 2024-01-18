# Linux 命令

## 查看

- `pwd`
- `ll、ls`
- `cat`
- `head -2 file1` 查看前几行
- `less`
- `tail -3 file1` 查看一个文件的最后三行
- `top` 查看内存
- `free -m` 查看内存统计
- `cd / && du -sh *` 查看任意目录下文件夹大小
- `df -h` 查看磁盘空间大小
- `ip addr`、`ifconfig`

## grep

- `grep str /tmp/test` 在文件 ‘/tmp/test’ 中查找 “str”
- `grep ^str /tmp/test` 在文件 ‘/tmp/test’ 中查找以 “str” 开始的行
- `grep [0-9] /tmp/test` 查找 ‘/tmp/test’ 文件中所有包含数字的行
- `grep str -r /tmp/*` 在目录 ‘/tmp’ 及其子目录中查找 “str”

## find

- `find / -name file1` 从 ‘/’ 开始进入根文件系统查找文件和目录
- `find /home/user1 -name *.bin` 在目录 ‘/ home/user1’ 中查找以 ‘.bin’ 结尾的文件

## 文件操作

- `mkdir`
- `mv`
- `rm`
- `cp`
- `touch file1`

## 其他

- `diff file1 file2` 找出两个文件的不同
- `sdiff file1 file2` 以对比的方式显示两个文件的不同
- `shutdown -h now` 立即关机
- `shutdown -r now` 立即重启
- `man` 查看参考手册（例如 man ping）

## 压缩

- `tar -cvf archive.tar` file1 把 file1 打包成 archive.tar（-c: 建立压缩档案；-v: 显示所有过程；-f: 使用档案名字，是必须的，是最后一个参数）
- `tar -xvf archive.tar` 释放一个包
- `tar -xvf archive.tar -C /tmp` 把压缩包释放到 /tmp 目录下

## vi

- `i` 编辑模式
- `:w` :w! 保存
- `:q` :q! 退出
- `:wq` 保存并且退出
- `x` 删除当前光标所在处的字符
- `dd` 删除游标所在的那一整行
- `ndd` n 为数字。删除光标所在的向下 n 行，例如 20dd 则是删除 20 行
- `yy` 复制游标所在的那一行
- `nyy` n 为数字。复制光标所在的向下 n 行，例如 20yy 则是复制 20 行
- `p, P` p 为粘贴游标下一行，P 则为粘贴在游标上一行
- `u` 撤销
- `ctrl + r` 重做上一个动作

## 防火墙

- `systemctl stop firewalld.service`
- `systemctl disable firewalld.service`
- `systemctl restart iptables.service`
- `systemctl enable iptables.service`

## lrzsz

- `rz` 上传
- `rz -y` 覆盖上传
- `sz` 下载
