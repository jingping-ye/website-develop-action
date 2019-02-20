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
    .then(() => {
      let msg = {
        code: 200,
        msg: '新增成功!'
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
