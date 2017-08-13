---
title: jenkins ci 环境搭建
categories: technology
tags: [持续集成,CI,jenkins]
date: 2017-08-13 21:56:47
---

jenkins是一个持续集成工具，其使用java编写的web程序，使用时[下载war包](https://jenkins.io/index.html)部署即可

### 名词解释(Terminology)

`CI` __continuous integration__ 持续集成

`SCM` __source code management__ 源码管理

### 下载安装jenkins

#### 重启web服务器

远程调用重启脚本

```
ssh {user}@{ip} {path}/{restart_script_name}.sh
```

重启后，访问{host}:{port}/jenkins可以看到如下图的页面，然后打开远端的/root/.jenkins/secrets/initialAdminPassword文件可以获得管理员密码，输入后可以解锁Jenkins，开始使用。

![](http://img.willowspace.cn/willowspace_2016/1487009258517.png)

## 安装插件

要使用Jenkins，我们一般会安装一些插件。

![](http://img.willowspace.cn/willowspace_2016/1487009586270.png)

推荐的插件如下图所示

![](http://img.willowspace.cn/willowspace_2016/1495456636599.png)



1. Github plugin

This plugin integrates Jenkins with [Github](http://github.com/) projects.

1. Role-based Authorization Strategy

   基于角色的的用户权限控制


1. Gitlab Plugin

2. ssh plugin

3. Post-Build Script Plug-in

   脚本插件


1. Pipeline

   [pipeline构建](https://jenkins.io/solutions/pipeline/)

2. Pipeline: Stage View Plugin

   pipeline构建过程可视化

3. pipeline plugin

   [参考](https://my.oschina.net/ghm7753/blog/371954?p=1)

## 配置

### Jenkins内部shell UTF-8 编码设置

![](http://img.willowspace.cn/willowspace_2016/1487125834004.png)

### 参数化构建

![](http://img.willowspace.cn/willowspace_2016/1487126266497.png)

### 构建脚本

在`构建`中选择Execute shell script on remote host using ssh，可在构建前后执行脚本



## 使用场景

### Trigger Jenkins builds by pushing to Github

### 拉取git代码并构建

https://www.fourkitchens.com/blog/article/trigger-jenkins-builds-pushing-github

1. 在jenkins所在服务器上生成ssh key
2. 在gitlab的Deploy Key中添加public key
3. 在jenkins创建项目，添加gitlab的项目地址，选择添加Credential，填入private key

```groovy
node {
    stage('checkout') {
        checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '{git_credentialsId}', url: '{git_url}']]])
    }
    stage('build') {
        sh 'mvn clean package'
    }
    stage('send war to server') {
      sh 'scp {user_root_path}/.jenkins/workspace/{you_project_name}/target/{you_project_packaged_name}.war {user}@{server_ip}:{tomcat_path}/webapps/javavirtual.war'
    }
    stage('restart tomcat server'){
        sh 'echo "wait restart shell"'
    }
}
```

## FAQ

### 容器的编码问题

> Your container doesn't use UTF-8 to decode URLs. If you use non-ASCII characters as a job name etc, this will cause problems. See [Containers](http://wiki.jenkins-ci.org/display/JENKINS/Containers) and [Tomcat i18n](http://wiki.jenkins-ci.org/display/JENKINS/Tomcat#Tomcat-i18n) for more details.