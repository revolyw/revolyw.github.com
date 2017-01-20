---
title: ELK
categories: technology
tags: [ops,java]
date: 2017-01-20 15:18:45
---

# logstash

日志过滤器

## 基本使用

```shell
# -e 即 execute
logstash -e '' # <==> logstash -e 'input{stdin{}}output{stdout{}}'

# --config 或 -f 即文件。 解决配置太长问题，将配置写入文件，从文件读配置
logstash -f agent.conf、

  # 自动读取 /etc/logstash.d/ 目录下所有 *.conf 的文本文件作为配置运行 慎用
  logstash -f /etc/logstash.d/

# --configtest 或 -t 即测试。 测试 Logstash 读取到的配置文件语法是否能正常解析

# --log 或 -l 即日志
logstash -l $LS_HOME/logs/logstash.log

# --pluginpath 或 -P 即插件。 可自定义插件，然后如下加载它们
logstash --pluginpath /path/to/own/plugins

# --verbose 适量调试日志

# --debug 更多的调试日志

# logstash5.0 使用yaml文件配置
$LS_HOME/config/logstash.yml
pipeline:
    workers: 24
    batch:
        size: 125
        delay: 5
```

## plugin使用

 logstash 1.5.0 版本开始，可以使用logstash-plugin来执行插件相关操作

```shell
# 插件位置
$LS_HOME/vendor/bundle/jruby/1.9/gems/

# 查看
logstash-plugin list

# 安装
logstash-plugin install /path/to/logstash-filter-crash.gem

# 升级
logstash-plugin update logstash-input-tcp
```

## 长期运行

[参考](http://kibana.logstash.es/content/logstash/get-start/daemon.html)



# elasticsearch

搜索引擎，底层是Lucene

# kibana

可视化日志分析器