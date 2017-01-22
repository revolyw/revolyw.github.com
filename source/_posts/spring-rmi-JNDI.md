---
title: spring-rmi & JNDI
categories: technology
tags: [java,spring]
date: 2017-01-21 14:35:40
---

我们来实现一个小目标：起两个spring-boot（项目中体现为两个module，分别为oldwang和greenqiang，下面简称为老王老王可以调用绿强中的方法来获取绿强的信息。

为了达成上述目标，本文将描述两个方面的内容

1. 使用spring-rmi构建远程服务调用
2. 使用JNDI来保证服务调用双方的正常运行

## spring-rmi

### 1. Exposing services using RMI

#### 1.1 Exporting the service using the RmiServiceExporter



瞎鸡巴做了一通之后发现，要保持一个原则：在application.xml中只配置rmi远程调用的接口和接口实现，本地的接口和接口实现全部本地注入，不要写入application.xml中