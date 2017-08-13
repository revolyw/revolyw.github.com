---
title: 微信APP支付流程
categories: technology
tags: [微信,微信支付,APP,业务]
date: 2017-08-14 02:00:47
---

# 支付流程

> 流程涉及微信公众平台、微信商户平台、微信开放平台三大平台

![](https://pay.weixin.qq.com/wiki/doc/api/img/chapter8_3_1.png)

# 服务端需要开发三个接口

## 一、统一下单接口

商户后台收到用户支付单，调用微信支付统一下单接口。参见【[统一下单API](https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=9_1)】

## 二、接收支付通知接口

商户后台接收支付通知。api参见【[支付结果通知API](https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=9_7)】

## 三、查询支付结果的接口

商户后台查询支付结果。api参见【[查询订单API](https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=9_2)】

# APP端主要开发调起微信支付的接口

商户APP调起微信支付。api参见本章节【[app端开发步骤说明](https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=8_5)】