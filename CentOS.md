# CentOS

## 转发虚拟机的服务给宿主（例如：xshell 通过 ssh 连接 VirtualBox 中的 centos）

- 设置 -> 网络 -> 高级 -> 端口转发
- 主机 ip：127.0.0.1 或 不填
- 主机端口：主机用于请求
- 子系统 ip：可不填
- 子系统端口：虚拟机中真实服务端口
- 参考：<https://blog.csdn.net/chengqiuming/article/details/83239413>

## windows virtual box 无法创建、启动虚拟机解决方法

- run virtual box service as administrator (VBoxSVC.exe), if running kill it first.
- run virtual box main executable (VirtualBox.exe whatever is on your desktop) as adminstrator too

## 首次安装

- `sudo yum -y install lrzsz`
- `sudo yum -y install curl`
- `sudo yum -y install wget`
- 安装最新版 git：`sudo yum -y install https://packages.endpointdev.com/rhel/7/os/x86_64/endpoint-repo.x86_64.rpm && sudo yum -y install git`

  参考：<https://computingforgeeks.com/install-git-2-on-centos-7/>

- 关防火墙：`sudo systemctl stop firewalld.service && sudo systemctl disable firewalld.service`

## 安装 nginx

- `sudo yum -y install epel-release && sudo yum update && sudo yum -y install nginx`
- 参考：<https://blog.csdn.net/zhou_438/article/details/89554438>

## 安装 Jenkins

参考：<https://blog.csdn.net/Mr_Bobcp/article/details/130464060>

```bash
yum install java-11-openjdk && \
wget https://mirrors.aliyun.com/jenkins/redhat/jenkins-2.390-1.1.noarch.rpm && \
rpm -ivh jenkins-2.390-1.1.noarch.rpm
```

## 设置开机启动

- `systemctl start jenkins`
- 参考：<https://www.cnblogs.com/supiaopiao/p/12160541.html>
