---
title: Java Method Breakpoints are evil
categories: technology
tags: [java,JPDA,JVM,IDE,debug]
date: 2017-08-20 04:53:02
---

# 问题以及解决方案

今天使用Intellj IDEA部署web项目时，spring web容器上下文(ContextLoader)加载非常慢，慢到完全启动一个项目需要耗时20分钟左右。

打开debug日志发现不停的加载注入的各种类，并且还有打印类中方法的详细信息。

最终定位问题是因为打开了`Java Method Breakpoints`（如下图），将其取消即可快速启动项目。![img](http://img.willowspace.cn/willowspace_2016/1503176081426.png?imageMogr2/thumbnail/400)

# 探究原因

Google上找到同样的[JAVA METHOD BREAKPOINTS ARE EVIL](https://blogs.sourceallies.com/2013/04/java-method-breakpoints-are-evil/)（借用了这篇文章的标题，因为这个标题太符合`Java Method Breakpoints`了，就是邪恶），从其中找到了jetbrains team在jetbrains官网上给出的针对这个问题的回应参考[原链接](https://intellij-support.jetbrains.com/hc/en-us/articles/206544799-Java-slow-performance-or-hangups-when-starting-debugger-and-stepping) (链接加载略慢)

然后继续查了几个搜索结果发现各大IDE厂商的bug list里都有报类似问题，参考[NetBeans Bug](https://bugs.eclipse.org/bugs/show_bug.cgi?id=20869)、[Eclipse Bug](https://bugs.eclipse.org/bugs/show_bug.cgi?id=20869)

他们基本都说明了一点：这个问题的产生和**JVM的设计**有关系。

具体是指的JVM规定了虚拟机必须支持一组标准的调试API，这组标准的调试API指的是[JPDA](http://docs.oracle.com/javase/7/docs/technotes/guides/jpda/) (Java Platform Debugger Architecture)，JDPA是一组精心设计的接口与协议，所有的IDE基于JPDA进行封装，提供友好的用户调试接口。

当你设置断点时，IDE告诉*JVM's Tool Interface*（JDPA的一部分）断点所属的源文件和行号，JVM找到这个断点在源文件中位置对应的编译后class文件中的位置，当JVM运行到一个断点，它将会中断当前执行的线程并且告诉IDE这个断点的源文件和行号，然后由IDE呈现定位给用户。

这是基本的行断点调试的机制，而`Java Method Breakpoints`是方法断点调试，它的机制与行断点调试略有不同，它将给方法注册进入/退出事件，需要用到`MethodEntryRequest`这个类来进行注册。

然后我在JAVA官方找到了关于[JPDA性能问题的BUG清单](http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6176614)，其中有如下这样一段描述涉及到了`MethodEntryRequest`及其带来的性能问题

*MethodEntryRequest and MethodExitRequest unreasonably slow down whole*
*performance. We use them to track calls to method in a particular class*
*or to any overriding methods. But it seems the performance slows down*
*for any method calls, not even to that particular class.*

大致的意思就是说当用`MethodEntryRequest`来追踪方法调用时(可以理解为方法断点调试)，它将会让任何方法的调用性能都下降，而不只是特定的类(打了方法断点的那个类)。

找到这里基本上明了了，因为我打了一个方法断点没有放开，spring web context在进行依赖注入时构造各种各样的类需要调用大量的方法(构造方法、静态方法、解析方法等等)，每个方法的调用性能都下降了，所以整个项目加载起来自然就非常慢了。