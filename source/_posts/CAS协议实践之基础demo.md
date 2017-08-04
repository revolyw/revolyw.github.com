---
title: CAS协议实践之基础demo
categories: technology
tags: [java,sso,cas,架构]
date: 2017-08-04 12:00:03
---

>  资源下载

[CAS server](http://developer.jasig.org/cas/)

[CAS client](http://developer.jasig.org/cas-clients/)

## 一、CAS server

### 1. 生成证书

生成一个别名为castest的证书。

此处需要特别注意口令（后续导入导出证书、CAS服务器端均要用到此口令）和“名字与姓氏”（为CAS跳转域名，否则会报错）

```shell
keytool -genkey -alias castest -keyalg RSA -keystore {certificate_path}/{certificate_name}
```

![](http://img.willowspace.cn/willowspace_2016/1491722131911.png)

### 2. 导出证书

```shell
keytool -export -file {certificate_path}/{certificate_name}.crt -alias castest -keystore {certificate_path}/{certificate_name}
```

![](http://img.willowspace.cn/willowspace_2016/1491722611795.png)

### 3. 安装证书

将证书导入到客户端JRE中（注意、是导入JRE中），如果security中已经存在cacerts，需要先将其删除。

```shell
keytool -import -keystore "{jdk_path}\jre\lib\security\cacerts" -file {certificate_path}/cas-test.crt -alias cas-test
```

![](http://img.willowspace.cn/willowspace_2016/1491724570498.png)

### 4. 配置tomcat

修改%TOMCAT_HOME%/conf/server.xml文件，支持https证书访问

```xml
<Connector SSLEnabled="true" clientAuth="false" keystoreFile="{certificate_path}/{certificate_name}" 
keystorePass="{certificate_password}"
maxThreads="150" port="8443" protocol="org.apache.coyote.http11.Http11Protocol" scheme="https" secure="true" sslProtocol="TLS"/>
```

![](http://img.willowspace.cn/willowspace_2016/1491725915837.png)

### 5. 测试证书

访问https://localhost:8443/，成功则说明配置证书成功

### 6. 部署CAS server

从http://developer.jasig.org/cas/上下载cas服务器端cas-server-4.0.0-release.zip，在modules目录下找到cas-server-webapp-4.0.0.war，将其复制到%TOMCAT_HOME%\webapps下，并将名称改为cas.war

### 7. 测试CAS server

输入账号和密码

- casuser
- Mellon

![](http://img.willowspace.cn/willowspace_2016/1491727396249.png)

登录成功则说明CAS server配置成功，可通过https://localhost:8443/logout退出登录

## 二、CAS client

### 1. 添加证书映射域名

```properties
127.0.0.1 sso.cas.com
```

### 2. 创建CAS client项目

配置web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app>
    <display-name>Archetype Created Web Application</display-name>

    <!-- 用于单点退出，该过滤器用于实现单点登出功能，可选配置-->
    <listener>
        <listener-class>org.jasig.cas.client.session.SingleSignOutHttpSessionListener</listener-class>
    </listener>
    <!-- 该过滤器用于实现单点登出功能，可选配置。 -->
    <filter>
        <filter-name>CAS Single Sign Out Filter</filter-name>
        <filter-class>org.jasig.cas.client.session.SingleSignOutFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>CAS Single Sign Out Filter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <!-- 该过滤器负责用户的认证工作，必须启用它 -->
    <filter>
        <filter-name>CASFilter</filter-name>
        <filter-class>org.jasig.cas.client.authentication.AuthenticationFilter</filter-class>
        <init-param>
            <param-name>casServerLoginUrl</param-name>
            <param-value>https://sso.cas.com:8443/cas-server-webapp-4.0.0/login</param-value>
            <!--这里的server是服务端的IP-->
        </init-param>
        <init-param>
            <param-name>serverName</param-name>
            <param-value>http://localhost:8081</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>CASFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <!-- 该过滤器负责对Ticket的校验工作，必须启用它 -->
    <filter>
        <filter-name>CAS Validation Filter</filter-name>
        <filter-class>
            org.jasig.cas.client.validation.Cas20ProxyReceivingTicketValidationFilter
        </filter-class>
        <init-param>
            <param-name>casServerUrlPrefix</param-name>
            <param-value>https://sso.cas.com:8443/cas-server-webapp-4.0.0/
            </param-value><!-- 此处必须为登录url/cas/，带有任何其它路径都会报错，如“https://sso.castest.com:8443/cas/login”,这样也会报错。 -->
        </init-param>
        <init-param>
            <param-name>serverName</param-name>
            <param-value>http://localhost:8081</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>CAS Validation Filter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <!--
            该过滤器负责实现HttpServletRequest请求的包裹，
            比如允许开发者通过HttpServletRequest的getRemoteUser()方法获得SSO登录用户的登录名，可选配置。
    -->
    <filter>
        <filter-name>CAS HttpServletRequest Wrapper Filter</filter-name>
        <filter-class>
            org.jasig.cas.client.util.HttpServletRequestWrapperFilter
        </filter-class>
    </filter>
    <filter-mapping>
        <filter-name>CAS HttpServletRequest Wrapper Filter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <!--
            该过滤器使得开发者可以通过org.jasig.cas.client.util.AssertionHolder来获取用户的登录名。
            比如AssertionHolder.getAssertion().getPrincipal().getName()。
    -->
    <filter>
        <filter-name>CAS Assertion Thread Local Filter</filter-name>
        <filter-class>org.jasig.cas.client.util.AssertionThreadLocalFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>CAS Assertion Thread Local Filter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <!-- session超时定义,单位为分钟 -->
    <session-config>
        <session-timeout>2</session-timeout>
    </session-config>
</web-app>
```

### 2. 导入CAS client核心jar包

从http://developer.jasig.org/cas-clients/上下载cas-client-3.1.12-release.zip，在modules目录下找到cas-client-core-3.1.12.jar、commons-collections-3.2.jar、commons-logging-1.1.jar复制到项目WEB-INF/lib下

### 3. 测试CAS client

配置好web容器后，启动cas client，访问http://localhost:8081/index.jsp，重定向至cas server(https://sso.cas.com:8443)认证页面，输入用户名casuser及密码Mellon，认证成功后跳回访问页。同时可以在CAS server日志上看到如下的验证信息

![](http://img.willowspace.cn/willowspace_2016/1491750286473.png)

访问https://sso.cas.com:8443/cas-server-webapp-4.0.0/logout可以退出单点登录

## 三、其他认证方式

以上验证的用户名和密码是配置在{CAS_server}/webapp/WEB-INF/deployerConfigContext.xml中的

![](http://img.willowspace.cn/willowspace_2016/1491750718948.png)

实际生产中用户认证信息往往配置在数据库中，下面介绍利用数据库配置认证方式

[配置数据库认证方式](http://www.cnblogs.com/rwxwsblog/p/4954843.html)

## FAQ

### 1. service是如何存储的

[Configuring CAS client for java in the web.xml](https://wiki.jasig.org/display/casc/configuring+the+jasig+cas+client+for+java+in+the+web.xml)

