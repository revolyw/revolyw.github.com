---
title: curl
categories: technology
tags: ops
date: 2017-01-20 14:02:54
---

# 常见使用场景

## 使用curl调试dwr接口

-i参数可现实response的相关头信息

```shell
curl -X POST -H "Host:{hostName}" "http://{ip}/{path}/{dwrClass}.{dwrMethod}.dwr" -H "Content-Type: text/plain" -d "{dwrUrlParameter}" -i -v
```

## 通过设置Cookie来模拟登陆调试接口

Cookie的获取可以通过在Chrome的Network里查看域名下任一一个请求的Head，复制Cookie即可

```shell
curl -X POST -H "Host:{hostName}" "http://{ip}/{uri}" -H "Cookie:{values}" -d "{parameters}" -i -v
```

