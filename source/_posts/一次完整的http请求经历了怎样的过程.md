---
title: 一次完整的http请求经历了怎样的过程
categories: technology
tags: [http,网络请求,DNS,TCP]
date: 2017-09-06 00:47:06
---

> 本文将介绍完整的http请求过程。

# http请求的完整过程

![](http://img.willowspace.cn/willowspace_2016/1504634741775.png)

# TIPS

## 查看chrome客户端DNS

```shell
chrome://net-internals/#sdch
```

## 使用`mtr`命令显示链路传输状况

```shell
mtr $domain
mtr $ip
```

![](http://img.willowspace.cn/willowspace_2016/1504632218689.png)