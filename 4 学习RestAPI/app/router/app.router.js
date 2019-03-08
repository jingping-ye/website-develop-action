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
