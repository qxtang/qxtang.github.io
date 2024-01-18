# Nginx 笔记

> 工作中经常用的，简单记录一下。

## 常用命令

- nginx 启动
- nginx -c filename 指定配置文件启动
- nginx -s stop 快速关闭，可能不保存相关信息，并迅速终止 web 服务
- nginx -s quit 平稳关闭 Nginx，保存相关信息，有安排的结束 web 服务
- nginx -s reload 重启
- nginx -t 测试配置文件
- nginx -t -c xxx.conf 测试指定配置文件

## 实用配置

- 修改用户

```nginx
# 往往在第一行
user root;
```

- 跨域

```nginx
# 这里约定代理请求url path是以/apis/开头
location ^~/apis/ {
    # 这里重写了请求，将正则匹配中的第一个()中$1的path，拼接到真正的请求后面，并用break停止后续匹配
    rewrite ^/apis/(.*)$ /$1 break;
    ...
    proxy_pass https://www.tianqiapi.com/;
}
```

- 处理前端单页应用的 history 路由模式

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

- 适配 PC 和移动环境

```nginx
location / {
    # 移动、pc设备适配
    if ($http_user_agent ~* '(Android|webOS|iPhone|iPod|BlackBerry)') {
        set $mobile_request '1';
    }
    if ($mobile_request = '1') {
        rewrite ^.+ http://mysite-base-H5.com;
    }
}

```

- 端口转发

```nginx
http {
    ...
    upstream dmp8001 {
        server 127.0.0.1:8001;
    }
    server {
        listen       80;
        server_name  abc.com;

        location / {
            ...
            proxy_pass http://dmp8001;
        }
    }
    ...
}
```

- 善用正则

```nginx
# 动态校验企业微信 h5 应用可信域名
location ~ WW_verify_(.*).txt {
    return 200 $1;
}
```

- 虚拟主机

```nginx
server {
    listen 12332;
    server_name 127.0.0.1;

    location / {
        root D:/Desktop/test;
        index index.html index.htm;
    }
}
```

- 防媒体文件盗链

```nginx
location ~* \.(gif|jpg|png|jpeg|mp4)$ {

    expires 30d;
    valid_referers *.hugao8.com www.hugao8.com m.hugao8.com *.baidu.com *.google.com;

    if ($invalid_referer) {
        rewrite ^/ http://ww4.sinaimg.cn/bmiddle/051bbed1gw1egjc4xl7srj20cm08aaa6.jpg;
        # return 404;
    }

}
```

## 简单实现负载均衡

- 轮询（默认），请求过来后，Nginx 随机分配流量到任一服务器

```nginx
upstream backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
}
```

- weight=number 设置服务器的权重，默认为 1，权重大的会被优先分配

```nginx
upstream backend {
    server 127.0.0.1:3000 weight=2;
    server 127.0.0.1:3001 weight=1;
}
```

- backup 标记为备份服务器。当主服务器不可用时，将传递与备份服务器的连接

```nginx
upstream backend {
    server 127.0.0.1:3000 backup;
    server 127.0.0.1:3001;
}
```

代理这个集群

```nginx
server {
    listen      9000;
    server_name localhost;

    location / {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Scheme $scheme;

        proxy_pass backend;
    }
}
```

## 关于 location 的匹配

### location 的几种匹配方式

普通匹配：

```nginx
location = URI { configuration } #精确匹配
location ^~ URI { configuration } #非正则匹配
location [空格] URI { configuration } #前缀匹配
```

正则匹配：

```nginx
location ~ URI { configuration } #区分大小写
location ~* URI { configuration } #不区分大小写
```

### 几种匹配方式的说明与优先级

整体规则按照先普通匹配，然后再正则匹配，如果正则不匹配，则回退至上一个普通匹配。其中普通匹配没有顺序之分，哪个匹配最精确，就使用哪个 location，正则匹配按照<mark>规则的书写顺序</mark>进行。

- `=` 精确匹配，匹配后停止后续匹配，直接执行该匹配后的 configuration。
- `[空格]` 前缀匹配，匹配后，继续更长前缀匹配和正则匹配。
- `^~` <mark>不属于正则匹配</mark>，匹配该规则后，停止继续正则匹配。
- `~` 区分大小写的正则匹配，按顺序匹配，一旦匹配即停止后续匹配。
- `~*` 不区分大小写的正则匹配，按顺序匹配，一旦匹配即停止后续匹配。

### 示例

```nginx
location = / {
    [ configuration A ]
}

location / {
    [ configuration B ]
}

location /user/ {
    [ configuration C ]
}

location ^~ /images/ {
    [ configuration D ]
}

location ~* \.(gif|jpg|jpeg)$ {
    [ configuration E ]
}
```

- 请求`/`精准匹配 A，不再往下查找。
- 请求`/index.html`匹配 B。首先查找匹配的前缀字符，找到最长匹配是配置 B，接着又按照顺序查找匹配的正则。结果没有找到，因此使用先前标记的最长匹配，即配置 B。
- 请求`/user/index.html`匹配 C。首先找到最长匹配 C，由于后面没有匹配的<mark>正则</mark>，所以使用最长匹配 C。
- 请求`/user/1.jpg`匹配 E。首先进行前缀字符的查找，找到最长匹配项 C，继续进行正则查找，找到匹配项 E。因此使用 E。
- 请求`/images/1.jpg`匹配 D。首先进行前缀字符的查找，找到最长匹配 D。但是，特殊的是它使用了^~修饰符，<mark>不再进行接下来的正则的匹配查找</mark>，因此使用 D。这里，如果没有前面的修饰符，其实最终的匹配是 E。大家可以想一想为什么。
- 请求`/documents/about.html`匹配 B。因为 B 表示任何以/开头的 URL 都匹配。在上面的配置中，只有 B 能满足，所以匹配 B。

### 总结

- location 的配置有两种形式，普通和正则。
- 查找匹配的时候，先查找普通，选择最长匹配项，再查找正则。
- 正则的优先级高于普通。
- 正则查找是<mark>按照在配置文件中的顺序</mark>进行的，因此正则顺序很重要，建议越精细的放的越靠前。
- 使用`=`精准匹配可以加快查找的效率，如果经常被访问建议使用精确匹配`=`。
