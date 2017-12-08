---
title: curl
categories: technology
tags: [linux命令,ops]
date: 2017-01-20 14:02:54
---

### 文件上传

```shell
curl -H "Cookie:SESSION_ID=122F2F097414B9B8DA06E01F0025A5FF" -F "file=@/var/data/image.jpeg" http://demo.cn/uploadFile
```

### 通过设置Cookie来模拟登陆调试接口

Cookie的获取可以通过在Chrome的Network里查看域名下任一一个请求的Head，复制Cookie即可

```shell
curl -X POST -H "Host:{hostName}" "http://{ip}/{uri}" -H "Cookie:{values}" -d "{parameters}" -i -v
```

### 下载文件

```shell
# 使用curl
curl -o ${saved_filename} ${url}
# 使用wget
wget -O ${saved_filename} ${url}
```

###  测速

```shell
curl -o /dev/null -s -w '%{time_connect}:%{time_starttransfer}:%{time_total}\n' 'https://demo.cn'
```

| 计时器                | 描述                                       |
| ------------------ | ---------------------------------------- |
| time_connect       | 建立到服务器的 TCP 连接所用的时间                      |
| time_starttransfer | 在发出请求之后,Web 服务器返回数据的第一个字节所用的时间           |
| time_total         | 完成请求所用的时间                                |
| time_namelookup    | DNS解析时间,从请求开始到DNS解析完毕所用时间(记得关掉 Linux 的 nscd 的服务测试) |
| speed_download     | 下载速度，单位-字节每秒。                            |

### 使用curl调试dwr接口

-i参数可现实response的相关头信息

```shell
curl -X POST -H "Host:{hostName}" "http://{ip}/{path}/{dwrClass}.{dwrMethod}.dwr" -H "Content-Type: text/plain" -d "{dwrUrlParameter}" -i -v
```

### 