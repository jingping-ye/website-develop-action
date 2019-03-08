# 学习 rest api

## 命令行

- npm init
- npm init -yes
- npm install
- npm install express --save 安装 express 框架
- npm install mysql2 --save 连接数据库
- npm install body-parser --save node.js 中间件，用于处理请求中的 json,raw,text,url 等。
- npm install nodemon --save nodemon 会跟踪代码的变化，如果我们改变代码，nodemon 将会重启服务器

## 创建服务器文件server.js
```
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//  创建服务器
let server = app.listen(process.env.PORT || 8081, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log('server run on: http://%s:%s', host, port);
});

```

## 修改package.json文件
```
"start":"nodemon server.js"
```

## 数据库创建
```
DROP DATABASE IF EXISTS rest_api_example;
CREATE DATABASE rest_api_example;
use rest_api_example;
DROP TABLE IF EXISTS task;
CREATE TABLE IF NOT EXISTS `task`(
   `id` INT UNSIGNED AUTO_INCREMENT COMMENT '任务id',
   `name` VARCHAR(20) NOT NULL COMMENT '任务名称',
   `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态',
   `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
   PRIMARY KEY ( `id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '任务列表';
use rest_api_example;
INSERT INTO 
task(name) 
 VALUES
('参与会议'),
('午餐'),
('编写文件');
```



## 创建目录结构如下:
![路由](https://i.imgur.com/WGJVG48.png)

## 创建路由 
我们在路由文件中单独定义路由，在控制器文件中针对每一个路由写独立的函数
```
module.exports = function(app) {
  const task = require('../controller/app.controller');
  // 获取任务列表
  app.get('/task/list', task.findAll);

  //  新增任务
  app.post('/task/add', task.create);

  // 根据图书id更新图书信息
  app.put('/task/update/:taskId', task.update);

  //  根据图书id查询图书信息
  app.get('/task/update/:taskId', task.findById);

  //  根据图书Id删除图书信息
  app.delete('/task/delete/:taskId', task.delete);
};

```
## 创建数据库连接文件
```
// config/env.js文件
//  数据库连接参数
const env = {
  database: 'rest_api_example',
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
## 建立模型
我们可以重复使用数据库实例。