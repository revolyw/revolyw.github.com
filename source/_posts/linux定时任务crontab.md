---
title: linux定时任务crontab
categories: technology
tags: [linux,ops,crontab]
date: 2017-12-09 03:21:14
---

# crontab

## 介绍

通过crontab 命令，我们可以在固定的间隔时间执行指定的系统指令或 shell script脚本。时间间隔的单位可以是分钟、小时、日、月、周及以上的任意组合。这个命令非常适合周期性的日志分析或数据备份等工作。

```shell
crontab [-u user] file crontab [-u user][ -e | -l | -r ]
```

## 参数

- -u user：用来设定某个用户的crontab服务；
- file：file是命令文件的名字,表示将file做为crontab的任务列表文件并载入crontab。如果在命令行中没有指定这个文件，crontab命令将接受标准输入（键盘）上键入的命令，并将它们载入crontab。
- -e：编辑某个用户的crontab文件内容。如果不指定用户，则表示编辑当前用户的crontab文件。
- -l：显示某个用户的crontab文件内容，如果不指定用户，则表示显示当前用户的crontab文件内容。
- -r：从/var/spool/cron目录中删除某个用户的crontab文件，如果不指定用户，则默认删除当前用户的crontab文件。
- -i：在删除用户的crontab文件时给确认提示。

## crontab的文件格式

分 时 日 月 星期 要运行的命令

- 第1列分钟0～59
- 第2列小时0～23（0表示子夜）
- 第3列日1～31
- 第4列月1～12
- 第5列星期0～7（0和7表示星期天）
- 第6列要运行的命令

## crontab文件惯例

我个人惯例会把cron文件创建在`/opt/cron`目录下

新创建的cron文件的副本会被放在`/var/spool/cron/crontabs`目录下，文件名为用户名

## 使用方法

```shell
# 创建cron文件
vim /opt/cron/cron_file
# 提交cron任务
crontab /opt/cron/cron_file
# 启动
/etc/init.d/cron start
# 关闭
/etc/init.d/cron stop
# 重启
/etc/init.d/cron restart
```

## 使用注意事项

新创建的cron job，不会马上执行，至少要过2分钟才执行。如果重启cron则马上执行。

当crontab失效时，可以尝试/etc/init.d/crond restart解决问题。或者查看日志看某个job有没有执行/报错tail -f /var/log/cron。

千万别乱运行crontab -r。它从Crontab目录（/var/spool/cron）中删除用户的Crontab文件。删除了该用户的所有crontab都没了。

在crontab中%是有特殊含义的，表示换行的意思。如果要用的话必须进行转义%，如经常用的date ‘+%Y%m%d’在crontab里是不会执行的，应该换成date ‘+%Y%m%d’。`

## cron表达式![](http://img.willowspace.cn/willowspace_2016/1504599291802.png)

```shell
# 实例1：每1分钟执行一次myCommand
* * * * * myCommand
# 实例2：每小时的第3和第15分钟执行
3,15 * * * * myCommand
# 实例3：在上午8点到11点的第3和第15分钟执行
3,15 8-11 * * * myCommand
# 实例4：每隔两天的上午8点到11点的第3和第15分钟执行
3,15 8-11 */2  *  * myCommand
# 实例5：每周一上午8点到11点的第3和第15分钟执行
3,15 8-11 * * 1 myCommand
# 实例6：每晚的21:30重启smb
30 21 * * * /etc/init.d/smb restart
# 实例7：每月1、10、22日的4 : 45重启smb
45 4 1,10,22 * * /etc/init.d/smb restart
# 实例8：每周六、周日的1 : 10重启smb
10 1 * * 6,0 /etc/init.d/smb restart
# 实例9：每天18 : 00至23 : 00之间每隔30分钟重启smb
0,30 18-23 * * * /etc/init.d/smb restart
# 实例10：每星期六的晚上11 : 00 pm重启smb
0 23 * * 6 /etc/init.d/smb restart
# 实例11：每一小时重启smb
* */1 * * * /etc/init.d/smb restart
# 实例12：晚上11点到早上7点之间，每隔一小时重启smb
0 23-7 * * * /etc/init.d/smb restart
```

# 定时备份

```shell
# 创建定时任务文件
crontab $cron-file-name
# 写入规则每天0点、12点备份一次
vim $cron-file-name
0 0,12 */1 * * $backup-shell
# 启动定时任务
crontab $cron-file-name
```

