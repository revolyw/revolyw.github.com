本文介绍使用在php storm上进行断点调试

### 安装xdebug

```shell
# 安装xdebug
brew install php56-xdebug
# 查看安装结果
php -i
```

### php storm设置

1. 配置debug环境,注意端口号要与php.ini中配置的相同（下图为9000端口）

   ![](http://img.willowspace.cn/willowspace_2016/1500902696029.png)

2. 设置PHP Web Application

   注意要设置下图中的Absolute path on the server

![](http://img.willowspace.cn/willowspace_2016/1500902961165.png)

![](http://img.willowspace.cn/willowspace_2016/1500903034350.png)

开始使用断点

### FAQ

__Q1：断点进入时出现了Remote file path is not mapped to any file path in project__

这是由于PhpStorm不能确定哪个本地文件与debug监听的文件对应，应该不能定位本地的断点。

可以点击__Click to set up path mappings__按钮设置上文提到的Absolute path on the server，设置完毕即可解决该问题