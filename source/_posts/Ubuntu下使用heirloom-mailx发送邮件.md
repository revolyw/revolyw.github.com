---
title: Ubuntu下使用heirloom-mailx发送邮件
categories: technology
tags: [linux,ubuntu,ops,monitor]
date: 2017-12-09 13:11:46
---

# 基本使用

```shell
# install
sudo apt-get install heirloom-mailx
# configure
vim /etc/s-nail.rc
set from=${demo@qq.com}
set smtp=smtps://smtp.qq.com:465
set smtp-auth-user=${demo@qq.com}
set smtp-auth-password=${password}
set smtp-auth=login
# send mail
echo "mail content" | mail -vs "mail subject" ${target@mail.com}
```

