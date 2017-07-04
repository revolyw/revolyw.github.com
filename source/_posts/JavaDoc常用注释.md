---
title: JavaDoc
categories: technology
tags: [java,JavaDoc,奇淫巧技,代码规范]
date: 2017-05-28 12:53:12
---

## JavaDoc常用注释

- @author         指定Java程序的作者
- @version        指定源文件版本
- @parameter  参数名及其意义
- @return         返回值
- @throws        异常类及抛出条件
- @deprecated     引起不推荐使用的警告（标识一个方法已经不推荐使用了）
- @see             超链 e.g. [http://google.com](http://google.com)
- @since          表示从那个版本起开始有了这个函数 
- @note           表示注解，暴露给源码阅读者的文档 
- {@value}       当对常量进行注释时，如果想将其值包含在文档中，则通过该标签来引用常量的值。
- {@link 包.类#成员} 链接到某个特定的成员对应的文档中。

## Intellj IDEA中生成JavaDocs

选择Tools->generate JavaDocs

注意一点，在Other command line arguments输入-encoding utf-8 -charset utf-8，这样可以保证中文的正常输出。