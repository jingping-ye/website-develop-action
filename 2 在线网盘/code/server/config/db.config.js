const env = require('./env.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  port: env.port,
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

// 引入表模型,数据库表将根据表模型生成
db.user = require('../model/user.model')(sequelize, Sequelize);
db.file = require('../model/file.model')(sequelize, Sequelize);

module.exports = db;
