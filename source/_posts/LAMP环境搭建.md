---
title: LAMP环境搭建
categories: technology
tags: [apache,httpd,php,ops,虚拟内存]
date: 2017-06-01 04:20:50
---

linux+apache+mysql+php，linux及mysql略，本文介绍apache上部署php。

# 一、安装apache

__下载apache相关资源__

[httpd(apache)](http://httpd.apache.org/download.cgi)

[apr(apache portable runtime)](http://apr.apache.org/download.cgi)

[apr-util](http://archive.apache.org/dist/apr/apr-util-1.5.2.tar.gz)

__apr及apr-util移至httpd的srclib目录下__

```shell
cp -rf apr-1.5.2 /srv/httpd-2.4.25/srclib/apr
cp -rf apr-util-1.5.2 /srv/httpd-2.4.25/srclib/apr-util
```

__apr编译安装__

```shell
cd /srv/httpd-2.4.25/srclib/apr
./configure --prefix=/srv/httpd-2.4.25/srclib/apr
make && make install
```

__apr-util编译安装__

```shell
cd /srv/httpd-2.4.25/srclib/apr-util
./configure --prefix=/srv/httpd-2.4.25/srclib/apr-util --with-apr=/srv/httpd-2.4.25/srclib/apr
make && make install
```

__libpcre安装__

```shell
sudo apt-get install libpcre3-dev
```

apache2.4中文文档__

http://httpd.apache.org/docs/2.4/

__httpd配置项__

```shell
--prefix=/usr/local/apache2 ：指定安装目标路径
--sysconfdir=/etc/apache2/conf ：指定配置文件安装位置
--enable-so ：支持动态共享模块，如果没有这个模块PHP将无法与apache结合工作
--enable-rewirte ：支持URL重写
--enable-ssl ：启用支持ssl
--enable-cgi ：启用支持cgi
--enable-cgid :启用支持带线状图形的CGI脚本 MPMs
--enable-modules=most ：安装大多数模块
--enable-modules-shared=most ：安装大多数共享模块
--enable-mpms-shared=all ：支持全部多道处理方式
--with-apr=/usr/local/apr ：指定apr路径
--with-apr-util=/usr/local/apr-util ：指定apr-util路径
```

__编译安装启动__

```shell
#/opt/httpd-2.4.25
./configure --prefix=/srv/apache2 --enable-so --enable-rewirte --with-apr=/srv/httpd-2.4.25/srclib/apr --with-apr-util=/srv/httpd-2.4.25/srclib/apr-util
make
make install
#修改端口 /srv/apache2/conf/httpd.conf
Listen 8000
ServerName ${intranet_ip}:8000
#启动apache服务器 /srv/apache2
./bin/apachectl start
#访问8000端口显示It works则说明成功
```

__安装遇到warning: setlocale: LC_CTYPE: cannot change locale (UTF-8)__

参考[warning: setlocale: LC_CTYPE: cannot change locale](http://blog.csdn.net/aca_jingru/article/details/45557027)

# 二、搭建php运行环境

__下载php__

https://secure.php.net/downloads.php

__编译安装php__

```shell
#配置编译项
./configure --prefix=/opt/php --with-apxs2=/srv/apache2/bin/apxs --with-config-file-path=/usr/local/php/etc --with-mysql --with-pdo-mysql --with-mysql-sock=/var/mysql/mysql.sock
#编译
make && make install
```

如果出现libxml2找不到的情况，执行以下命令

```shell
sudo apt-get install libxml2-dev
```

如果编译时出现了virtual memory exhausted: Cannot allocate memory错误，这是因为服务器的内存不够

可临时通过增加虚拟内存来解决这个问题，参考[增加虚拟内存的方法](http://blog.willowspace.cn/technology/2017/09/Linux%E8%99%9A%E6%8B%9F%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/)。

__apache服务器支持php__

修改${apache_path}/httpd.conf文件

```xml
<IfModule mime_module>
	AddType application/x-httpd-php .php
</IfModule>
```

__apache服务器运行php脚本__

修改${apache_path}/httpd.conf文件,

```xml
DocumentRoot "/srv/${project_path}"
<Directory "/srv/${project_path}">
...
</Directory>
```

在${project_path}下创建一个php文件测试

```php
<?php
  phpinfo();
?>
```

重新apache服务

```shell
${apache_path}/bin/apachectl restart
```

访问自定义配置的端口(此处为8000)，看到php相关信息的页面，成功了！

# 三、apache2配置多个站点

## 开启多站点配置

```shell
vim /srv/apche2/conf/httpd.conf
## 打开对应配置项
# Virtual hosts
Include conf/extra/httpd-vhosts.conf  
```

## 配置多站点的根目录

```xml
<!-- vim /srv/apche2/conf/httpd.conf -->

<!-- 设置多站点的根目录 -->
DocumentRoot "/srv/apache2/htdocs"
<Directory "/srv/apache2/htdocs">
  ...
</Directory>

<!-- 需要配置的多个站点必须置于该目录之下，否则无权访问 -->
```

## 配置站点信息

```xml
<!-- vim /srv/apche2/conf/extra/httpd-vhosts.conf -->
<!-- 一个VirtualHost节点即为一个站点 -->
<VirtualHost *:8000>
    ServerAdmin webmaster@dummy-host.example.com
    DocumentRoot "/srv/apache2/htdocs/willowspace"
    ServerName willowspace.cn
    ServerAlias www.willowspace.cn
    ErrorLog "logs/willowspace-error_log"
    CustomLog "logs/willowspace-access_log" common
</VirtualHost>
...
```

## 配置目录访问控制

```xml
<!-- vim /srv/apche2/conf/extra/httpd-vhosts.conf -->
<VirtualHost *:8000>
    ServerAdmin webmaster@dummy-host.example.com
    DocumentRoot "/srv/apache2/htdocs/assets"
    ServerName assets.willowspace.cn
    ErrorLog "logs/assets-error_log"
    CustomLog "logs/assets-access_log" common
    <!-- 目录访问控制 +Indexes表示允许显示文件索引列表 -->
    <Directory /srv/apache2/htdocs/assets>
        Options +Includes +Indexes
        AllowOverride All
        Order Deny,Allow
        Allow from All
    </Directory>
</VirtualHost>
```

