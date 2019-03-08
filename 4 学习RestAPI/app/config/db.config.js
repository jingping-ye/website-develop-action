const env = require('./env');
const mysql = require('mysql2');
// 创建一个连接池
const pool = mysql.createPool({
  host: env.host,
  user: env.user,
  password: env.password,
  database: env.database,
  charset: env.charset
});

// db.task = require('../model/app.model');
module.exports = pool;
