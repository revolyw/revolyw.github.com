---
title: docker备份生产环境
categories: technology
tags: ops
date: 2017-01-20 14:05:39
---

## 构建镜像

```shell
docker images
```



```shell
docker run -it -v [local direcory]:/mnt $containerId /bin/zsh
```

