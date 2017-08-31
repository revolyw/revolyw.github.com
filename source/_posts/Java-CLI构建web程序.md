---
title: Java-CLI构建web程序
categories: technology
tags: [java,build,package,java web]
date: 2017-08-31 00:18:43
---

本文将介绍如何使用Java原生命令打包构建一个java web项目。

虽说现在有ant、maven、gradle等打包构建工具，可以很方便的完成打包构建目标，但是不妨看看他们是如何封装jdk命令完成打包构建的。

另一方面，古老的项目，没有使用高级的打包构建工具也没有IDE的情况下，也只能自己通过脚本来完成原生的打包任务了。

再者，java9来了，jdk更新了许多新的命令，重新回忆下传统命令也是好的。![](http://img.willowspace.cn/willowspace_2016/1504185367239.png)

# 一、项目结构

```shell
project
├── README.md
├── lib #jar包目录
│   ├── a.jar
│   └── *.jar
├── src #源码目录
│   ├── package1
│   └── package*
└── web #web资源目录
    ├── WEB-INF
    │   └── web.xml
    ├── js
    ├── css    
    └── index.html
```

# 二、编译源文件 

```shell
cd project
# 创建out目录，out目录下创建classes目录
# out存放所有需要被打进war包的文件；out/classes存放所有编译好的字节码文件
mkdir -p out/classes
# 开始编译源文件
javac -cp "./lib/*" -d ./out/classes -encoding UTF8 $(find ./src -name "*.java")
```

javac为源文件的编译命令,其使用格式为：`javac <options> <source files>`

-cp参数全拼是-classpath，可以指定源文件依赖的jar包或字节码文件

-d参数可以指定字节码文件的输出目录

`$(find ./src -name "*.java")` 指定的是待编译的源文件，这里使用了系统的find命令来进行通配src目录下的所有java文件

> 更多javac命令细节参考[java8 javac docs](http://docs.oracle.com/javase/8/docs/technotes/tools/windows/javac.html)

# 三、按J2EE规范组织资源

[J2EE规范](https://docs.oracle.com/cd/E13222_01/wls/docs90/webapp/configurewebapp.html)规定了web资源文件、jar包文件、字节码文件等的组织结构如下，这也是最终war内部的目录结构

```shell
project/out
├── WEB-INF
│   ├── classes
│   ├── lib
│   └── web.xml
├── js
├── css    
└── index.html
```

开始按这个结构调整目录

```shell
cd project
# 复制web资源目录、jar包目录至out目录
cp -r lib web/* out/
# 将字节码文件和jar包文件复制至WEB-INF目录下
cd out
mv lib classes WEB-INF/
```

# 四、打war包

```shell
cd project/out
# 打war包
jar cvf ./project.war ./*
```

> 更多jar命令细节，参考[java8 jar docs](http://docs.oracle.com/javase/8/docs/technotes/tools/windows/jar.html)

# 五、FAQ

## 字节码文件目录中的文件找不到

### 原因

war包部署到web服务器启动时报文件(字节码文件目录中)找不到，这常常是由于源码目录中存放了非java文件，而我们上面说的步骤只是对源码目录进行了编译，没有处理这些非java文件，而这些文件确实被依赖，所以项目自然无法启动。

### 场景

举个实际场景如:使用mybatis时常会把ORM映射关系文件(xml)放在源码目录，如果不将映射文件移动到打包目录，打出来的war包就无法正常部署。

```shell
project/src
├── package1
│   ├── mapping1.xml
│   └── mapping*.xml   
└── package*
    └── *.java
```

### 解决方案

将非java文件从源码目录移至WEB-INF/classes对应位置即可

```shell
mv project/src/package1/* project/out/WEB-INF/classes/package1/
#移动后的结构
project
├── src #源码目录
│   ├── package1
│   |	├── mapping1.xml
│   |	└── mapping*.xml 
│   └── package*
│   	└── *.java
└── out #打包目录
    ├── package1
    |	├── mapping1.xml
    |	└── mapping*.xml 
    └── package*
    	└── *.class	
```

