---
title: slf4j
date: 2017-01-20 10:01:25
categories: technology
tags: java
---

slf4j是日志框架抽象的接口，slf4j-lo4j12(Facade模式设计)来统一底层接口，使用slf4j-api作为提供接口，屏蔽了日志框架实现。

# slf4j-api

日志框架的抽象/接口，使用了外观模式（Facade） 屏蔽底层日志框架的实现，提供了一套更优质的日志api

# slf4j-log4j12

使用适配器模式（Adapter）对底层日志框架(log4j等)进行转接口，对接至slf4j-api

**三者关系如下**

![img](http://img.willowspace.cn/willowspace_2016/1482806227926.png?imageMogr2/thumbnail/200)

# 使用slf4j占位符方式打印日志

## 1. What is the fastest way of (not) logging?

SLF4J supports an advanced feature called parameterized logging which can significantly boost logging performance for*disabled* logging statement.

For some Logger `logger`, writing,

```java
logger.debug("Entry number: " + i + " is " + String.valueOf(entry[i]));
```

incurs the cost of constructing the message parameter, that is converting both integer `i` and `entry[i]` to a String, and concatenating intermediate strings. This, regardless of whether the message will be logged or not.

One possible way to avoid the cost of parameter construction is by surrounding the log statement with a test. Here is an example.

```java
if(logger.isDebugEnabled()) {
  logger.debug("Entry number: " + i + " is " + String.valueOf(entry[i]));
}
```

This way you will not incur the cost of parameter construction if debugging is disabled for `logger`. On the other hand, if the logger is enabled for the DEBUG level, you will incur the cost of evaluating whether the logger is enabled or not, twice: once in `debugEnabled` and once in `debug`. This is an insignificant overhead because evaluating a logger takes less than 1% of the time it takes to actually log a statement.

## 2. Better yet, use parameterized messages

There exists a very convenient alternative based on message formats. Assuming `entry` is an object, you can write:

```java
Object entry = new SomeObject();
logger.debug("The entry is {}.", entry);
```

After evaluating whether to log or not, and only if the decision is affirmative, will the logger implementation format the message and replace the ‘{}’ pair with the string value of `entry`. In other words, this form does not incur the cost of parameter construction in case the log statement is disabled.

The following two lines will yield the exact same output. However, the second form will outperform the first form by a factor of at least 30, in case of a *disabled* logging statement.

```java
logger.debug("The new entry is "+entry+".");
logger.debug("The new entry is {}.", entry);
```

A [two argument](http://www.slf4j.org/apidocs/org/slf4j/Logger.html#debug(java.lang.String,%20java.lang.Object%2C%20java.lang.Object)) variant is also available. For example, you can write:

```java
logger.debug("The new entry is {}. It replaces {}.", entry, oldEntry);
```

If three or more arguments need to be passed, you can make use of the [`Object...` variant](http://www.slf4j.org/apidocs/org/slf4j/Logger.html#debug(java.lang.String%2C%20java.lang.Object...)) of the printing methods. For example, you can write:

```java
logger.debug("Value {} was inserted between {} and {}.", newVal, below, above);
```

This form incurs the hidden cost of construction of an Object[] (object array) which is usually very small. The one and two argument variants do not incur this hidden cost and exist solely for this reason (efficiency). The slf4j-api would be smaller/cleaner with only the Object… variant.

Array type arguments, including multi-dimensional arrays, are also supported.

SLF4J uses its own message formatting implementation which differs from that of the Java platform. This is justified by the fact that SLF4J’s implementation performs about 10 times faster but at the cost of being non-standard and less flexible.

**Escaping the “{}” pair**

The “{}” pair is called the *formatting anchor*. It serves to designate the location where arguments need to be substituted within the message pattern.

SLF4J only cares about the *formatting anchor*, that is the ‘{‘ character immediately followed by ‘}’. Thus, in case your message contains the ‘{‘ or the ‘}’ character, you do not have to do anything special unless the ‘}’ character immediately follows ‘}’. For example,

```java
logger.debug("Set {1,2} differs from {}", "3");
```

which will print as “Set {1,2} differs from 3”.

You could have even written,

```java
logger.debug("Set {1,2} differs from {{}}", "3");
```

which would have printed as “Set {1,2} differs from {3}”.

In the extremely rare case where the the “{}” pair occurs naturally within your text and you wish to disable the special meaning of the formatting anchor, then you need to escape the ‘{‘ character with ‘\’, that is the backslash character. Only the ‘{‘ character should be escaped. There is no need to escape the ‘}’ character. For example,

```java
logger.debug("Set \\{} differs from {}", "3");
```

will print as “Set {} differs from 3”. Note that within Java code, the backslash character needs to be written as ‘\‘.

In the rare case where the “{}” occurs naturally in the message, you can double escape the formatting anchor so that it retains its original meaning. For example,

```java
logger.debug("File name is C:\\\\{}.", "file.zip");
```

will print as “File name is C:\file.zip”.

## 3. How can I log the string contents of a single (possibly complex) object ?

In relatively rare cases where the message to be logged is the string form of an object, then the parameterized printing method of the appropriate level can be used. Assuming `complexObject`is an object of certain complexity, for a log statement of level DEBUG, you can write:

```java
logger.debug("{}", complexObject);
```

The logging system will invoke `complexObject.toString()` method only after it has ascertained that the log statement was enabled. Otherwise, the cost of `complexObject.toString()`conversion will be advantageously avoided.