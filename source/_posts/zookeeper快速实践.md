---
title: zookeeper快速实践
categories: technology
tags: [zookeeper,分布式,集群]
date: 2017-04-21 00:14:39
---

## zookeeper资源获取

- [zookeeper官网](http://zookeeper.apache.org/)
- [zookeeper下载](http://mirrors.hust.edu.cn/apache/zookeeper/)
- [Getting Started](http://zookeeper.apache.org/doc/r3.4.10/zookeeperStarted.html)

## zookeeper简单使用

1. 下载zookeeper，例如：[zookeeper-3.4.10](http://mirrors.hust.edu.cn/apache/zookeeper/zookeeper-3.4.10/)

2. 解压zookeeper-3.4.10.tar.gz，并进入解压后的目录(以下用{zookeeper}代替解压后的目录)

3. 新建一个配置文件{zookeeper}/__conf/zoo.cfg__

4. 使用standalone mode配置

   ```properties
   #毫秒，心跳间隔
   tickTime=2000
   #内存数据库（存储更新的事务）快照存储目录
   dataDir=/var/lib/zookeeper
   #客户端的连接端口
   clientPort=2181
   ```

5. 启动zookeeper

   ```shell
   bin/zkServer.sh start
   ```

6. 连接zookeeper

   ```shell
   bin/zkCli.sh -server 127.0.0.1:2181
   ```

   进入zookeeper client，输入help可以获得client命令列表

7. 使用create命令创建一个znode节点

   ```shell
   # 创建一个znode节点来关联这个节点与数据(字符串"my_data")
   create /zk_test my_data
   # 使用get命令验证创建的这个znode节点
   get /zk_test
   # 使用set命令改变这个节点关联的数据
   set /zk_test junk
   # 使用delete命令删除这个节点
   delete /zk_test
   # 使用quit命令退出zookeeper client
   ```

## zookeeper集群

生产环境中我们需要使用Replicated Mode来配置一个zookeeper集群。在一个应用中，重复的服务组叫做一个`quorum` ，在Relicated mode中，一个quorum中的所有的服务拥有同样的配置

> Note.
>
> 既然是集群，那服务节点起码大于2。为了满足选举Leader的需要，集群中则至少需要有三个服务节点。因为如果只有两个，在其中一个挂掉的情况下，就没有足够的服务节点去使用majority quorum机制来选举Leader

集群配置文件

```properties
tickTime=2000
dataDir=/var/lib/zookeeper
clientPort=2181
# 初始化时，在一次zookeeper quorum的服务节点初始化的过程中，连接Leader的次数
initLimit=5
# 限制了一个节点距离Leader的间隔
syncLimit=2
server.1=zoo1:2888:3888
server.2=zoo2:2888:3888
server.3=zoo3:2888:3888
```

## zookeeper编程

- [Programmer's Guide](http://zookeeper.apache.org/doc/r3.4.10/zookeeperProgrammers.html)
- [Programming Examples in the ZooKeeper Programmer's Guide](http://zookeeper.apache.org/doc/r3.4.10/zookeeperProgrammers.html#ch_programStructureWithExample)