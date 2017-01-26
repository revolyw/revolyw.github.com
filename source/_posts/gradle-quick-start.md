---
title: gradle_quick_start
categories: technology
tags: [java,gradle,maven]
date: 2017-01-25 14:15:09
---

本文介绍使用Gradle快速构建Java项目

由于博主使用的是Intellj IDEA，所以如果你对Intellj IDEA的项目结构不熟悉，那你可能需要先了解一下Intellj IDEA的项目结构：一个project（区别eclipse中的project）+ 多个modules，以下图为例，spring-boot-rmi是项目，greenqiang,laowang,oldwang,xiaoming是4个module

![](http://img.willowspace.cn/willowspace_2016/1485234708330.png)

## Gradle准备

- 安装jdk或者jre，且版本至少是6以上
- 从[官网](https://gradle.org/)安装gradle

## 配置文件与构建脚本

使用gradle构建项目，项目根目录下会有build.gradle和settings.gradle两个文件(如上图)

__settings.gradle__ 配置文件

```groovy
//多项目（或多modules）管理
//rootProject.name = "spring-boot-rmi" //根项目
include "old-wang", "green-qiang"
```

__build.gradle__ 构建脚本

- 根目录下的构建脚本 /build.gradle

```groovy
//项目基本信息
group 'cn.willowspace'
version '1.0-SNAPSHOT'

//allprojects or subprojects
allprojects {
  	//应用插件
    apply plugin: 'java'
	//指定编译级别
    sourceCompatibility = 1.8
    targetCompatibility = 1.8
	//指定依赖仓库
    repositories {
        mavenLocal()
        mavenCentral()
        maven {
            url 'http://repo.spring.io/libs-milestone/'
        }
    }
	//依赖管理
    dependencies {
        //spring-boot-starter-parent
        compile group: 'org.springframework.boot', name: 'spring-boot', version: '1.2.8.RELEASE'
        compile group: 'org.springframework.boot', name: 'spring-boot-starter-web', version: '1.2.8.RELEASE'
    }
}
```

- old-wang子项目的构建脚本 old-wang/build.gradle

```groovy
//指定项目的源码及资源文件路径
sourceSets {
    main {
        java {
            srcDir 'old-wang/src/main/java'
        }
        resources {
            srcDir 'old-wang/src/main/resources'
        }
    }
}
```

- green-qiang子项目的构建脚本 green-qiang/build.gradle

```groovy
//指定项目的源码及资源文件路径
sourceSets {
    main {
        java {
            srcDir 'green-qiang/src/main/java'
        }
        resources {
            srcDir 'green-qiang/src/main/resources'
        }
    }
}
```

通过settings.gradle及build.gradle两类文件，我们就可以建立起项目之间的依赖及第三方依赖，一个java项目的基本构建就完成了。

更多gradle相关的用法，参考[Gradle User Guide 中文版](https://www.gitbook.com/book/dongchuan/gradle-user-guide-/details)