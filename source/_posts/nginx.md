---
title: nginx
categories: technology
tags: [nginx,ops,负载均衡,proxy]
date: 2017-09-10 13:41:46
---

# 一、nginx安装

```shell
#安装依赖
sudo apt-get install openssl zlib1g-dev libssl-dev gcc libpcre3 libpcre3-dev
#配置
./configure --prefix=/srv/nginx --with-http_ssl_module --with-http_realip_module --with-http_addition_module --with-http_dav_module --with-http_flv_module --with-http_mp4_module --with-http_gzip_static_module --with-mail --with-mail_ssl_module
#安装
make && make install
#设置nginx环境变量(软链接)
sudo ln -s /srv/nginx/sbin/nginx /usr/local/sbin/nginx
```

# 二、nginx模块管理

## 查看已安装的模块

```shell
nginx -V
```

## 添加编译模块

1. 查看已安装的模块

   ```shell
   nginx -V
   # 复制configure arguments后的模块
   configure arguments: --prefix=/srv/nginx --with-http_ssl_module --with-http_realip_module --with-http_addition_module --with-http_dav_module --with-http_flv_module --with-http_mp4_module --with-http_gzip_static_module --with-mail --with-mail_ssl_module
   ```

2. 重新配置编译选项并追加新增的某块

   ```shell
   ./configure --prefix=/srv/nginx --with-http_ssl_module --with-http_realip_module --with-http_addition_module --with-http_dav_module --with-http_flv_module --with-http_mp4_module --with-http_gzip_static_module --with-mail --with-mail_ssl_module 
   ```

3. make

   __切勿执行make install，否则将覆盖已安装的nginx__ 

4. 备份已安装的nginx二进制文件

   ```shell
   cp /usr/local/sbin/nginx /usr/local/sbin/nginx.bak
   ```

5. 替换重新编译的er禁止文件

   ```shell
   # 源码目录中
   cp ./objs/nginx /usr/local/sbin/nginx
   ```

6. 测试无误后删除备份

   ```shell
   rm /usr/local/nginx/sbin/nginx.bak
   ```

# 三、nginx基本配置

## 代理转发

### http代理转发

```nginx
# 将域名为x.domain.com的请求代理至localhost的8080端口
server{
    listen  80;
    server_name x.domain.com;
    location / {
       proxy_pass  http://localhost:8080/;
    }
}
```

### https代理转发

```nginx
# 默认https使用443端口
# 将从443端口进入且域名为x.domain.com的请求代理至localhost的8080端口
server {
   listen       443 ssl;
   server_name  x.domain.com;

   ssl on;
   ssl_certificate      ${cert_path}/x.pem;
   ssl_certificate_key  ${cert_path}/x.key;
   ssl_session_timeout  5m;
   ssl_ciphers  ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
   ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
   ssl_prefer_server_ciphers  on;

   location / {
       proxy_pass  http://localhost:8080/;
   }
}
```

### http强转https

```nginx
# 将域名为x.domain.com的请求301重定向为https协议请求
server{
    listen  80;
    server_name x.domain.com;

    location / {
        return 301 https://$host$request_uri;
    }
}
```

## 禁止ip直接访问

```nginx
#禁止ip直接访问80端口
server {
   listen 80 default_server;
   server_name _;
   return 444;
}
#禁止ip直接访问443端口
server {
   listen       443 ssl default_server;
   server_name  _;

   ssl on;
   ssl_certificate      ${pem_file};
   ssl_certificate_key  ${key_file};
   ssl_session_timeout  5m;
   ssl_ciphers  ${ssl_ciphers_string};
   ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
   ssl_prefer_server_ciphers  on;
   return 444;
}
```

# 四、nginx负载均衡

## 上游节点健康检测

健康检测选用淘宝团队开发的[nginx_upstream_check_module](https://github.com/yaoweibin/nginx_upstream_check_module)模块

1. 安装nginx_upstream_check_module

```shell
# 进入nginx源码目录
cd /srv/nginx-1.12.1

# 下载check模块
wget -O nginx_upstream_check_module.zip 'https://codeload.github.com/yaoweibin/nginx_upstream_check_module/zip/master'

# 解压
unzip nginx_upstream_check_module.zip

# 打补丁
patch -p1 < ./nginx_upstream_check_module-master/check_1.12.1+.patch

# 添加check模块(参考上面添加编译模块的方法)
./configure ${origin_params} --add-module=./nginx_upstream_check_module-master/
make (注意：此处只make，编译参数需要和之前的一样)
mv /usr/local/sbin/nginx /usr/local/sbin/nginx-1.21.1.bak
cp ./objs/nginx /usr/local/sbin/nginx

# 检测是否成功
/usr/local/sbin/nginx -t
```

2. 配置健康检测

```shell
# 配置上游服务器健康检测
upstream tomcat-cluster-2 {
    server 127.0.0.1:8082; #上游服务器地址及端口
    check interval=1800000 rise=2 fall=5 timeout=1000 type=http; #检测规则
    check_http_send "GET /health HTTP/1.0\r\n\r\n"; #健康检测接口，将按检测规则进行轮询
    check_http_expect_alive http_2xx http_3xx; #规定健康检测接口的成功返回状态码
}
# 配置服务器
server{
    listen  80;
    server_name x.domain.cn;

    location / {
        proxy_pass  http://tomcat-cluster-2/;
    }
    # 开启健康状态页面路由
    location /status {
            check_status html; #健康状态页面，默认以html格式展现，可选html、json、csv
            access_log   off; #不记录access_log
            #allow all;
            #deny all;
    }
}
```

3. 查看健康状态

按照如上配置，访问x.domain.cn/status可以看到健康状态![](http://img.willowspace.cn/willowspace_2016/1505020882341.png)

其中`number`代表上游服务器节点个数，`generation`为健康检测本身load的次数(nginx重启或者reload都会导致`generation`增加)

更多健康检测模块配置参考[配置文档](http://tengine.taobao.org/document_cn/http_upstream_check_cn.html)

