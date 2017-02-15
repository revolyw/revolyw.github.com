---
title: Spring IoC容器与Bean注入
categories: technology
tags: [java,spring,设计模式,编程思想]
date: 2017-02-15 17:12:23
---

为了重构web项目中注入众多的Bean，我们有必要搞清楚__Spring IoC容器、被注入Bean的作用域__以及__如何注入Bean__的问题

## Spring IoC容器

根据[官方文档的说法](http://static.springsource.org/spring/docs/3.2.x/spring-framework-reference/html/beans.html#beans-basics)，

> `org.springframework.beans`和`org.sprinframework.context`包是Spring框架的基础IoC容器。`BeanFactory`接口提供了高级的配置机制来管理任意对象。`ApplicationContext`是`BeanFactory`的一个子接口,它增加了更易于集成的Spring AOP特性；消息资源处理(用于国际化),事件发布以及特定的应用层上下文，例如,用于Web应用的`WebApplicationContext`

Spring IoC容器其实就是一个应用程序的上下文

在Spring Web应用中， 我们常用到两种IoC容器，它们以不同的配置初始化。一个是`Application Context`，另一个是`Web Application Context`

###  ApplicationContext

> 接口`org.springframework.context.ApplicationContext`提供了一个Spring IoC容器，它代表了beans可靠的实例化、配置化以及组件化。 容器通过读取配置元数据（xml或annotation或Java Code）来实例化、配置或组装对象。
>
> `Application Context`这个容器，由定义在web.xml中的`ContextLoaderListener`或`ContextLoaderServlet`初始化，其配置一般如下
>
> ```xml
> <listener>
>      <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
> </listener>
>
> <context-param>
>      <param-name>contextConfigLocation</param-name>
>      <param-value>classpath:*-context.xml</param-value>
> </context-param>
> ```
>
> 上面的配置中，我们让spring去加载所有classpath中的-context.xml结尾的文件并且用它们创建了一个应用程序上下文.   这些文件常常包含的是一些在应用中将被用到的中间层事务服务、数据访问或其它对象。基于这个配置，对于每个应用都会有这样一个应用程序上下文。

### WebApplicationContext

> 在Spring MVC框架中，每个`DispatcherServlet`有它自己的`WebApplicationContext`，它继承了所有已经定义在根WebApplicationContext中的beans。那些继承的beans可以在具体的servlet作用域中被重载，而且在这个Servlet实例中你可以定义一些有特定作用域的beans
>
> `WebApplicationContext`是一个应用程序上下文的子上下文。每个在Spring Web应用中定义的`DispatcherServlet`都有一个关联的`WebApplicationContext`,其一般配置如下
>
> ```xml
> <servlet>
>       <servlet-name>platform-services</servlet-name>
>       <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
>       <init-param>
>             <param-name>contextConfigLocation</param-name>
>             <param-value>classpath:platform-services-servlet.xml</param-value>
>       </init-param>
>       <load-on-startup>1</load-on-startup>
> </servlet>
> ```
>
> 你需要提供spring配置文件(xml)的名字作为servlet的初始化参数。值得注意的是，这个xml的名字必须是`*-servlet.xml`的格式。拿上面的配置为例来说，servlet的名字为platform-services，因此xml的名字必须为platform-service-servlet.xml。不论`ApplicationContext`中定义的beans是否可用，它们都将被每个`WebApplicationContext`所引用。最佳实践是，保持一个清晰的分层，中间层服务作为业务逻辑组件，而数据访问层（通畅定义在`ApplicationContext`）和web相关组件作为控制器和视图解析器（通常定义在每个Dispatcher Servlet的`WebApplicationContext`中）。

## 被注入Bean的作用域

Spring中使用scope属性来声明bean的作用域

```xml
<bean class="com.company.class" scope="singleton" />
```

scope取值如下

| **作用域**        | **描述**                                   |
| -------------- | ---------------------------------------- |
| singleton      | 在每个Spring IoC容器中一个bean定义对应一个对象实例,即单例。如果没有显示声明scope属性，则默认scope为singleton。 |
| prototype      | 一个bean定义对应多个对象实例。                        |
| request        | 在一次HTTP请求中，一个bean定义对应一个实例；即每次HTTP请求将会有各自的bean实例， 它们依据某个bean定义创建而成。该作用域仅在基于web的Spring ApplicationContext情形下有效。 |
| session        | 在一个HTTP Session中，一个bean定义对应一个实例。该作用域仅在基于web的Spring ApplicationContext情形下有效。 |
| global session | 在一个全局的HTTP Session中，一个bean定义对应一个实例。典型情况下，仅在使用portlet context的时候有效。该作用域仅在基于web的Spring ApplicationContext情形下有效。 |

## 集中注入

对于1控制层、2中间业务层、3数据访问层对象。往往是3注入2，2注入1，如果系统或业务庞杂，那么注入配置会很臃肿，注入关系不清晰，如果你的不是按3->2->1这样注入，那可能情况会更糟糕。

![](http://img.willowspace.cn/confused_injection.png)

控制层、中间业务层、数据访问层的对象往往都是以singleton的形式存在于我们的系统，基于这一点，我们可以对一个类注入同一层中所有的对象，这个类本身再以__singleton__初始化到IoC容器中，哪里需要则注入就可以了。

![](http://img.willowspace.cn/simple_injection.png)

这里只有典型的三层的对象， 如果有更复杂的分层分块对象需要注入，则更需要集中管理注入。