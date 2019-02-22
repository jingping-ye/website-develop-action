# 一个简单的 CURD 实例 ---对图书信息进行管理

**目录**

- [1 开发环境](#1-开发环境)
  - [1.1 前端开发环境](#11-前端开发环境)
  - [1.2 后端开发环境](#12-后端开发环境)
- [2 数据库设计和创建](#2-数据库设计和创建)
  - [2.1 数据库和表设计](#21-数据库和表设计)
  - [2.2 book 表设计](#22-book-表设计)
  - [2.3 sql 语句编写](#23-sql-语句编写)
- [3 后台模块开发](#3-后台模块开发)
  - [3.1 创建数据库连接](#31-创建数据库连接)
  - [3.2 创建表模型](#32-创建表模型)
  - [3.3 编写接口](#33-编写接口)
  - [3.4 接口测试](#34-接口测试)
- [4 前端模块开发](#4-前端模块开发)
  - [4.1 安装并引入前端开发所需外部模块](#41-安装并引入前端开发所需外部模块)
  - [4.2 建立路由](#42-建立路由)
  - [4.3 编写组件](#43-编写组件)

## 1 开发环境

- 前端:vue、axios
- 后端:node.js、express
- 数据库:mysql

### 1.1 前端开发环境

**新建一个文件夹`book-curd-example`,以下前后端代码都将在该文件夹下进行**

1. 输入以下命令，安装 vue 框架

```
cnpm install vue-cli -g
vue init webpack "client" //建立一个名称为client的前端项目
cnpm install //	安装依赖
npm run dev
```

2. 安装完毕之后，输入`npm run dev`，在浏览器输入`http://localhost:8080/#`后显示以下界面，则 client 项目生成完毕!
   ![vue初始化界面](https://i.imgur.com/nf8dCq1.png)

### 1.2 后端开发环境

1. 在`book-curd-example`下新建一个文件夹`server`文件夹用于保存后端代码
2. 进入`server`文件夹
3. 安装`express`和其他模块

```
npm install express body-parser cors morgan nodemon mysql2 sequelize --save
```

- body-parser 解析
- cors 跨域
- morgan 日志记录
- nodemon 程序调试自启
- mysql2 mysql 数据库驱动管理工具
- sequelize mysql-ORM 工具

4. 安装完成之后建立以下目录和文件

![后台目录](https://i.imgur.com/zDYcijP.png)

5. 使用`npm init -f`生成一个`package.json`文件

6. 修改为使用 nodemon 启动

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

### 2.2 book 表设计

| 字段         | 中文释义  | 类型             | 是否可为空 | 键   | 默认值 | 其他           |
| ------------ | --------- | ---------------- | ---------- | ---- | ------ | -------------- |
| id           | 书籍 id   | int(10) unsigned | NO         | 主键 | null   | auto_increment |
| isbn         | isbn 编号 | varchar(20)      | NO         |      | null   |
| name         | 书名      | varchar(50)      | NO         |      | null   |
| author       | 作者      | varchar(30)      | NO         |      | null   |
| print        | 出版社    | varchar(50)      |            |      | null   |
| publish_time | 出版日期  | date             |            |      | null   |
| intro        | 简介      | varchar(255)     |            |      | null   |
| remark       | 备注      | varchar(200)     |            |      | null   |

### 2.3 sql 语句编写

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

1. 安装`sequelize-auto`模块，利用`sequelize-auto`模块自动生成 book 表模型

```
npm install -g sequelize-auto
sequelize-auto -h localhost -d book_curd_example -u root -x 123456 -p 3306 -t book
```

2.复制生成的`/models/book.js`文件，粘贴至`/model`目录下，并修改文件名为`/model/book.model.js`,删除生成的`models`目录

参考:[Tutorial | Sequelize | The node.js ORM for PostgreSQL, MySQL, SQLite and MSSQL](http://docs.sequelizejs.com/manual/tutorial/models-definition.html)

### 3.3 编写接口

1. 创建`/server/route/book.route.js`文件，用来定义接口

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
    .then(book => {
      let msg = {
        code: 200,
        msg: '新增成功!',
        id: book.id
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

1. 新建 5 个接口进行测试

   ![新建5个接口用于测试](https://i.imgur.com/sSLicr4.png)

2. 新增数据接口测试
   ![新增数据](https://i.imgur.com/twBJRnw.png)
   ![新增结果](https://i.imgur.com/3GE48XW.png)
3. 删除数据接口测试
   ![删除数据](https://i.imgur.com/BgxhmwS.png)
4. 修改数据接口测试
   ![修改数据](https://i.imgur.com/bxcP4pD.png)
5. 查询所有数据接口测试
   ![查询所有数据](https://i.imgur.com/Rf1ViaX.png)
6. 查询单个实体数据接口测试
   ![查询单个实体数据](https://i.imgur.com/ApdsRpQ.png)

## 4 前端模块开发

### 4.1 安装并引入前端开发所需外部模块

1.安装`axios`模块

- `npm install axios --save`
- 编写文件`/src/utils/http.js`，引入封装好的 axios 类

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

- 在`main.js`中引入`http.js`文件,并将其注册为 vue 全局变量

```
  import http from './utils/http'
  Vue.prototype.$http = http
```

2. 安装`element-ui`模块

- `npm install elemenr-ui --save`
- 在`main.js`中引入`element-ui`模块

```
  import ElementUI from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
  Vue.use(ElementUI)
```

### 4.2 建立路由

1. 建立文件
   在 components 下新建 3 个文件`book-list.vue`、`book-detail.vue`、`book-add.vue`。删除原有的`HelloWorld.vue`文件。
2. 修改路由
   在`router/main.js`中将路由修改如下

```
import Vue from 'vue'
import Router from 'vue-router'
import BookList from '@/components/book-list'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'book-list',
      component: BookList
    }
  ]
})

```

3. 删除`App.vue`文件中以下代码

```
<img src="./assets/logo.png">
```

4. 在`book-list.vue`文件中写入以下代码

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

5. 使用`npm start`运行项目，在浏览器中访问，则会出现`Hello World`的文字

### 4.3 编写组件

1. `book-list.vue`

（1）效果图
![图书列表](https://i.imgur.com/rLinjBR.png)
(2) 代码

```
<template>
  <div>
    <header>图书列表</header>
    <div class="container">
      <div class="operate-btn">
        <el-button @click="addBook">新增图书</el-button>
      </div>
      <el-table :data="tableData"
        border
        style="width: 100%">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="name"
          label="图书名称"
          min-width="180px">
        </el-table-column>
        <el-table-column prop="isbn"
          label="ISBN编号"
          min-width="180px">
        </el-table-column>
        <el-table-column prop="author"
          label="作者"
          min-width="180px">
        </el-table-column>
        <el-table-column prop="print"
          label="出版社"
          min-width="180px">
        </el-table-column>
        <el-table-column prop="publish_time"
          label="出版日期"
          min-width="180px">
        </el-table-column>
        <el-table-column label="操作"
          min-width="200px">
          <template slot-scope="scope">
            <el-button size="mini"
              @click="handleDetail(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <book-detail :bookId="bookId"
      :visible="bookDetailVisible"
      @closedDialog="closedDetailDialog">
    </book-detail>
    <book-add :visible="bookAddVisible"
      @closedDialog="closeAddDialog"
      @addNewBook="addNewBook">
    </book-add>
  </div>
</template>
<script>
import BookDetail from './book-detail';
import BookAdd from './book-add';
export default {
  components: {
    BookDetail,
    BookAdd
  },
  mounted () {
    this.getBookList()
  },
  data () {
    return {
      tableData: [],
      bookId: null,
      bookDetailVisible: false,
      bookAddVisible: false
    }
  },
  methods: {
    addNewBook (val) {
      this.bookId = val
      this.bookDetailVisible = true
    },
    addBook () {
      this.bookAddVisible = true
    },
    refreshBookList () {
      this.getBookList()
    },
    closeAddDialog () {
      this.bookAddVisible = false
      this.refreshBookList()
    },
    closedDetailDialog () {
      this.bookDetailVisible = false
      this.refreshBookList()
    },
    handleDelete (index, row) {
      this.$http
        .delete(`/book/delete/${row.id}`)
        .then(res => {
          this.$message.success(res.data.msg)
          this.refreshBookList()
        })
        .catch(err => {
          console.log('err=>', err)
        })
    },
    handleDetail (index, row) {
      this.bookId = row.id
      this.bookDetailVisible = true
    },
    getBookList () {
      this.$http
        .get('/book/list')
        .then(res => {
          this.tableData = res.data
        })
        .catch(err => {
          console.log('err->', err)
        })
    }
  }
}
</script>
<style scoped>
header {
  font-size: 36px;
  height: 60px;
  padding-top: 30px;
  padding-left: 40px;
  box-shadow: 0px 15px 10px -15px #ccc;
  margin-bottom: 10px;
}
.container {
  text-align: center;
  box-shadow: 0px -15px 10px -15px #ccc;
  padding: 30px;
}
.el-table {
  padding-top: 20px;
}
.operate-btn {
  text-align: right;
  margin-bottom: 10px;
}
</style>

```

2. `book-add.vue`

（1）效果图
![新增图书](https://i.imgur.com/WP2OQ24.png)

(2)代码

```
<template>
  <el-dialog :visible.sync="dialogVisible"
    @closed="closedDialog"
    min-width="360px">
    <div slot="title">
      <span class="title-name">
        <span>新增图书</span>
      </span>
    </div>
    <el-row>
      <el-col :span="4">
        <div class="label">名称</div>
      </el-col>
      <el-col :span="20">
        <el-input v-model="bookInfo.name"
          size="medium"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">ISBN编号</div>
      </el-col>
      <el-col :span="20">
        <el-input v-model="bookInfo.isbn"
          size="medium"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">作者</div>
      </el-col>
      <el-col :span="20">
        <el-input v-model="bookInfo.author"
          size="medium"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">出版社</div>
      </el-col>
      <el-col :span="20">
        <el-input v-model="bookInfo.print"
          size="medium"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">出版日期</div>
      </el-col>
      <el-col :span="20">
        <el-date-picker v-model="bookInfo.publish_time"
          type="date"
          placeholder="选择日期"
          size="medium">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">简介</div>
      </el-col>
      <el-col :span="20">
        <el-input type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="bookInfo.intro"
          max-length="200">
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">其他</div>
      </el-col>
      <el-col :span="20">
        <el-input type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="bookInfo.remark"
          max-length="200">
        </el-input>
      </el-col>
    </el-row>
    <div slot="footer"
      class="dialog-footer">
      <el-button @click="cancelEdit"
        size="medium">取 消</el-button>
      <el-button type="primary"
        @click="addBook"
        size="medium">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean
    }
  },
  watch: {
    visible: {
      handler (newV, oldV) {
        this.dialogVisible = newV
      }
    }
  },
  mounted () {},
  data () {
    return {
      dialogVisible: false,
      bookInfo: {}
    }
  },
  methods: {
    addBook () {
      this.$http
        .post('/book/add', this.bookInfo)
        .then(res => {
          this.$message.success(res.data.msg)
          let bookId = res.data.id
          setTimeout(() => {
            this.$emit('addNewBook', bookId)
            this.closedDialog()
          }, 1000)
        })
        .catch(err => {
          console.log('err=>', err)
        })
    },
    cancelEdit () {
      this.closedDialog()
    },
    resetData () {
      this.dialogVisible = false
      this.bookInfo = {}
    },
    closedDialog () {
      this.$emit('closedDialog')
      this.resetData()
    }
  }
}
</script>
<style scoped>
.el-row {
  line-height: 40px;
  margin-top: 10px;
}
.label {
  font-weight: bold;
}
.edit-btn {
  margin-left: 10px;
}
.title-name {
  font-size: 30px;
}
.dialog-footer {
  text-align: center;
}
</style>

```

3. `book-detail.vue`

（1）效果图
![图书细节](https://i.imgur.com/oyKpvpS.png)
![编辑状态](https://i.imgur.com/uiXv4xR.png)

（2）代码

```
<template>
  <el-dialog :visible.sync="dialogVisible"
    @closed="closedDialog">
    <div slot="title">
      <span class="title-name">图书信息</span>
      <el-button size="small"
        icon="el-icon-edit"
        round
        class="edit-btn"
        @click="editBookInfo">编辑</el-button>
    </div>
    <el-row>
      <el-col :span="4">
        <div class="label">名称</div>
      </el-col>
      <el-col :span="20">
        <span v-if="!isEdit">{{bookInfo.name}}</span>
        <el-input v-model="bookInfo.name"
          v-if="isEdit"
          size="medium"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">ISBN编号</div>
      </el-col>
      <el-col :span="20">
        <span v-if="!isEdit">{{bookInfo.isbn}}</span>
        <el-input v-if="isEdit"
          v-model="bookInfo.isbn"
          size="medium"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">作者</div>
      </el-col>
      <el-col :span="20">
        <span v-if="!isEdit">{{bookInfo.author}}</span>
        <el-input v-if="isEdit"
          v-model="bookInfo.author"
          size="medium"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">出版社</div>
      </el-col>
      <el-col :span="20">
        <span v-if="!isEdit">{{bookInfo.print}}</span>
        <el-input v-if="isEdit"
          v-model="bookInfo.print"
          size="medium"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">出版日期</div>
      </el-col>
      <el-col :span="20">
        <span v-if="!isEdit">{{bookInfo.publish_time}}</span>
        <el-date-picker v-if="isEdit"
          v-model="bookInfo.publish_time"
          type="date"
          placeholder="选择日期"
          size="medium">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">简介</div>
      </el-col>
      <el-col :span="20">
        <span v-if="!isEdit">{{bookInfo.intro}}</span>
        <el-input v-if="isEdit"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="bookInfo.intro"
          max-length="200">
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">其他</div>
      </el-col>
      <el-col :span="20">
        <span v-if="!isEdit">{{bookInfo.remark}}</span>
        <el-input type="textarea"
          v-if="isEdit"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="bookInfo.remark"
          max-length="200">
        </el-input>
      </el-col>
    </el-row>
    <div slot="footer"
      class="dialog-footer"
      v-if="isEdit">
      <el-button @click="cancelEdit"
        size="medium">取 消</el-button>
      <el-button type="primary"
        @click="updateBookInfo"
        size="medium">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    bookId: {
      type: Number
    },
    visible: {
      type: Boolean
    }
  },
  watch: {
    visible: {
      handler (newV, oldV) {
        this.dialogVisible = newV
        if (this.dialogVisible) {
          this.getBookById()
        }
      }
    }
  },
  mounted () {},
  data () {
    return {
      dialogVisible: false,
      bookInfo: {},
      isEdit: false
    }
  },
  methods: {
    refreshBookInfo () {
      this.getBookById()
    },
    updateBookInfo () {
      this.$http
        .put(`/book/update/${this.bookId}`, this.bookInfo)
        .then(res => {
          console.log(this.$message)
          this.$message.success(res.data.msg)
          this.isEdit = false
          this.refreshBookInfo()
        })
        .catch(err => {
          console.log('err->', err)
          this.isEdit = false
        })
    },
    cancelEdit () {
      this.isEdit = false
    },
    resetData () {
      this.dialogVisible = false
      this.bookInfo = {}
      this.isEdit = false
    },
    closedDialog () {
      this.$emit('closedDialog')
      this.resetData()
    },
    getBookById () {
      this.$http
        .get(`/book/${this.bookId}`)
        .then(res => {
          this.bookInfo = res.data
        })
        .catch(err => {
          console.log('err->', err)
        })
    },
    editBookInfo () {
      this.isEdit = true
    }
  }
}
</script>
<style scoped>
.el-row {
  line-height: 40px;
  margin-top: 10px;
}
.label {
  font-weight: bold;
}
.edit-btn {
  margin-left: 10px;
}
.title-name {
  font-size: 30px;
}
.dialog-footer {
  text-align: center;
}
</style>

```
