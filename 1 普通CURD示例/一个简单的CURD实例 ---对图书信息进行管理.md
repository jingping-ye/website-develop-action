一个简单的CURD实例 ---对图书信息进行管理
========================

## 1 开发环境
- 前端:vue、axios
- 后端:node.js、express
- 数据库:mysql

### 1.1 前端开发环境
**新建一个文件夹`book-curd-example`,以下前后端代码都将在该文件夹下进行**

1. 输入以下命令，安装vue框架
```
cnpm install vue-cli -g
vue init webpack "client" //建立一个名称为client的前端项目
cnpm install //	安装依赖
npm run dev
```
2. 安装完毕之后，输入`npm run dev`，在浏览器输入`http://localhost:8080/#`后显示以下界面，则client项目生成完毕!
![vue初始化界面](https://i.imgur.com/nf8dCq1.png)
1.2 后端开发环境准备
1. 在`book-curd-example`下新建一个文件夹`server`文件夹用于保存后端代码
2. 进入`server`文件夹
3. 安装`express`和其他模块
```
npm install express body-parser cors morgan nodemon mysql sequelize --save
```
- body-parser解析
-  cors 跨域
-  morgan 日志记录
-  nodemon 程序调试自启
-  mysql2 mysql数据库驱动管理工具
-  sequelize mysql-ORM工具
4. 安装完成之后建立以下目录和文件
![后台目录](https://i.imgur.com/zDYcijP.png)
5. 使用`npm init -f`生成一个`package.json`文件
6. 修改为使用nodemon启动
```
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon server.js"
  },
```
7. 在`server.js`中写入以下代码用于测试，在`server`文件夹下输入`npm start`启动后台程序
```
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res) => {
  res.send([
    {
      title: 'Hello World!',
      description: 'Hi there! How are you?'
    }
  ]);
});

app.listen(process.env.PORT || 8081);

```
8.在浏览器中访问`http://localhost:8081/posts`,显示以下画面，则后台环境搭建成功。
![后端环境准备成功](https://i.imgur.com/s2OB9NS.png)
## 2 数据库设计和创建
### 2.1 数据库和表设计
- 数据库名称:book_curd_example
- 数据库表名称:book
### 2.2 book表设计

|字段|中文释义|类型|是否可为空|键|默认值|其他|
|--|--|--|--|--|--|--|
|id|书籍id|int(10) unsigned|NO|主键|null|auto_increment|
|isbn|isbn编号|varchar(20)|NO||null|	
|name|书名|varchar(50)|NO||null|
|author|作者|varchar(30)|NO||null|
|print|出版社|varchar(50)|||null|
|publish_time|出版日期|date|||null|
|intro|简介|varchar(255)|||null|
|remark|备注|varchar(200)|||null|

2.2 sql语句编写
```
DROP DATABASE IF EXISTS book_curd_example;
CREATE DATABASE book_curd_example;
use book_curd_example;
DROP TABLE IF EXISTS book;
CREATE TABLE IF NOT EXISTS `book`(
   `id` INT UNSIGNED AUTO_INCREMENT COMMENT '书籍id',
   `isbn` VARCHAR(20) NOT NULL COMMENT 'isbn编号',
   `name` VARCHAR(50) NOT NULL COMMENT '书名',
   `author` VARCHAR(30) NOT NULL COMMENT '作者',
   `print` VARCHAR(50) COMMENT '出版社',
   `publish_time` DATE COMMENT '出版日期',
   `intro` VARCHAR(255) COMMENT '简介',
   `remark` VARCHAR(200)COMMENT '备注',
   PRIMARY KEY ( `id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '图书信息表';
```
## 3 后台模块开发
### 3.1 创建数据库连接
1. 创建`/server/config/env.js`文件
```
//  数据库连接参数
const env = {
  database: 'book_curd_example',
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
db.book = require('../model/book.model.js')(sequelize, Sequelize);

module.exports = db;


```
### 3.2 创建表模型
1. 安装`sequelize-auto`模块，利用`sequelize-auto`模块自动生成book表模型
```
npm install -g sequelize-auto
sequelize-auto -h localhost -d book_curd_example -u root -x 123456 -p 3306 -t book
```
2.复制生成的`/models/book.js`文件，粘贴至`/model`目录下，并修改文件名为`/model/book.model.js`,删除生成的`models`目录

参考:[Tutorial | Sequelize | The node.js ORM for PostgreSQL, MySQL, SQLite and MSSQL](http://docs.sequelizejs.com/manual/tutorial/models-definition.html)
### 3.3 编写接口
1. 创建`/server/route/book.controller.js`文件，用来定义接口
```
//  图书的增删改查
module.exports = function(app) {
  const book = require('../controller/book.controller');

  //  新增图书信息
  app.post('/book/add', book.create);

  //  删除图书
  app.delete('/book/delete/:bookId', book.delete);

  //  根据id更新图书信息
  app.put('/book/update/:bookId', book.update);

  // 获取图书信息列表
  app.get('/book/list', book.findAll);

  //  根据Id查询图书信息
  app.get('/book/:bookId', book.findById);
};

```
2. 创建控制器文件`/server/controller/book.controller.js`
```
const db = require('../config/db.config.js');
const Book = db.book; //  引入表模型

//  增加图书
exports.create = (req, res) => {
  Book.create({
    isbn: req.body.isbn,
    name: req.body.name,
    author: req.body.author,
    print: req.body.print,
    publish_time: req.body.publish_time,
    intro: req.body.intro,
    remark: req.body.remark
  })
    .then(() => {
      let msg = {
        code: 200,
        msg: '新增成功!'
      };
      res.status(200).json(msg);
    })
    .catch(err => {
      res.status(500).json('Error -> ' + err);
    });
};

//  删除图书
exports.delete = (req, res) => {
  const id = req.params.bookId;
  Book.destroy({
    where: { id: id }
  })
    .then(() => {
      let msg = {
        code: 200,
        msg: '删除成功!'
      };
      res.status(200).json(msg);
    })
    .catch(err => {
      res.status(500).json('Error -> ' + err);
    });
};

//  更新图书信息
exports.update = (req, res) => {
  const id = req.params.bookId;
  Book.update(req.body, { where: { id: req.params.bookId } })
    .then(() => {
      let msg = {
        code: 200,
        msg: '修改信息成功!'
      };
      res.status(200).json(msg);
    })
    .catch(err => {
      res.status(500).json('Error -> ' + err);
    });
};

// 查询所有图书信息
exports.findAll = (req, res) => {
  Book.findAll()
    .then(book => {
      res.json(book);
    })
    .catch(err => {
      res.status(500).json('Error -> ' + err);
    });
};

// 根据id查询图书信息
exports.findById = (req, res) => {
  Book.findById(req.params.bookId)
    .then(book => {
      res.json(book);
    })
    .catch(err => {
      res.status(500).book('Error -> ' + err);
    });
};

```
3. 修改`server.js`服务器文件
```
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:8080',
  optionSuccessStatus: 200
};
app.use(cors(corsOptions));

const morgan = require('morgan');
app.use(morgan('combined'));

const db = require('./config/db.config');

require('./route/book.route')(app);

//  创建服务器
let server = app.listen(process.env.PORT || 8081, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log('服务器启动: http://%s:%s', host, port);
});

```
### 3.4 接口测试
使用`postman`工具进行测试
1. 新建5个接口进行测试


输出: