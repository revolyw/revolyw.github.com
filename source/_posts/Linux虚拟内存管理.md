---
title: Linux虚拟内存管理
categories: technology
tags: [linux,内存管理,虚拟内存]
date: 2017-09-05 22:53:11
---

# 管理虚拟内存

```shell
#先看一下当前内分分布
free -m 
#开始分配虚拟内存
mkdir /usr/img/ 
rm -rf /usr/img/swap
dd if=/dev/zero of=/usr/img/swap bs=1024 count=2048000
mkswap /usr/img/swap
swapon /usr/img/swap
#查看分配虚拟内存后的内存分布
free -m
#使用完干掉虚拟内存
swapoff /usr/img/swap
rm -f /usr/img/swap
```

