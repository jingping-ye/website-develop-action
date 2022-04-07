const express = require('express');
const app = express();

const path = require('path');

const uaParser = require("ua-parser-js")

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors = require('cors');
const corsOptions = {
  origin: 'http://192.168.1.105:8081',
  optionSuccessStatus: 200
};
app.use(cors(corsOptions));

const morgan = require('morgan');
app.use(morgan('combined'));

const md5 = require('md5');

const multer = require('multer');
const storage = multer.diskStorage({
  destination(req, res, cb) {
    cb(null, './resource');
  },
  filename(req, file, cb) {
    const fileNameArr = file.originalname.split('.');
    const fileName = `${md5(fileNameArr[0])}${new Date().getTime()}.${fileNameArr[1]}`;
    cb(null, fileName);
  }
});
app.use(multer({ storage }).any());

const db = require('./config/db.config');

const cookie = require('cookie-parser');


app.use((req, res, next) => {
  // let ua = uaParser(req.headers['user-agent']);
  // if (/Classmate-Sun's Cloud/.test(ua.ua)) {
    next()
  // } else {
  //   res.sendFile(path.join(__dirname, './public/下载错误.html'));
  // }
});


app.use(express.static(path.join(__dirname, 'public')));

//允许跨域
app.use((req, res, next) => {
  res.header({
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': req.headers.origin || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    'Content-Type': 'application/json; charset=utf-8'
  });
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next()
  }
});

// app.use((req, res, next) => {
//   let ua = uaParser(req.headers['user-agent']);
//   if (ua.ua === "Classmate-Sun's Cloud") {
//     next()
//   } else {
//     res.send("请下载APP使用网盘！！！")
//     next()
//   }
// })



/* db.sequelize.sync({ force: true }).then(() => {
  console.log('重建表');
}); */
require('./route/user.route')(app);
require('./route/file.route')(app);

//  创建服务器
let server = app.listen(process.env.PORT || 8081, () => {
  // let host = server.address().address;
  // let port = server.address().port;
  console.log('服务启动');
});
