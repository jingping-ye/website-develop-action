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

  //  根据书名或者作者名搜索图书信息
  app.post('/book/search', book.search);
};
