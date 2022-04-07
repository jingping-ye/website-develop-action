//  文件
module.exports = function(app) {
  const file = require('../controller/file.controller');

  //  新增文件
  app.post('/file/add', file.create);

  //  新增文件夹
  app.post('/file/addfolder', file.addfolder);

  //  重命名
  app.post('/file/reName', file.reName);
  
  //  移动文件
  app.post('/file/moveFile', file.moveFile);

  //  文件转存
  app.post('/file/share', file.share);
  
  //  文件类型
  app.post('/file/fileType', file.fileType);

  //  删除文件
  app.delete('/file/delete/:fileName/:fileId', file.delete);

  // 下载文件
  app.get('/file/download/:fileId/:fileName', file.download);

  // 获取文件信息列表
  app.post('/file/list', file.findAll);

  // 打包文件夹
  app.post('/file/packFails', file.packFails);
};
