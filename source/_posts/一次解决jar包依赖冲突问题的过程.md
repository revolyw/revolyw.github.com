---
title: 一次解决jar包依赖冲突问题的过程
categories: technology
tags: [java,debug,gradle,依赖冲突,maven]
date: 2017-08-18 19:01:58
---

# 案发背景

同事最近在对项目的hibernate框架进行升级，从`3.6.10.Final`升级至`5.2.10.Final`。升级期间出现了配置文件(xml)解析报错。主要报错堆栈如下

```verilog
19:07:41 ERROR - Context initialization failed x org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'serviceManager' defined in class path resource [spring/applicationContext.xml]: Cannot resolve reference to bean 'xService' while setting bean property 'xSerivce'; nested exception is org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'xService' defined in class path resource [spring/dao.xml]: Cannot resolve reference to bean 'transactionManager' while setting bean property 'transactionManager'; nested exception is org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'transactionManager' defined in class path resource [spring/dataSource-common.xml]: Cannot resolve reference to bean 'sessionFactory' while setting bean property 'sessionFactory'; nested exception is org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'sessionFactory' defined in class path resource [spring/dataSource-common.xml]: Invocation of init method failed; nested exception is
 

java.lang.NoSuchMethodError:org.apache.xerces.impl.xs.XMLSchemaLoader.loadGrammar([Lorg/apache/xerces/xni/parser/XMLInputSource;)V
```

# 寻找线索

可以看到最后的`java.lang.NoSuchMethodError:org.apache.xerces.impl.xs.XMLSchemaLoader.loadGrammar([Lorg/apache/xerces/xni/parser/XMLInputSource;)V`说明`XMLSchemaLoader`类的`loadGrammar`方法没有找到，这个方法的特征(L)是有一个数组`XMLInputSource`类型的数组参数。

# 寻找第一案发现场

顺着这个线索我们来看下找一下这个方法。

搜索源文件发现有两个jar包(见下图)都包含`XMLSchemaLoader#loadGrammar`![](http://img.willowspace.cn/willowspace_2016/1503061978595.png)

两者的`XMLSchemaLoader`类都有`loadGrammar`方法。__重点来了__，不同的是前者没有参数为`XMLInputSource`数组的`loadGrammar`方法，而后者有。这与报错堆栈完全吻合，可见这就是第一案发现场。

# 寻找真凶

有了上面的线索，很自然想要去[maven仓库](http://mvnrepository.com/)中看看是不是`xerces`包太老需要升级，搜索`xerces`后发现的确有问题，`xerces`已经建议使用`xercesImpl`替换了，看来真凶就是这个`xerces`包。

![](http://img.willowspace.cn/willowspace_2016/1503062212136.png)

于是回到项目中去掉`xerces:2.4.0`的依赖，重启启动项目，依旧报错。

这时考虑是不是有其他jar包也存在对该包的引用，去生成的依赖库中一看，果然，`xerces`的依赖版本从`2.4.0`变为了`2.0.2`依然存在于依赖之中

![](http://img.willowspace.cn/willowspace_2016/1503062472355.png)

这时基本可以断定就是其他包依赖了`xerces`，于是使用`gradle`的命令查看jar包依赖关系

```shell
# 查看gradle依赖关系
gradle dependencies
```

![](http://img.willowspace.cn/willowspace_2016/1503062716227.png)

![](http://img.willowspace.cn/willowspace_2016/1503063619467.png)

从依赖关系从看到`commons-dbcp:1.2.1``commons-pool:1.2`这两个包依赖了`xerces:xerces:2.0.2`包，导致依旧引入了`xerces`依赖。去除`commons-dbcp:1.2.1`并升级`commons-pool:1.2`至`commons-pool:1.6`后刷新，`xerces`包依赖完全被去除。重启项目，一切顺畅，问题得以解决。

# 结案

这次问题的本质就是jar包冲突，只不过冲突的jar包依赖关系藏得较为隐蔽。

解决的手段其实较为简单，就是调和冲突的jar包（删除、升级、替换等）。

> 注意

上面我们为了解决jar包冲突直接删除了`commons-dbcp`依赖，这是因为我的项目已经不需要用到这个包了，但如果这个依赖包不能删除，如何单独删除其中冲突的jar包依赖呢？

这里提供一种`gradle`具体的调和手段

可以使用`exclude`去除jar包对第三方jar包的依赖，从而达到解决冲突的目的，具体写法如下。

```groovy
dependencies {
	compile('commons-dbcp:commons-dbcp:1.2.1') {
    	exclude module: 'xerces'
	}
}
```

