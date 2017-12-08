---
title: hibernate的动态SQL机制
categories: technology
tags: [java,hibernate,JPA,transaction,sql]
date: 2017-12-09 01:29:52
---

# 一、问题描述

使用hibernate管理ORM时，如果某个映射实体字段为null保存时会报column 'xx' cannot be null之类的异常，导致存库失败，为解决这个问题，hibernate提供了动态SQL的机制。

# 二、解决方案

在实体关系配置时，加入`dynamic-insert` / `dynamic-update` （对应JPA中的`@DynamicInsert`/ `@DynamicUpdate`）会在执行插入或更新时动态判断字段是否为null（或是否有更新），如果为null（或没有更新）则不更新这类字段，也就不会产生异常。它的原理是在实体被加载到session中时会保存一份快照，如果在后续的更新操作检测到有更新，则动态生成更新部分涉及到的字段的sql。

# 三、Bonus

## 使用动态SQL的前提

就算使用了动态SQL机制，但如果字段在DDL中没有声明默认值，那么当实体字段为null时进行更新，依然会由db层面报出异常。因此要规范DDL，并结合动态SQL机制来避免业务代码出现实体保存时的空值异常。 案例如下：

```java
# java code
User user = new User();
session.save(user);

# exception
org.hibernate.PropertyValueException: not-null property references a null or transient value: User.avatar

# hibernate mapping
<class name="User" table="user" dynamic-insert="true" dynamic-update="true">
    <property name="avatarId" column="avatar_id" type="integer" not-null="true">
</class>


# table DDL 没有设置默认值，如果实体值为null依然会由db报异常
CREATE TABLE `user` (
  `avatar_id` int(11) NOT NULL
);
```

## 动态SQL的使用限制：同一个Session

动态SQL的使用是有前提条件的：需要在同一个Session中操作实体才能生效。 前面提到动态SQL的原理是在实体加载到Session中时保留了一份快照，后续操作时比对快照生成正确的sql操作，那么如果一个实体加载和回写使用的Session是不同的，那么自然无法进行快照比对，那么动态SQL的机制也就无法实施，hibernate只好按照默认规则更新全字段。

看个例子：如果我们在Controller层去写业务逻辑（__生产中请务必不要这么干！__）就极有可能会导致`@DynamicUpdate`失效，比如下面这段代码。

```java
@RequestMapping("/queryAndUpdate")
public Result queryAndUpdate(Http http) {
	//Controller层写业务逻辑
	int id = 1; 
	//using session1
    User user = services.getDaos().getUserDao().findById(id);
	//using session2 user中加载有没有映射到的关联实体 更新时抛出异常
    lecturer = services.getUserService().updateUser(user);
    return Result.success().setBean(user);
}
//实体
@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "user")
class User{
	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@NotFound(action = NotFoundAction.IGNORE)
	@OneToOne(targetEntity = File.class,cascade = CascadeType.REFRESH)
	@JoinColumn(name = "avatar_id")
	private File avatar;  //未加载的关联实体
	...
}
```

原因是我们一般会把事务控制在Service层，那么在Controller层的业务逻辑加载完一个对象，当对象返回到Controller层其实就已经穿透了事务边界，事务结束，hibernate默认会关闭Session；那么下面再次进入Service层更新这个对象就会开启新的事务，由新的Session来进行执行。

所以我们要想解决上述问题，目标很明确，在Controller中不会因为穿透了Service层而加载新的Session。

Spring为我们提供了`OpenSessionInViewFilter`这个过滤器可以轻松的达到上述目的，它将开启一个Session绑定到当前请求线程，这个线程上的Session将会被`TransactionManager`利用，因此事务结束(Service层穿透)也不会关闭Session，而是在整个请求周期中复用同一个Session。具体参考_[Spring文档](https://docs.spring.io/spring/docs/4.3.0.RC1/javadoc-api//org/springframework/orm/hibernate3/support/OpenSessionInViewFilter.html)_，这里不展开。

至此，动态SQL在整个请求周期内可以正常运行。

## 性能！

另外值得注意的是动态SQL打开了以后，不同对象的sql语句会不一样，如果一次更新多条记录，hibernate将不能使用 executeBatch进行批量更新，这样效率将大打折扣。在这种情况下，多条sql意味着数据库要编译多次sql语句。 

因此有批量更新的特殊场景时，建议单独使用hql或者sql进行操作。

## 文档参考：

_[annotations-hibernate-dynamicupdate](http://docs.jboss.org/hibernate/orm/5.2/userguide/html_single/Hibernate_User_Guide.html#annotations-hibernate-dynamicupdate)_

_[pc-managed-state-dynamic-update](http://docs.jboss.org/hibernate/orm/5.2/userguide/html_single/Hibernate_User_Guide.html#pc-managed-state-dynamic-update)_