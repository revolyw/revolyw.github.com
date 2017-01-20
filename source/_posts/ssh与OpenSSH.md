---
title: ssh与OpenSSH
categories: technology
tags: ops
date: 2017-01-20 13:58:21
---

# 服务端安装并启动Openssh服务

```shell
sudo apt-get update
sudo apt-get install openssh-server
sudo service ssh start
```

# 客户端配置公私钥对

```shell
sudo ssh-keygen -t rsa -C "..."
sudo ssh-copy-id user@server_ip
sudo service ssh restart
```

# 使用ssh进行免密登录

```shell
sudo ssh user@server_ip
```