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

# 服务端授权客户端访问

```shell
# 修改授权访问文件，若无此文件则新建
vim ~/.ssh/authorized_keys
# 按行输入须授权的客户端ssh公钥即可
```

# 客户端配置公私钥对

```shell
sudo ssh-keygen -t rsa -f ~/.ssh/id_rsa_xxx -C "..."
sudo service ssh restart
```

# 添加客户端ssh公钥到服务器授权访问列表

```shell
sudo ssh-copy-id -i ~/.ssh/id_rsa.pub user@server_ip
```

# 使用ssh进行免密登录

```shell
sudo ssh user@server_ip
```

# 客户端配置n个Key访问n个服务

https://appkfz.com/2015/06/18/git-ssh-key/

多站点使用不同的ssh key

```shell
Host company
  HostName company.com
  User git
  IdentityFile ~/.ssh/user1
Host github
  HostName github.com
  User git
  IdentityFile ~/.ssh/user2
```

同一站点使用不同的ssh key

```shell
Host gitcafe-site1
  HostName gitcafe.com
  User git
  IdentityFile ~/.ssh/user1
Host gitcafe-site2
  HostName gitcafe.com
  User git
  IdentityFile ~/.ssh/user2
```

# Q&A

## ssh-add报错

- 报错1

  ```shell
  Error connecting to agent: Connection refused
  ```

- 重启ssh-agent

  ```shell
  exec ssh-agent zsh
  eval `ssh-agent -s`
  ```

# 多客户端SSH KEY

配置了多个KEY，但是jenkins验证失败，尝试重启jenkins所在的web服务器