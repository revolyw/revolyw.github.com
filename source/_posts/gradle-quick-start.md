---
title: gradle_quick_start
categories: technology
tags: [java,gradle,maven]
date: 2017-01-25 14:15:09
---

本文介绍使用Gradle快速构建Java项目

由于博主使用的是Intellj IDEA，所以如果你对Intellj IDEA的项目结构不熟悉，那你可能需要先了解一下Intellj IDEA的项目结构：一个project（区别eclipse中的project）+ 多个modules，以下图为例，spring-boot-rmi是项目，greenqiang,laowang,oldwang,xiaoming是4个module

![](http://img.willowspace.cn/willowspace_2016/1485234708330.png)

## 配置文件与构建脚本

使用gradle构建项目，项目根目录下会有build.gradle和settings.gradle两个文件(如上图)

__settings.gradle__ 配置文件

```groovy
//多项目（或多modules）管理
rootProject.name = 'spring-boot-rmi' // 项目名
include('oldwang','greenqiang','laowang','xiaoming') //包含子项目(modules)
```

__build.gradle__ 构建脚本

```groovy
//项目基本信息
project 'spring-boot-rmi'
group 'cn.willowspace'
version '1.0-SNAPSHOT'

//应用插件
apply plugin: 'java'
apply plugin: 'idea'
apply plugin: 'maven'

//指定编译级别
sourceCompatibility = 1.8
targetCompatibility = 1.8

//指定源码及资源文件目录
sourceSets {
    main{
        java {
            srcDir 'oldwang/src/main/java'
            srcDir 'greenqiang/src/main/java'
        }
        resources{
            srcDir 'oldwang/src/main/resources'
            srcDir 'greenqiang/src/main/resources'
        }
    }
}

//指定maven仓库位置
repositories {
    mavenCentral()
    maven {
        url 'http://repo.spring.io/libs-milestone/'
    }
}

//依赖管理
dependencies {
  	//jar依赖
    compile group: 'org.springframework.boot', name: 'spring-boot', version: '1.2.8.RELEASE'
    compile group: 'org.springframework.boot', name: 'spring-boot-starter-web', version: '1.2.8.RELEASE'
}
```

有了上述两个文件，我们项目之间的依赖以及第三方依赖就都可以通过gradle建立起来。