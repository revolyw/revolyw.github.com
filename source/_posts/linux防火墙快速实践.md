---
title: linux防火墙快速实践
categories: technology
tags: [linux,ubuntu,firewall,iptables,ufw,ops,security,web安全]
date: 2017-05-30 16:57:01
---

### linux防火墙介绍

__iptables__

Ubuntu的Linux内核提供一个数据包过滤框架：`netfilter`，传统的操作的命令行工具是`iptables`。它提供一套完整的可灵活配置的防火墙解决方案。但是它的使用相对复杂

精通`iptables`需要耗费很多时间，开始使用`iptables`来管理网络过滤器是个复杂的工作。所以近年来，出现了许多`iptables`的前端/上游软件，它们都是为了达到不同的目的和满足不同目标用户的需求而生的。

__ufw__

The Uncomplicated Firewall (`ufw`)是对iptables的封装，非常适合作为基于主机的防火墙。`ufw`提供了一套管理`netfilter`的框架以及一套配置防火墙的命令行接口。`ufw`的目标是提供一套容易使用的接口给不熟悉防火墙概念的人使用，同时帮助知道自己要干嘛的系统管理员简化复杂的`iptables`命令的使用。

### 使用ufw

#### 安装方法

一般ubuntu自带ufw，如果需要也可以自行安装

```shell
sudo apt-get install ufw
```

#### 使用方法

```shell
#启用
sudo ufw enable
#系统启动时关闭所有外部对本机的访问（本机访问外部正常）。
sudo ufw default deny 
#关闭
sudo ufw disable 
#查看防火墙状态
sudo ufw status
#允许外部访问80端口
sudo ufw allow 80
#禁止外部访问80端口
sudo ufw delete allow 80
#允许IP访问所有的本机端口
sudo ufw allow from 192.168.1.1
#禁止外部访问smtp服务
sudo ufw deny smtp
#删除上面建立的某条规则
sudo ufw delete deny smtp
#拒绝所有的TCP流量从10.0.0.0/8 到192.168.0.1地址的22端口
sudo ufw deny proto tcp from 10.0.0.0/8 to 192.168.0.1 port 22
#允许所有RFC1918网络（局域网/无线局域网的）访问这个主机
sudo ufw allow from 10.0.0.0/8
sudo ufw allow from 172.16.0.0/12
sudo ufw allow from 192.168.0.0/16
```

__惯例配置__

服务器通常只暴露用于管理的22端口及一个服务端(入)口80，内部再通过反向代理进行端口(服务)分发

```shell
#启用
sudo ufw enable
#系统启动时关闭所有外部对本机的访问（本机访问外部正常）。
sudo ufw default deny 
#允许外部访问80端口及22端口
sudo ufw allow 22
sudo ufw allow 80
```

__使用指南__

[ufw中文使用指南](http://wiki.ubuntu.org.cn/Ufw%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97)

