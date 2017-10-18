---
title: Linux用户(组)及权限管理
categories: technology
tags: [linux,ops]
date: 2017-09-06 00:36:01
---

# 用户(组)管理

```shell
# 新增用户
useradd -s /bin/zsh -d /home/$user -m $user
# 修改用户密码
passwd $user
# 用户添加到新组
usermod -a -G $newGroup $user
# 查看用户信息信息
id $user
uid=1001($user) gid=1001($user) groups=1001($user),33(www-data)
# 给用户分配组
gpasswd -a $user $group
# 查看用户所属组情况
groups $userName
# 把用户从组删除
gpasswd -d $user $group
# 删除用户
userdel -r $user
```

# 用户(组)权限管理

```shell
# 给目录指定所属用户及所属用户组
chown -R $user:$group $directory
# 给目录指定同组用户的权限
chmod -R g+wrx $directory
chmod -R g-wrx $directory
```

