---
title: 'Java8 Collections::sort引起的ConcurrentModificationException'
categories: technology
tags: [java,java8,并发编程]
date: 2017-09-25 01:48:03
---

# 问题背景

生产环境(JDK8u144)中有部分公共数据存在xml中，使用时会将xml数据读取到内存，以 `ArrayList` 存储，多个用户(多线程)对同一个 `ArrayList`  使用了 `Collections` 的sort(List,Comparator)方法进行排序，从而触发了 `ConcurrentModificationException`。其本质就是一个并发问题。

# 问题复现

```java
@Test
public void testConcurrentModificationException() throws Exception {
  Random random = new Random();
  //初始化ArrayList
  List<Integer> dataList = new ArrayList<>();
  for (int i = 0; i < 100; i++) {
      dataList.add(random.nextInt(10));
  }
  System.out.println("initialize " + dataList.stream().map(Objects::toString).collect(Collectors.joining(",")));
  //初始化排序任务
  Runnable runnable = () -> {
      Collections.sort(dataList, Integer::compareTo);
      System.out.println("thread[" + Thread.currentThread().getId() + "] " + dataList.stream().map(Objects::toString).collect(Collectors.joining(",")));
  };
  //模拟多线程环境对同一个ArraList进行排序
  for (int i = 0; i < 1000; i++) {
      ThreadPool.execute(runnable);
  }
}
```

以上Test Case将复现 `ConcurrentModificationException` 异常

![](http://img.willowspace.cn/willowspace_2016/1506285531798.png?imageMogr2/thumbnail/800)

#ConcurrentModificationException

顾名思义,`ConcurrentModificationException` 是并发修改引起的异常。追溯 `JDK8u144` 的 `Collections::sort` 实现可以发现，最终调用的是ArrayList的sort方法

```java
//Collections::sort
public static <T> void sort(List<T> list, Comparator<? super T> c) {
    list.sort(c);
}
//ArrayList::sort
public void sort(Comparator<? super E> c) {
    final int expectedModCount = modCount;
    Arrays.sort((E[]) elementData, 0, size, c);
    if (modCount != expectedModCount) {
        throw new ConcurrentModificationException();
    }
    modCount++;
}
```

而在 `JDK8u20` 之前

# 解决方案

## 加锁

```java
@Test
public void testConcurrentModificationException() throws Exception {
    Random random = new Random();
    List<Integer> dataList = new ArrayList<>();
    for (int i = 0; i < 100; i++) {
        dataList.add(random.nextInt(10));
    }
    System.out.println("initialize {}" + dataList.stream().map(Objects::toString).collect(Collectors.joining(",")));
    Runnable runnable = () -> {
        synchronized (random) {
            Collections.sort(dataList, Integer::compareTo);
            System.out.println("thread[" + Thread.currentThread().getId() + "] " + dataList.stream().map(Objects::toString).collect(Collectors.joining(",")));
        }
    };
    for (int i = 0; i < 1000; i++) {
        ThreadPool.execute(runnable);
    }
}
```

## 使用 `CopyOnWriteArrayList`

```java
@Test
public void testConcurrentModificationException() throws Exception {
    Random random = new Random();
    List<Integer> dataList = new CopyOnWriteArrayList<>();
    for (int i = 0; i < 100; i++) {
        dataList.add(random.nextInt(10));
    }
    System.out.println("initialize {}" + dataList.stream().map(Objects::toString).collect(Collectors.joining(",")));
    Runnable runnable = () -> {
            Collections.sort(dataList, Integer::compareTo);
            System.out.println("thread[" + Thread.currentThread().getId() + "] " + dataList.stream().map(Objects::toString).collect(Collectors.joining(",")));
    };
    for (int i = 0; i < 1000; i++) {
        ThreadPool.execute(runnable);
    }
}
```

