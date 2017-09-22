---
title: Api-Mocker
categories: technology
tags: [前端,ops,接口,node,mongo]
date: 2017-09-22 21:13:02
---

# Api-Mocker

`Api-Mocker`是 `丁香园` 前端团队开源的一款接口管理软件。集诸如阿里开源的Rap、Chrome的postman等接口相关工具的优点于一身。 [github地址](https://github.com/DXY-F2E/api-mocker)

# 生产环境部署

```shell
#先安装好mongo(略)

#开始生产环境部署
git clone https://github.com/DXY-F2E/api-mocker
make install 
vim client/config/index.js
# 修改serverRoot: 'demo.domain.cn/mock-api'
vim server/config/config.prod.js
# 修改clientRoot: 'http://demo.domain.cn/mock'
make prod_client
make prod_server

#配置密码加密加盐
vim server/config/config.default.js
md5Key: 'demo-salt'
#配置找回密码邮件发送
vim server/config/config.default.js
transporter: {
  appName: 'Api Mocker',
  host: 'smtp.qq.com',
  secure: true,
  port: 465,
  auth: {
    user: 'demo@qq.com',
    pass: 'demo-auth-code'
  }
}
vim server/config/config.prod.js
clientRoot: 'http://demo.domain.cn/mock'
```

# Mongodb数据备份方案

部署 `api-mocker` 后服务一直运行，没有备份过数据。一次服务器断电重启后发现mongo的数据全部丢失。因此简单整个的备份方案。

有三种方案可以选择，参考[方案选择](https://www.mongodb.com/blog/post/mongodb-backup-strategies-compared)。这里选用mongo自带的套装命令 `mongodump` `mongorestore`

## 备份脚本

```shell
#!/bin/zsh
MONGO_DATABASE="api-mock"
APP_NAME="mongo-bak"

MONGO_HOST="127.0.0.1"
MONGO_PORT="27017"
TIMESTAMP=`date +%F-%H%M`
MONGO="/opt/mongodb-linux-x86_64-3.0.6/bin/mongo"
MONGODUMP="/opt/mongodb-linux-x86_64-3.0.6/bin/mongodump"
BACKUPS_DIR="/var/backups/$APP_NAME"
BACKUP_NAME="$APP_NAME-$TIMESTAMP"

# 锁库
$MONGO admin --eval "printjson(db.fsyncLock())"
# 备份
$MONGODUMP -d $MONGO_DATABASE
# 远程备份用下面注释的这条
# $MONGODUMP -h $MONGO_HOST:$MONGO_PORT -d $MONGO_DATABASE
# 解锁
$MONGO admin --eval "printjson(db.fsyncUnlock())"

mkdir -p $BACKUPS_DIR
mv dump $BACKUP_NAME
tar -zcvf $BACKUPS_DIR/$BACKUP_NAME.tgz $BACKUP_NAME
rm -rf $BACKUP_NAME
```

## 恢复数据

```shell
mongorestore $mongo-bak-dir
```

## mongo基本命令

用以下命令可以简单测试备份及数据恢复

```shell
# 进入mongo CLI
mongo
# 查询所有库
show dbs
# 选择库
use $db-name
# 查询所有集合
show collections
# 查询集合中的所有文档
db.$col-name.find().pretty()
# 删除集合中是所有文档
db.$col-name.remove({})
# 删除库
db.dropDatabase()
```

## 定时备份

```shell
# 创建定时任务文件
crontab $cron-file-name
# 写入规则每天0点、12点备份一次
vim $cron-file-name
0 0,12 */1 * * $backup-shell
# 启动定时任务
crontab $cron-file-name
```

# Tips

1. 投入使用前最好先配置密码加密盐，以后配置用户密码迁移成本高
2. 接口文档重写很操蛋，务必备份mongo数据！！！
3. 太旧的备份文件最好也写个脚本定时清理一下

