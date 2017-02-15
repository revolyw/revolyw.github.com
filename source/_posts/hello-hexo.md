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

我使用的主题是[next](https://github.com/iissnan/hexo-theme-next)，关于next的基本配置及用法可以参考[文档](http://theme-next.iissnan.com/),以下是我在使用hexo及next过程中碰到的特殊(文档中未找到描述)使用场景

## 自定义新建文章的默认基本信息

例如默认的categories几tags信息

可以修改{hexo}/scaffolds/post.md文件

## 自定义domain来访问博客

为达成这样的效果须要在对应git仓库下新建CNAME文件，而没有配置的情况下CNAME是会在新的发布中被删除的。

可以在{hexo}/source目录下简历CNAME文件（文件中写入你的domain），这样CNAME也会被发布

其他须要发布的东西理同上

##  修改主题layout中的模板文件

在next主题的目录下有一个layout目录，这是主题的模板文件。这些文件都是以swig结尾，[SWIG](http://www.swig.org/translations/chinese/index.html)是个帮助使用C或者C++编写的软件能与其它各种高级编程语言进行嵌入联接的开发工具。

如果需要修改主题的样式布局结构等，修改这些swig模板文件即可达到目的

## 在文章底部添加licence信息

我使用的是[Creative Commons 知识共享许可协议](https://creativecommons.org/licenses/by-nc-nd/3.0/)，协议内容详见[这里](https://creativecommons.org/licenses/by-nc-nd/3.0/cn/legalcode)

找到${next}/layout/_macro/post.swig，将许可证官网复制的相关代码粘贴至文章指定位置即可

## 使用next与hexo的内置标签来书写markdown

[next文档中的内置标签](http://theme-next.iissnan.com/tag-plugins.html)，更多内置标签参照[hexo内置标签](https://hexo.io/docs/tag-plugins.html)

## 开启首页的文章摘要

在主题配置中找到excerpt相关配置

## 处理摘要中的代码块

首页一般都会显示文章摘要，而摘要中如果包含一部分markdown的代码块，则可能出现一长串编码超出容器

![](http://img.willowspace.cn/willowspace_2016/1485056475711.png)

这时可以修改swig模板，添加css的word-break属性来处理这种情况。

```html
<div style="word-break:break-all;word-break:break-word;">
    {{ content.substring(0, theme.auto_excerpt.length) }}
</div>
```

## 开启多说评论的邮件提醒

参考这篇[博客](http://www.tuicool.com/articles/iEN7riZ)

## 修改文章字体相关属性

1. 正文字体大小 __${next}/source/css/_common/scaffolding/base.styl__ 中的body标签

## 添加页内链接

1. 制作一个hash链接

   ```html
   <span id="hash">content</span>
   ```

2. 在需要的地方链接到hash链

   ```markdown
   [hash](#hash)
   ```

## 添加网易云音乐播放器

如果只是加入单曲，只需要搜索歌曲，点开歌曲名，点击生成外链播放器，复制html代码（可以选择是否自动播放），将html代码无需任何修改放入markdown文章里就OK了。

如果想要加入歌单，就需要自己创建歌单，然后分享歌单，找到自己的分享动态，点进去可以看到有“生成外链播放器”这些字眼，其余操作就和上面一样了。不过，你的歌单有变化的话，这个外链的歌曲同样跟着变，这一点挺棒的。



> 关于next主题及hexo相关的问题，欢迎大家给我留言，一起讨论。