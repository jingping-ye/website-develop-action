# vue+nodejs+express+mysql 建立一个在线网盘程序

## 目录

- [vue+nodejs+express+mysql 建立一个在线网盘程序](#vuenodejsexpressmysql-建立一个在线网盘程序)
  - [第一章 开发环境准备](#第一章-开发环境准备)
    - [1.1 开发所用工具简介](#11-开发所用工具简介)
    - [1.2 安装 MySQL](#12-安装-mysql)
      - [1.2.1 下载安装 MySQL](#121-下载安装-mysql)
      - [1.2.2 可能出现的问题和解决方案](#122-可能出现的问题和解决方案)
    - [1.3 安装 vue-cli](#13-安装-vue-cli)
    - [1.4 安装 express](#14-安装-express)
  - [第二章 数据库设计和创建](#第二章-数据库设计和创建)
    - [2.1 数据库和表设计](#21-数据库和表设计)
    - [2.2 user 表](#22-user-表)
    - [2.3 file 表](#23-file-表)
    - [2.4 创建数据库和表所用 sql 语句参考](#24-创建数据库和表所用-sql-语句参考)
  - [第三章 后台模块开发](#第三章-后台模块开发)
    - [3.1 创建数据库连接](#31-创建数据库连接)
    - [3.2 创建表模型](#32-创建表模型)
    - [3.3 编写接口](#33-编写接口)
      - [3.3.1 定义接口](#331-定义接口)
      - [3.3.2 编写控制器文件](#332-编写控制器文件)
    - [3.4 接口测试](#34-接口测试)
  - [第四章 前端模块开发](#第四章-前端模块开发)
    - [4.1 安装并引入前端开发所需外部模块](#41-安装并引入前端开发所需外部模块)
    - [4.2 建立路由](#42-建立路由)
    - [4.3 编写组件](#43-编写组件)

** 代码戳[-->这里](https://github.com/jingping-ye/website-develop-action/tree/master/2%20%E5%9C%A8%E7%BA%BF%E7%BD%91%E7%9B%98/code) **

## 第一章 开发环境准备

### 1.1 开发所用工具简介

主要开发所用工具:

- MySQL、Express、NodeJS、Vue
- 其他工具: element-ui、axios

### 1.2 安装 MySQL

#### 1.2.1 下载安装 MySQL

参照: [MySQL 安装 | 菜鸟教程](http://www.runoob.com/mysql/mysql-install.html)

#### 1.2.2 可能出现的问题和解决方案

1.提示:Found option without preceding group in config file:XXX; Fatal error in defaults handling.  
解决方法:用电脑的记事本打开`my.ini`文件，将其另存为 ANSI 编码格式并替换原来的`my.ini`文件

2.提示:you must reset your password using ALTER USER statement before executing this statement.  
解决方法:重新设置密码  
在 mysql 环境下,输入`alter user user() identified by "123456";`退出 sql 重新登录即可。

### 1.3 安装 vue-cli

1. 新建一个文件夹`cloud-drive`,在该文件下中使用 webpack 生成一个 vue 项目

参考代码如下:

```
mkdir cloud-drive
cd cloud-drive

cnpm install vue-cli -g
vue init webpack "client" //建立一个名称为client的前端项目
cnpm install //	安装依赖
npm run dev
```

2. 在执行`npm run dev`后，在浏览器中输入`http://localhost:8080/#`后显示以下界面，则 client 项目生成完毕!
   ![vue初始化界面](https://i.imgur.com/nf8dCq1.png)

### 1.4 安装 express

1.在`cloud-drive`下建立一个文件夹，名称为 server,用于存放服务端的代码。

```
mkdir server
cd server
```

2. 在`server`文件夹下利用`npm init -f`生成一个`package.json`文件.
3. 为`package.json`文件添加启动项目代码

```
...
"scripts": {
    "start": "node src/app.js", // 加入这一条用于启动程序
    "test": "echo \"Error: no test specified\" && exit 1"
  },

...
```

4.在`server`文件夹下创建`src`文件夹，在`src`文件夹下创建`app.js`文件，在`app.js`写入以下信息用于测试

```
console.log('Hello World!');
```

5. 执行`npm start`命令,输出信息如以下代表成功

```
Hello World!
```

6. 安装 express 框架

```
npm install express --save
```

7. 安装其他的依赖

```
npm install body-parser cors morgan nodemon multer md5 --save
```

- body-parser 解析
- cors 跨域
- morgan 日志记录
- nodemon 程序调试自启
- multer 文件上传中间件
- md5 生成 md5 码模块 8.将`src/app.js`用以下内容替代，该内容创建了一个运行于 8081 接口的服务器，建立了一个测试用接口，名称为 posts

```
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

app.get('/posts', (req, res) => {
  res.send(
    [{
      title: "Hello World!",
      description: "Hi there! How are you?"
    }]
  )
})

app.listen(process.env.PORT || 8081)

```

9.修改`package.json`文件，采用 nodemon 启动

```
"scripts": {
    "start": "nodemon src/app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

10.使用`npm start`启动应用，在浏览器中访问`localhost:8081/posts`地址，如若成功,应该看到以下信息
![后端环境准备成功](https://i.imgur.com/s2OB9NS.png)
至此，后端环境准备完毕

## 第二章 数据库设计和创建

### 2.1 数据库和表设计

- 数据库名称:cloud_drive
- 数据库表: user 表和 file 表

### 2.2 user 表

**user 表:管理网盘注册用户信息**

| 字段     | 中文释义 | 类型             | 是否为空 | 键   | 默认值 | 其他           |
| -------- | -------- | ---------------- | -------- | ---- | ------ | -------------- |
| uid      | 用户 id  | int(10) unsigned | NO       | 主键 | null   | auto_increment |
| username | 用户名   | varchar(20)      | NO       |      | null   |
| password | 密码     | varchar(20)      | NO       |      | null   |

### 2.3 file 表

**file 表:管理用户上传文件信息**

| 字段        | 中文释义                     | 类型             | 是否为空 | 键   | 默认值 | 其他           |
| ----------- | ---------------------------- | ---------------- | -------- | ---- | ------ | -------------- |
| id          | 文件 id                      | int(10) unsigned | NO       | 主键 |        | auto_increment |
| file_name   | 文件名称                     | varchar(255)     | NO       |      | null   |
| hash_name   | 使用 hash 算法生成的文件名称 | varchar(255)     | NO       |      | null   |
| upload_time | 上传时间                     | varchar(255)     | No       |      | null   |
| type        | 文件类型                     | varchar(255)     | No       |      | null   |
| size        | 文件大小                     | varchar(255)     | No       |      | null   |
| download    | 下载次数                     | varchar(255)     | No       |      | null   |
| uid         | 上传用户 id                  | int(10) unsigned | No       | 外键 | null   |                |

### 2.4 创建数据库和表所用 sql 语句参考

1. 创建数据库`cloud_drive`和表`user`语句

```
DROP DATABASE IF EXISTS cloud_drive;
CREATE DATABASE cloud_drive;
use cloud_drive;
DROP TABLE IF EXISTS user;
CREATE TABLE IF NOT EXISTS `user`(
   `uid` INT UNSIGNED AUTO_INCREMENT COMMENT '用户id',
   `username` VARCHAR(20) NOT NULL COMMENT '用户名',
   `password` VARCHAR(20) NOT NULL COMMENT '密码',
   PRIMARY KEY ( `uid` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '用户表';
```

2. 创建用户上传文件表

```
use cloud_drive;
DROP TABLE IF EXISTS file;
CREATE TABLE `file`
(
	id int(10) AUTO_INCREMENT COMMENT '文件id',
	file_name varchar(200) NOT NULL COMMENT '文件名称',
	hash_name varchar(200) NOT NULL COMMENT '文件hash名称',
	upload_time DateTime NOT NULL COMMENT '上传时间',
	type varchar(20) NOT NULL COMMENT '文件类型',
	size varchar(20) NOT NULL COMMENT '文件大小',
	download varchar(50) NOT NULL COMMENT '下载次数',
	uid int unsigned COMMENT '用户id',
	PRIMARY KEY (id),
	foreign key(uid) references user(uid)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '上传文件表';
```

## 第三章 后台模块开发

### 3.1 创建数据库连接

1. 创建`/server/config/env.js`文件

```
//  数据库连接参数
const env = {
  database: 'cloud_drive',
  username: 'root',
  password: '123456',
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
module.exports = env;
```

2. 创建`/server/config/db.config.js`文件

```
const env = require('./env.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,

  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 引入表模型
db.user = require('../model/user.model')(sequelize, Sequelize);
db.file = require('../model/file.model')(sequelize, Sequelize);

module.exports = db;

```

### 3.2 创建表模型

1. 安装`sequelize-auto`模块，利用`sequelize-auto`模块自动生成 user 表模型和 file 表模型

```
npm install -g sequelize-auto
sequelize-auto -h localhost -d cloud_drive -u root -x 123456 -p 3306 -t user
sequelize-auto -h localhost -d cloud_drive -u root -x 123456 -p 3306 -t file
```

_注意:此处生成的表模型需要根据实际进行调整_

2.复制生成的`/models/book.js`文件，粘贴至`/model`目录下，并修改文件名后缀为`.model.js`,删除生成的`models`目录

### 3.3 编写接口

#### 3.3.1 定义接口

1. `/server/route/user.route.js`文件

```
//  用户
module.exports = function(app) {
  const user = require('../controller/user.controller');

  //  新增用户
  app.post('/user/add', user.create);

  //  根据用户名和密码查询用户
  app.post('/user/validate', user.validate);

  //  修改密码
  app.put('/user/update/:userId', user.updatePassWord);
};


```

2. `/server/route/file.route.js`文件

```
//  文件
module.exports = function(app) {
  const file = require('../controller/file.controller');

  //  新增文件
  app.post('/file/add', file.create);

  //  删除文件
  app.delete('/file/delete/:fileName/:fileId', file.delete);

  // 下载文件
  app.get('/file/download/:fileName/:fileId', file.download);

  // 获取文件信息列表
  app.post('/file/list', file.findAll);
};


```

#### 3.3.2 编写控制器文件

1. `/server/controller/user.controller.js`文件

```
const db = require('../config/db.config.js');
const User = db.user; //  引入表模型
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
//  新增用户
exports.create = (req, res) => {
  if (req.body.username && req.body.password) {
    User.create(req.body)
      .then(user => {
        let msg = {};
        if (user) {
          msg = {
            flag: 1,
            msg: '注册成功!',
            uid: user.uid,
            username: user.username
          };
        } else {
          msg = {
            flag: 0,
            msg: '注册失败，请稍后注册'
          };
        }
        res.status(200).json(msg);
      })
      .catch(err => {
        res.status(500).json('Error -> ' + err);
      });
  } else {
    let msg = {
      flag: 0,
      msg: '用户名或者密码不能为空!'
    };
    res.status(200).json(msg);
  }
};

//  验证用户名和密码
exports.validate = (req, res) => {
  if (req.body.username && req.body.password) {
    User.findOne({
      where: {
        [Op.and]: [
          {
            username: req.body.username
          },
          [
            {
              password: req.body.password
            }
          ]
        ]
      },
      attributes: ['uid', 'username']
    })
      .then(user => {
        let msg = {};
        if (user) {
          msg = {
            flag: 1,
            msg: '用户名和密码正确!',
            uid: user.uid,
            username: user.username
          };
        } else {
          msg = {
            flag: 0,
            msg: '用户名或密码错误!'
          };
        }

        res.status(200).json(msg);
      })
      .catch(err => {
        res.status(500).json('Error -> ' + err);
      });
  } else {
    let msg = {
      flag: 0,
      msg: '用户名或者密码不能为空!'
    };
    res.status(200).json(msg);
  }
};

//  修改密码
exports.updatePassWord = (req, res) => {
  User.findOne({
    where: {
      [Op.and]: [
        {
          uid: req.params.userId
        },
        {
          password: req.body.oldPassword
        }
      ]
    }
  }).then(user => {
    if (user) {
      User.update(
        {
          password: req.body.newPassword
        },
        {
          where: {
            uid: req.params.uid
          }
        }
      ).then(() => {
        let msg = {
          flag: 1,
          msg: '修改密码成功!'
        };
        res.status(200).json(msg);
      });
    } else {
      let msg = {
        flag: 0,
        msg: '密码不正确!'
      };
      res.status(200).json(msg);
    }
  });
};


```

2. `/server/controller/file.controller.js`文件

```
const db = require('../config/db.config.js');
const File = db.file; //  引入表模型
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const path = require('path');
const fs = require('fs');

//  添加文件
exports.create = (req, res) => {
  let params = {
    file_name: req.files[0].originalname,
    hash_name: req.files[0].filename,
    upload_time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
    type: path.parse(req.files[0].originalname).ext,
    size: req.files[0].size,
    download: 0,
    uid: req.body.uid
  };
  File.create(params)
    .then(file => {
      if (file) {
        let msg = {
          flag: 1,
          msg: '文件上传成功!'
        };
        res.status(200).json(msg);
      } else {
        let msg = {
          flag: 0,
          msg: '文件上传失败,请稍后重新上传!'
        };
        res.status(500).json(msg);
      }
    })
    .catch(err => {
      res.status(500).json('Error->' + err);
    });
};

//  删除文件
exports.delete = (req, res) => {
  const id = req.params.fileId;
  File.destroy({
    where: { id: id }
  })
    .then(_ => {
      //  从资源文件夹从删除
      let fileName = req.params.fileName;
      let path = `${__dirname}/../resource/${fileName}`;
      fs.unlink(path, err => {
        if (err) {
          let msg = {
            flag: 0,
            msg: '删除失败!'
          };
          res.status(200).json(msg);
        } else {
          let msg = {
            flag: 1,
            msg: '删除成功!'
          };
          res.status(200).json(msg);
        }
      });
    })
    .catch(err => {
      res.status(500).json('Error=>', err);
    });
};

//  下载文件
exports.download = (req, res) => {
  let fileId = req.params.fileId;
  File.findById(fileId).then(file => {
    file
      .increment('download')
      .then(file => {
        let fileName = req.params.fileName;
        let path = `${__dirname}/../resource/${fileName}`;
        res.download(path, fileName);
      })
      .catch(err => {
        res.status(500).json('Error=>', err);
      });
  });
};

//  获取文件列表信息
exports.findAll = (req, res) => {
  File.findAll({
    where: { uid: req.body.uid }
  })
    .then(file => {
      res.status(200).json(file);
    })
    .catch(err => {
      res.status(500).json('Error=>', err);
    });
};

```

## 3.4 接口测试

使用 postman 进行测试(略)

## 第四章 前端模块开发

### 4.1 安装并引入前端开发所需外部模块

1. 安装`axios`模块

- `npm install axios --save`
- 编写文件`src/utils/http.js`,并引入封装好的 axios 类

```
import axios from 'axios'

let httpInstance = axios.create()

httpInstance.defaults.baseURL = 'http://localhost:8081/'
httpInstance.defaults.timeout = 5000

httpInstance.formurl = (url, data, config) => {
  return httpInstance.post(url, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    ...config
  })
};

//  request拦截器
httpInstance.interceptors.request.use(
  config => {
    console.log(config)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
//  reponse拦截器
httpInstance.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response)
    }
  },
  error => {
    return Promise.reject(error)
  }
)
export default httpInstance

```

- 在`main.js`中引入`http.js`文件，并将其注册为 vue 全局变量

```
import http from './utils/http'
Vue.prototype.$http = http;
```

2. 安装`element-ui`模块

- `npm install element-ui --save`
- 在`main.js`中引入`element-ui`模块

```
  import ElementUI from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
  Vue.use(ElementUI)
```

### 4.2 建立路由

1. 建立文件 在`components` 下新建文件如下，并删除原有的`HelloWorld.vue`文件。

- `file-list.vue`: 已上传文件列表界面
- `file-upload.vue`:上传文件界面
- `index.vue`:登录注册界面
- `tab-list.vue`:tab 页
- `user-set.vue`:用户设置界面

2. 修改路由 在 router/main.js 中将路由修改如下

```
import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import list from '@/components/tab-list'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/tab-list',
      name: 'tab-list',
      component: list
    }
  ]
})
//  校验登录
router.beforeEach((to, from, next) => {
  if (to.name === 'tab-list') {
    if (!sessionStorage.username) {
      window.alert('您的登录信息无效或过期，请重新登录')
      return window.location.replace('/')
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router

```

3. 删除`App.vue`文件中以下代码

```
<img src="./assets/logo.png">
```

4. 在`index.vue`中写入以下代码:

```
<template>
  <div>
    Hello World!
  </div>
</template>
<script>
export default {}
</script>
<style scoped>
</style>
```

5. 使用`npm start`运行项目，在浏览器中访问,则会出现`npm start`的文字

### 4.3 编写组件

1.`index.vue`登录注册界面
（1）界面预览
![登录界面1](https://i.imgur.com/y4cU8sg.png)
![登录界面2](https://i.imgur.com/71oE9xz.png)
（2）代码编写

```
<template>
  <div class="index">
    <div class="title">
      在线网盘系统
    </div>
    <div class="label">
      Cloud Driver
    </div>
    <div class="btn">
      <el-button type="primary"
        @click="dialogFormVisible = true">登录/注册</el-button>
    </div>
    <el-dialog title="登录/注册"
      :visible.sync="dialogFormVisible"
      width="400px">
      <el-form :model="form">
        <el-form-item label="用户名"
          :label-width="formLabelWidth">
          <el-input v-model="form.username"
            autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码"
          :label-width="formLabelWidth">
          <el-input v-model="form.password"
            autocomplete="off"
            type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="signUp">注 册</el-button>
        <el-button type="primary"
          @click="signIn">登 录</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      dialogFormVisible: false,
      form: {
        username: '',
        password: ''
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    // 登录
    signIn () {
      this.dialogFormVisible = false
      this.$http
        .post('/user/validate', this.form)
        .then(res => {
          if (res.data.flag === 0) {
            this.$message.error(res.data.msg)
          } else {
            this.$message.success(res.data.msg)
            sessionStorage.setItem('uid', res.data.uid)
            sessionStorage.setItem('username', res.data.username)

            //  跳转到其他页面
            this.$router.push('tab-list')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //  注册
    signUp () {
      this.dialogFormVisible = false
      this.$http
        .post('/user/add', this.form)
        .then(res => {
          if (res.data.flag === 0) {
            this.$message.error(res.data.msg)
          } else {
            this.$message.success(res.data.msg)
            this.$router.push('tab-list')
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index {
  margin-top: 80px;
  text-align: center;
}
.title {
  font-size: 60px;
}
.label {
  font-size: 40px;
  margin-top: 10px;
}
.btn {
  margin-top: 10px;
}
.dialog-footer {
  text-align: center;
}
</style>

```

2. `tab-list.vue`选项卡切换界面
   （1）界面预览
   ![切换选项卡](https://i.imgur.com/D6A04jD.png)
   （2）代码

```
<template>
  <div class="show">
    <base-header></base-header>
    <el-tabs v-model="tabActivedName"
      class="tab"
      @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in componentList"
        :key="index"
        :label="item.tabLabel"
        :name="item.tabName">
        <component :is="item.compoName"
          v-if="tabActivedName===item.tabName"></component>
      </el-tab-pane>
    </el-tabs>
    <base-footer></base-footer>
  </div>
</template>

<script>
import BaseHeader from '../layout/header';
import BaseFooter from '../layout/footer';
import UploadFile from './file-upload';
import FileList from './file-list';
import userSet from './user-set';
export default {
  name: 'show',
  components: {
    BaseHeader,
    BaseFooter,
    UploadFile,
    FileList,
    userSet
  },
  data () {
    return {
      tabActivedName: 'second',
      componentList: [
        {
          tabName: 'first',
          compoName: 'upload-file',
          tabLabel: '上传文件'
        },
        {
          tabName: 'second',
          compoName: 'file-list',
          tabLabel: '文件列表'
        },
        {
          tabName: 'third',
          compoName: 'user-set',
          tabLabel: '用户设置'
        }
      ]
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tab {
  min-height: 400px;
  padding: 20px 40px;
}
</style>

```

3.`file-upload`文件上传组件
（1）界面预览
![文件上传](https://i.imgur.com/sKIiTJd.png)
（2）代码

```
<template>
  <el-upload drag
    multiple
    action="http://localhost:8081/file/add"
    :data="userInfo"
    :on-success="dealSuccess"
    :on-error="dealError">
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  </el-upload>
</template>
<script>
export default {
  data () {
    return {
      userInfo: {
        uid: sessionStorage.getItem('uid')
      }
    }
  },
  methods: {
    dealSuccess () {
      this.$message.success('上传文件成功!')
    },
    dealError () {
      this.$message.error('上传文件失败,请重新上传!')
    }
  }
}
</script>
<style scoped>
</style>

```

4. `file-list.vue`文件上传列表组件
   （1）界面预览
   ![文件列表界面](https://i.imgur.com/6V3jFh9.png)
   （2）代码

```
<template>
  <div>
    <el-table :data="tableData"
      :cell-style="{'text-align':'center'}"
      :header-cell-style="{'text-align':'center'}"
      style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="file_name"
        label="文件名"
        width="180px">
      </el-table-column>
      <el-table-column prop="size"
        label="文件大小"
        width="180px"
        :formatter="dealSize">
      </el-table-column>
      <el-table-column prop="upload_time"
        label="上传时间"
        width="180px"
        :formatter="dealTime">
      </el-table-column>
      <el-table-column prop="download"
        label="下载次数"
        width="180px">
      </el-table-column>
      <el-table-column prop="type"
        label="类型"
        width="180px">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a :href="getFile(scope.row)">
            <el-button size="mini"
              type="info"
              @click="handleDownload">下载</el-button>
          </a>
          <el-button size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    handleDelete (index, row) {
      this.$http
        .delete(`/file/delete/${row.hash_name}/${row.id}`)
        .then(res => {
          this.$message.success(res.data.msg)
          this.refreshFileList()
        })
        .catch(err => {
          console.log('Error=>', err)
        })
    },
    handleDownload () {
      setTimeout(() => {
        this.refreshFileList()
      }, 1000)
    },
    refreshFileList () {
      this.getFileList()
    },
    getFileList () {
      let params = {
        uid: sessionStorage.getItem('uid')
      }
      this.$http
        .post('/file/list', params)
        .then(res => {
          if (res.data.code === 0) {
            this.$message.error(res.data.msg)
          } else {
            this.tableData = res.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getFile (data) {
      let url = `http://localhost:8081/file/download/${data.hash_name}/${
        data.id
      }`
      return url
    },
    dealSize (row, column) {
      let fileSize = (row.size / 1024).toFixed(2)
      return `${fileSize}kb`
    },
    dealTime (row, column) {
      return this.formatTime(row.upload_time)
    },
    formatTime (value) {
      var date = new Date(value)
      var Y = date.getFullYear()
      var M =
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1
      var D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
      var h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
      var m =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      var s =
        date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
      return `${Y}-${M}-${D} ${h}:${m}:${s}`
    }
  },
  mounted () {
    this.getFileList()
  }
}
</script>

```

5. `user-set.vue`用户设置组件

```
<template>
  <div>
    <el-form :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="change-password">
      <el-form-item label="原密码"
        prop="oldPass">
        <el-input type="password"
          v-model="ruleForm.oldPass"
          autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码"
        prop="newPass">
        <el-input type="password"
          v-model="ruleForm.newPass"
          autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码"
        prop="checkNewPass">
        <el-input type="password"
          v-model="ruleForm.checkNewPass"
          autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
          @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    //  验证原密码
    let validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.oldPass !== '') {
          this.$refs.ruleForm.validateField('newPass')
        }
        callback()
      }
    }
    //  验证新密码
    var validateNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value === this.ruleForm.oldPass) {
        callback(new Error('新旧密码不能相同!'))
      } else {
        callback()
      }
    }
    //  验证再次输入密码

    var validateCheckNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error('两次输入密码不一致!!'))
      } else {
        callback()
      }
    }

    return {
      ruleForm: {
        oldPass: '',
        newPass: '',
        checkNewPass: ''
      },
      rules: {
        oldPass: [{ validator: validateOldPass, trigger: 'blur' }],
        newPass: [{ validator: validateNewPass, trigger: 'blur' }],
        checkNewPass: [{ validator: validateCheckNewPass, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            oldPassword: this.ruleForm.oldPass,
            newPassword: this.ruleForm.newPass
          }
          this.$http
            .put(`/user/update/${sessionStorage.uid}`, params)
            .then(res => {
              this.$message.success('修改密码成功!请重新登录')
              sessionStorage.clear()
              setTimeout(() => {
                this.$router.push({ path: '/' })
              }, 1000)
            })
            .catch(err => {
              console.log('Error=>', err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
.change-password {
  width: 400px;
  margin: 10px auto;
}
</style>

```
