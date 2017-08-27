---
title: gitlab版本管理
categories: technology
tags: [代码版本管理,持续集成,git]
date: 2017-08-27 16:57:23
---

# 一、安装

安装环境为：`ubuntu`

```shell
# 安装并配置必须的依赖
sudo apt-get install -y curl openssh-server ca-certificates
# 添加gitlab包及服务并安装gitlab包
curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh | sudo bash sudo apt-get install gitlab-ce
# 配置并启动gitlab
sudo gitlab-ctl reconfigure
```

# 二、配置gitlab访问域名及端口

```shell
# 打开gitlab配置文件
vim /etc/gitlab/gitlab.rb
# 修改访问入口项
external_url 'http://code.domain.com:${port}'
```

# 三、访问并设置初始密码

初始账号为root，第一次访问时会要求重置密码

