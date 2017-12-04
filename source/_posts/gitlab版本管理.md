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

# 四、初始化项目

##### Git global setup

```shell
git config --global user.name "willow"
git config --global user.email "admin@example.com"
```

##### Create a new repository

```shell
git clone git@code.willowspace.cn:root/willow.git
cd willow
touch README.md
git add README.md
git commit -m "add README"
git push -u origin master
```

##### Existing folder

```shell
cd existing_folder
git init
git remote add origin git@code.willowspace.cn:root/willow.git
git add .
git commit -m "Initial commit"
git push -u origin master
```

##### Existing Git repository

```shell
cd existing_repo
git remote add origin git@code.willowspace.cn:root/willow.git
git push -u origin --all
git push -u origin --tags
```

# 五、常规维护 

## 启停

```shell
# 启动Gitlab所有组件
sudo gitlab-ctl start

# 停止Gitlab所有组件
sudo gitlab-ctl stop

# 重启Gitlab所有组件
sudo gitlab-ctl restart
```

## 备份配置

打包`/etc/gitlab/`下所有文件

## 备份数据

```shell
sudo gitlab-rake gitlab:backup:create
#产生的备份包名形如下
1490183942_2017_03_22_gitlab_backup.tar
#备份文件位于/var/opt/gitlab/backups路径下
```

## 恢复数据

```shell
sudo gitlab-ctl stop unicorn
sudo gitlab-ctl stop sidekiq
sudo gitlab-ctl status
sudo gitlab-rake gitlab:backup:restore BACKUP=1490183942_2017_03_22
```

# 卸载

```shell
sudo gitlab-ctl stop
sudo gitlab-ctl uninstall
# 删除所有gitlab文件，在根目录下find -name gitlab*，找到所有相关文件，然后执行删除。
find -name gitlab*
```

