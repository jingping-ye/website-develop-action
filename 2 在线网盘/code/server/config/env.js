//  数据库连接参数
const env = {
  database: '*********',  //数据库
  username: '*******',    //用户名
  password: '*********',  //密码
  port: 12345,            //端口号
  host: '***.***.***.***',//主机
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
module.exports = env;
