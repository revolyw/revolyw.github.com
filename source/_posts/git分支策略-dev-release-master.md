---
title: git分支策略 dev-release-master
categories: technology
tags: git
date: 2017-01-20 13:54:14
---

生产工作中，多人协作，为保证分支间工作尽然有序，最常见的方式就是创建开发(dev)、发布(release)、主干(master)三个持久分支，并约定其之间以及与特性(feature)、漏洞修复(bugfix)等临时性分支的操作规范。

## 开发分支（dev）

dev分支，持续集成，并发布至测试环境测试。

## 发布分支（release）

各个开发者在dev上合并产生的冲突解决掉，并且在测试环境测试通过后稳定的dev，就可以合并至release（**release应当是一个随时可以合并至主干分支，而不会产生问题的分支**）。另一方面release也应该发布至测试环境测试，此时测试的主要执行者是产品经理等角色。

## 主干分支（master）

master分支是稳定的可发布至线上的分支，发布上线之前合并最新的release分支，然后由项目负责人执行发布上线相关操作。