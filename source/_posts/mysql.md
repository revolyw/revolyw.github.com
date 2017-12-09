---
title: mysql
categories: technology
tags: [mysql,database,ops]
date: 2017-12-09 03:17:36
---

# mysql运维

## 装卸

```shell
sudo apt-get install mysql-server-5.7
service mysql start
service mysql stop
sudo apt-get remove mysql-server-5.7
# 数据存放目录 /var/lib/mysql
# 配置存放目录 /etc/mysql
```

## 用户管理

```shell
# root用户登录
mysql -u root -p
# 切勿修改root用户和使用root用户进行生产
```

[Adding User Accounts](https://dev.mysql.com/doc/refman/5.7/en/adding-users.html)

```mysql
# e.g.1
CREATE USER 'finley'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'finley'@'localhost' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON database.table TO 'finley'@'localhost' WITH GRANT OPTION;
# e.g.2
CREATE USER 'finley'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'finley'@'%' WITH GRANT OPTION;
# e.g.3
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'password';
GRANT RELOAD,PROCESS ON *.* TO 'admin'@'localhost';
# e.g.4
CREATE USER 'dummy'@'localhost';
```

[Removing User Accounts](https://dev.mysql.com/doc/refman/5.7/en/removing-users.html)

```mysql
DROP USER 'jeffrey'@'localhost';
```

## 授权管理

[The MySQL Access Privilege System](https://dev.mysql.com/doc/refman/5.7/en/privilege-system.html)

[When Privilege Changes Take Effect](https://dev.mysql.com/doc/refman/5.7/en/privilege-changes.html)

```mysql
# e.g.1
GRANT ALL ON db1.* TO 'jeffrey'@'localhost';
# e.g.2
GRANT SELECT ON db2.invoice TO 'jeffrey'@'localhost';
```

## 授权用户远程连接

```mysql
# 检查一下3个配置文件是否有host绑定
/etc/mysql/mysql.cnf
/etc/mysql/conf.d/mysql.cnf
/etc/mysql/mysql.conf.d/mysql.cnf
# 注释本地host绑定
bind-address = 127.0.0.1
# 授权用户可连接的host
GRANT ALL PRIVILEGES ON *.* TO 'user'@'%' IDENTIFIED BY 'password' WITH GRANT OPTION;
# 刷新授权
FLUSH PRIVILEGES;
```

## 数据编码

[Character Set Configuration](https://dev.mysql.com/doc/refman/5.7/en/charset-configuration.html)

```mysql
# 查看编码设置
show variables like '%character%';
```

## DDL、DML导入脚本

```shell
mysql -u user -p
use database
source ~/script.sql
```

## 数据备份与恢复

[Chapter 7 Backup and Recovery](https://dev.mysql.com/doc/refman/5.7/en/backup-and-recovery.html)

分为物理备份和逻辑备份两种

物理备份是备份的数据元文件，备份恢复快，适合数据量大，压缩率低，占用空间多，需要快速恢复的场景。具体可参考 [MySQL Enterprise Backup Overview](https://dev.mysql.com/doc/refman/5.7/en/mysql-enterprise-backup.html)

逻辑备份是备份DDL,DML语句，备份恢复慢，适合数据量小，压缩率高，占用空间少，恢复速度要求低的场景![](http://img.willowspace.cn/willowspace_2016/1512758006545.png?imageMogr2/thumbnail/800)

具体选择的策略可参考[MySQL Backup in Facebook](http://cenalulu.github.io/mysql/how-we-do-mysql-backup-in-facebook/)

逻辑备份具体可选用主从复制的方式，从slave节点上进行备份.

贴个逻辑备份脚本

## 主从复制

[Replication](https://dev.mysql.com/doc/refman/5.7/en/replication.html)