---
title: jenkins ci 环境搭建
categories: technology
tags: [持续集成,CI,jenkins]
date: 2017-08-13 21:56:47
---

> 简介

jenkins是一个持续集成(CI)工具，使用java编写

`CI` __continuous integration__ 持续集成

`SCM` __source code management__ 源码管理

# 下载jenkins

有多种安装方式，我们选择war包部署，war包下载地址 https://jenkins.io/download/

下载的war包为`jenkins.war`

# 部署至tomcat

这里采用一台单独的tomcat部署jenkins

```shell
# 因为此tomcat只用来部署jenkins，所以先删除webapps下其他应用
rm -rf ${tomcat_path}/webapps/*
# 部署jenkins的war包
mv ${download_path}/jenkins.war ${tomcat_path}/webapps/ROOT.war
# 查看jenkins的war包部署启动过程的日志
tail -f ${tomcat_path}/logs/catalina.out
```

# 配置jenkins

tomcat部署启动完jenkins后，访问对应端口可以看到如下jenkins的初始界面

![](http://img.willowspace.cn/willowspace_2016/1487009258517.png)

查看`/root/.jenkins/secrets/initialAdminPassword`文件可以获得管理员密码，输入后可以解锁Jenkins，开始使用。

## 安装插件

初始化界面会提示我们安装插件，我们选择推荐插件

![](http://img.willowspace.cn/willowspace_2016/1487009586270.png)

推荐的插件如下图所示

![](http://img.willowspace.cn/willowspace_2016/1504010997582.png)

我们主要需要`身份认证` `源码管理` `打包构建` `管道命令` 几个方面的插件

### 身份认证

`ssh plugin` `SSH Slaves plugin` `Credentials Binding Plugin` 

### 源码管理

`git plugin` `github plugin` `GitHub Branch Source Plugin` `gitlab plugin` `subversion Plug-in` 

### 打包构建

`Gradle Plugin`

### 管道命令

`Pipeline`   `Pipeline:State View Plugin`

[pipeline构建参考](https://my.oschina.net/ghm7753/blog/371954?p=1)

### 其它插件

#### Role-based Authorization Strategy

基于角色的的用户权限控制

## Jenkins内部shell UTF-8 编码设置

![](http://img.willowspace.cn/willowspace_2016/1487125834004.png)

## 参数化构建

![](http://img.willowspace.cn/willowspace_2016/1487126266497.png)

### Pipeline构建

创建一个新任务，任务类型选择pipeline

#### 拉取源码

勾选`GitHub hook trigger for GITScm polling` 参考[Trigger Jenkins builds by pushing to Github](https://www.fourkitchens.com/blog/article/trigger-jenkins-builds-pushing-github)

1. 在jenkins所在服务器上生成ssh key
2. 在gitlab的Deploy Key中添加public key
3. 在jenkins创建项目，添加gitlab的项目地址，选择添加Credential，填入private key

#### 编写构建打包部署的pipeline脚本

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