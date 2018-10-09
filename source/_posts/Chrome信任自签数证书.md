---
title: Chrome信任自签数证书
categories: technology
tags: [https,ca]
date: 2018-09-30 17:17:17
---

# Chrome信任自签数字证书
## 如何自签一个CA证书和一个子证书
1. 创建CA配置文件

  ```shell
  touch localhost_ca.cnf

  [ req ]
  distinguished_name  = req_distinguished_name
  x509_extensions     = root_ca

  [ req_distinguished_name ]

  # 以下内容可随意填写
  countryName             = CN (2 letter code)
  countryName_min         = 2
  countryName_max         = 2
  stateOrProvinceName     = ZheJiang
  localityName            = HangZhou
  organizationName        = Dxy
  organizationalUnitName  = technology
  commonName              = develop
  commonName_max          = 64
  emailAddress            = yangw@dxy.cn
  emailAddress_max        = 64

  [ root_ca ]
  basicConstraints        = critical, CA:true
  ```
2. 创建扩展配置文件

  ```shell
  touch localhost_ca.ext

  subjectAltName = @alt_names
  extendedKeyUsage = serverAuth

  [alt_names]

  # 域名，如有多个用DNS.2,DNS.3…来增加
  DNS.1 = a.domain.cn
  DNS.2 = b.domain.cn
  # IP地址
  IP.1 = 192.168.0.1
  IP.2 = 127.0.0.1
  ```

3. 创建CA证书私钥及CA证书

  ```shell
  openssl req -x509 -newkey rsa:2048 -out $CA_CER_NAME.cer -outform PEM -keyout $CA_KEY_NAME.pvk -days 10000 -verbose -config $CA_CNF_FILE -nodes -sha256 -subj "/CN=$CA_CER_NAME"
  ```

4. 创建子证书私钥

  ```shell
  openssl req -newkey rsa:2048 -keyout $KEY_NAME.pvk -out $CER_NAME.req -subj /CN=$CA_CER_NAME -sha256 -nodes
  ```

5. 创建子证书

  ```shell
  openssl x509 -req -CA $CA_CER_NAME.cer -CAkey $CA_KEY_NAME.pvk -in $CER_NAME.req -out $CER_NAME.cer -days 10000 -extfile $CA_EXT_FILE -sha256 -set_serial 0x1111
  ```

> 可以做成脚本以便复用

  ```shell
  #!/bin/zsh
  CA_CER_NAME=localhost_ca
  CA_KEY_NAME=localhost_ca
  CA_CNF_FILE=./localhost_ca.cnf
  CA_EXT_FILE=./localhost_ca.ext

  CER_NAME=localhost
  KEY_NAME=localhost

  openssl req -x509 -newkey rsa:2048 -out $CA_CER_NAME.cer -outform PEM -keyout $CA_KEY_NAME.pvk -days 10000 -verbose -config $CA_CNF_FILE -nodes -sha256 -subj "/CN=$CA_CER_NAME"

  openssl req -newkey rsa:2048 -keyout $KEY_NAME.pvk -out $CER_NAME.req -subj /CN=$CA_CER_NAME -sha256 -nodes

  openssl x509 -req -CA $CA_CER_NAME.cer -CAkey $CA_KEY_NAME.pvk -in $CER_NAME.req -out $CER_NAME.cer -days 10000 -extfile $CA_EXT_FILE -sha256 -set_serial 0x1111
  ```


## Chrome如何信任自签证书

1. chrome://settings进入Chrome设置界面,搜索certificate,找到并点击Manage certificates将进入系统Keychain Access
2. 将生成CA(.cer)证书导入
3. 将导入后的CA证书设置成always trust

## 一些证书使用场景

### pem格式转cer格式

  ```shell
  openssl x509 -inform PEM -in cacert.pem -outform DER -out certificate.cer
  ```

### 查看jdk证书

  ```shell
  keytool -list -keystore "%JAVA_HOME%/jre/lib/security/cacerts"
  ```

### jdk密钥库操作

__修改密码__

  ```shell
  keytool -storepasswd -keystore "%JAVA_HOME%/jre/lib/security/cacerts"
  ```

__导入证书__

  ```shell
  keytool -import -noprompt -trustcacerts -alias <AliasName> -file   <certificate> -keystore <KeystoreFile> -storepass <Password>
  ```

__删除证书__

  ```shell
  keytool -delete -alias <keyAlias> -keystore <keystore-name> -storepass <password>
  ```

### cocos creator中打包原生android应用时，使用android studio中的证书
找到构建好的原生android项目，修改其中gradle.properties文件，添加：

  ```properties
  systemProp.javax.net.ssl.trustStore={your-android-studio-directory}\\jre\\jre\\lib\\security\\cacerts
  systemProp.javax.net.ssl.trustStorePassword=changeit
  ```
这将让cocos使用android studio的证书，然后在android studio中配置证书：Preference->Tools->Server Certification中添加证书
