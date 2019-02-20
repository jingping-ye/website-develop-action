//  数据库配置数据
const env = {
  host: 'localhost',
  username: 'root',
  password: '123456',
  database: 'web_disk',
  port: '3306',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 1000
  }
};
module.exports = env;
