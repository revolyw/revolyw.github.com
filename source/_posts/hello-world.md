---
title: Hello Hexo
categories: technology
tags: 
---
Welcome to [Hexo](https://hexo.io/)! This is your very first post. Check [documentation](https://hexo.io/docs/) for more info. If you get any problems when using Hexo, you can find the answer in [troubleshooting](https://hexo.io/docs/troubleshooting.html) or you can ask me on [GitHub](https://github.com/hexojs/hexo/issues).

## Quick Start

### Create a new post

``` bash
$ hexo new "My New Post"
```

More info: [Writing](https://hexo.io/docs/writing.html)

### Run server

``` bash
$ hexo server
```

More info: [Server](https://hexo.io/docs/server.html)

### Generate static files

``` bash
$ hexo generate
```

More info: [Generating](https://hexo.io/docs/generating.html)

### Deploy to remote sites

``` bash
$ hexo deploy
```

More info: [Deployment](https://hexo.io/docs/deployment.html)



> 一些特定的使用场景

## 自定义新建文章的默认基本信息

例如默认的categories几tags信息

可以修改{hexo}/scaffolds/post.md文件

## 自定义domain来访问博客

为达成这样的效果须要在对应git仓库下新建CNAME文件，而没有配置的情况下CNAME是会在新的发布中被删除的。

可以在{hexo}/source目录下简历CNAME文件（文件中写入你的domain），这样CNAME也会被发布

其他须要发布的东西理同上
