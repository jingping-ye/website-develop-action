const db = require('../config/db.config.js');
const File = db.file; //  引入表模型
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//  添加文件
exports.create = (req, res) => {
  let uid = req.cookies.uid;
  File.create(req.body)
    .then(file => {
      let msg = {};
      if (file) {
        msg = {
          flag: 1,
          msg: '文件上传成功!'
        };
      } else {
        msg = {
          flag: 0,
          msg: '文件上传失败,请稍后重新上传!'
        };
        res.status(200).json(msg);
      }
    })
    .catch(err => {
      res.status(500).json('Error->' + err);
    });
};

//  删除文件
exports.delete = (req, res) => {
  const id = req.params.fileId;
  File.destory({
    where: { id: id }
  })
    .then(_ => {
      let msg = {
        flag: 1,
        msg: '删除成功!'
      };
      res.status(200).json(msg);
    })
    .catch(err => {
      res.status(500).json('Error=>', err);
    });
};

//  下载文件
exports.download = (req, res) => {
  let fileId = req.params.fileId;
  File.findById(fileId).then(file => {
    file
      .increment('download')
      .then(file => {
        if (file) {
          let msg = {
            flag: 1,
            msg: '文件下载成功!'
          };
          res.status(200).json(msg);
        } else {
          let msg = {
            flag: 0,
            msg: '服务器繁忙，请稍后再试!'
          };
          res.status(200).json(msg);
        }
      })
      .catch(err => {
        res.status(500).json('Error=>', err);
      });
  });
};

//  获取文件列表信息
exports.findAll = (req, res) => {
  File.findAll()
    .then(file => {
      res.status(200).json(file);
    })
    .catch(err => {
      res.status(500).json('Error=>', err);
    });
};
