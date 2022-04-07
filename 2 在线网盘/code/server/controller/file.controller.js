const db = require('../config/db.config.js');
const File = db.file; //  引入表模型
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises
const uaParser = require("ua-parser-js")
const pinyin = require('../pinyin/pinyin.js');

function sortArr(arr) {
  let newarr = arr.sort(name)
  let newFolderList = []
  let newFileList = []
  let newList = []
  for (let i = 0; i < newarr.length; i++) {
    if (newarr[i].type === ".folder") {
      newFolderList.push(newarr[i])
    }
  }
  for (let a = 0; a < newFolderList.length; a++) {
    if (!isChinese(newFolderList[a].file_name[0])) {
      newList.push(newFolderList[a])
    }
  }
  for (let b = 0; b < newFolderList.length; b++) {
    if (!!isChinese(newFolderList[b].file_name[0])) {
      newList.push(newFolderList[b])
    }
  }
  for (let j = 0; j < newarr.length; j++) {
    if (newarr[j].type !== ".folder") {
      newFileList.push(newarr[j])
    }
  }
  for (let c = 0; c < newFileList.length; c++) {
    if (!isChinese(newFileList[c].file_name[0])) {
      newList.push(newFileList[c])
    }
  }
  for (let d = 0; d < newFileList.length; d++) {
    if (!!isChinese(newFileList[d].file_name[0])) {
      newList.push(newFileList[d])
    }
  }
  return newList
}

function name(a, b) {
  return pinyin.getCamelChars(a.file_name).localeCompare(pinyin.getCamelChars(b.file_name), "zh");
}

function isChinese(temp) {
  var re = /[^\u4E00-\u9FA5]/;
  if (re.test(temp)) return false;
  return true;
}

//  添加文件
exports.create = (req, res) => {
  console.log(req.files[0])
  let date = new Date()
  let year = date.getFullYear() > 9 ? date.getFullYear() : "0" + date.getFullYear()
  let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
  let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate()
  let hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours()
  let min = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()
  let sec = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds()
  let uploadTime = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec
  let params = {
    file_name: req.files[0].originalname,
    hash_name: req.files[0].filename,
    upload_time: uploadTime,
    type: path.parse(req.files[0].originalname).ext,
    size: req.files[0].size,
    download: 0,
    uid: req.body.uid,
    path: req.body.path
  };
  File.create(params)
    .then(file => {
      if (file) {
        let msg = {
          flag: 1,
          msg: '文件上传成功!'
        };
        res.status(200).json(msg);
      } else {
        let msg = {
          flag: 0,
          msg: '文件上传失败,请稍后重新上传!'
        };
        res.status(500).json(msg);
      }
    })
    .catch(err => {
      res.status(500).json('Error->' + err);
    });
};

//  添加文件夹
exports.addfolder = (req, res) => {
  let data = req.body
  let date = new Date()
  let year = date.getFullYear() > 9 ? date.getFullYear() : "0" + date.getFullYear()
  let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
  let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate()
  let hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours()
  let min = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()
  let sec = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds()
  let uploadTime = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec
  let params = {
    file_name: data.file_name,
    hash_name: data.hash_name,
    upload_time: uploadTime,
    type: ".folder",
    size: -1,
    download: 0,
    uid: req.body.uid,
    path: data.path
  };
  File.create(params)
    .then(req => {
      if (req) {
        let msg = {
          flag: 1,
          msg: '新建文件夹成功!'
        };
        res.status(200).json(msg);
      } else {
        let msg = {
          flag: 0,
          msg: '新建文件夹失败,请稍后再试!'
        };
        res.status(500).json(msg);
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json('Error->' + err);
    });
};

//  删除文件
exports.delete = (req, res) => {
  let id = req.params.fileId;
  let fileName = req.params.fileName;
  if (/folder/.test(fileName)) {
    File.destroy({
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
  } else {
    File.destroy({
      where: { id: id }
    })
      .then(_ => {
        //  从资源文件夹从删除
        let path = `${__dirname}/../resource/${fileName}`;
        fs.unlink(path, err => {
          if (err) {
            let msg = {
              flag: 0,
              msg: '删除失败!'
            };
            res.status(200).json(msg);
          } else {
            let msg = {
              flag: 1,
              msg: '删除成功!'
            };
            res.status(200).json(msg);
          }
        });
      })
      .catch(err => {
        res.status(500).json('Error=>', err);
      });
  }
};

//  下载文件
exports.download = (req, res) => {
  // let ua = uaParser(req.headers['user-agent']);
  // if (/Classmate-Sun's Cloud/.test(ua.ua)) {
  let fileId = req.params.fileId;
  File.findByPk(fileId).then(file => {
    file
      .increment('download')
      .then(file => {
        let fileName = req.params.fileName;
        let file_Name = file.dataValues.file_name
        let path = `${__dirname}/../resource/${fileName}`;
        res.download(path, file_Name);
      })
      .catch(err => {
        res.status(500).json('Error=>', err);
      });
  });
  // } else {
  //   res.download(`${__dirname}/../下载错误.txt`, "下载错误.txt");
  // }
};

//  分享文件转存
exports.share = (req, res) => {
  let fileId = req.body.fileId;
  let uid = req.body.uid;
  File.findByPk(fileId).then(file => {
    if (uid * 1 === file.uid * 1) {
      let msg = {
        flag: 0,
        msg: '不可以转存自己分享的文件哦!'
      };
      res.status(200).json(msg);
    } else {
      let fileName = file.hash_name
      let path = `${__dirname}/../resource/${fileName}`;
      fs.copyFileSync(path, path + file.type)
      console.log(123123123)
      let date = new Date()
      let year = date.getFullYear() > 9 ? date.getFullYear() : "0" + date.getFullYear()
      let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
      let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate()
      let hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours()
      let min = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()
      let sec = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds()
      let uploadTime = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec
      let params = {
        file_name: file.file_name,
        hash_name: file.hash_name + file.type,
        upload_time: uploadTime,
        type: file.type,
        size: file.size,
        download: 0,
        uid: uid,
        path: "我的网盘"
      };
      File.create(params)
        .then(file => {
          if (file) {
            let msg = {
              flag: 1,
              msg: '文件转存成功!'
            };
            res.status(200).json(msg);
          } else {
            let msg = {
              flag: 0,
              msg: '文件转存失败,请稍后再试!'
            };
            res.status(200).json(msg);
          }
        })
        .catch(err => {
          console.log(err)
          res.status(500).json('Error->' + err);
        });
    }
  })
};

//  获取文件列表信息
exports.findAll = (req, res) => {
  File.findAll({
    where: { uid: req.body.uid, path: req.body.path }
  })
    .then(file => {
      let newFileList = sortArr(file)
      res.status(200).json(newFileList);
    })
    .catch(err => {
      res.status(500).json('Error=>', err);
    });
};

//  重命名
exports.reName = (req, res) => {
  File.findOne({
    where: {
      id: req.body.id
    }
  }).then(file => {
    if (file) {
      File.update(
        {
          file_name: req.body.file_Name + file.type.replace(/.folder/, "")
        },
        {
          where: {
            id: req.body.id
          }
        }
      ).then(() => {
        let oldPath = file.path + "/" + file.file_name
        let newPath = file.path + "/" + req.body.file_Name
        console.log(oldPath, newPath)
        File.update(
          {
            path: newPath
          },
          {
            where: {
              uid: req.body.uid, path: oldPath
            }
          }).then(() => {
            let msg = {
              flag: 1,
              msg: '重命名成功!'
            };
            res.status(200).json(msg);
          })
          .catch(() => { })
      })
        .catch(() => {
          let msg = {
            flag: 0,
            msg: '重命名失败!'
          };
          res.status(500).json('Error=>', err);
        })
    } else {
      let msg = {
        flag: 0,
        msg: '文件不存在!'
      };
      res.status(200).json(msg);
    }
  });
};

//  移动文件
exports.moveFile = (req, res) => {
  File.findOne({
    where: {
      id: req.body.id
    }
  }).then(file => {
    if (file) {
      File.update(
        {
          path: req.body.newPath
        },
        {
          where: {
            id: req.body.id,
            uid: req.body.uid
          }
        }
      ).then(() => {
        let msg = {
          flag: 1,
          msg: '重命名成功!'
        };
        res.status(200).json(msg);
      })
        .catch(() => {
          let msg = {
            flag: 0,
            msg: '重命名失败!'
          };
          res.status(500).json('Error=>', msg);
        })
    } else {
      let msg = {
        flag: 0,
        msg: '文件不存在!'
      };
      res.status(200).json(msg);
    }
  });
};

//  文件分类
exports.fileType = (req, res) => {
  if (req.body.type === "图片") {
    File.findAll({
      where: {
        [Op.or]: [
          {
            uid: req.body.uid, type: ".jpg"
          },
          {
            uid: req.body.uid, type: ".jpeg"
          },
          {
            uid: req.body.uid, type: ".png"
          },
          {
            uid: req.body.uid, type: ".bmp"
          },
          {
            uid: req.body.uid, type: ".gif"
          },
          {
            uid: req.body.uid, type: ".cdr"
          },
          {
            uid: req.body.uid, type: ".dwg"
          },
          {
            uid: req.body.uid, type: ".tiff"
          },
          {
            uid: req.body.uid, type: ".ico"
          }
        ]
      }
    })
      .then(file => {
        let newFileList = sortArr(file)
        res.status(200).json(newFileList);
      })
      .catch(err => {
        res.status(500).json('Error=>', err);
      });
  } else if (req.body.type === "音乐") {
    File.findAll({
      where: {
        [Op.or]: [
          {
            uid: req.body.uid, type: ".mp3"
          },
          {
            uid: req.body.uid, type: ".m3a"
          }
        ]
      }
    })
      .then(file => {
        let newFileList = sortArr(file)
        res.status(200).json(newFileList);
      })
      .catch(err => {
        res.status(500).json('Error=>', err);
      });
  } else if (req.body.type === "视频") {
    File.findAll({
      where: {
        [Op.or]: [
          {
            uid: req.body.uid, type: ".mp4"
          },
          {
            uid: req.body.uid, type: ".avi"
          },
          {
            uid: req.body.uid, type: ".mov"
          },
          {
            uid: req.body.uid, type: ".rmvb"
          },
          {
            uid: req.body.uid, type: ".wmv"
          },
          {
            uid: req.body.uid, type: ".m4v"
          }
        ]
      }
    })
      .then(file => {
        let newFileList = sortArr(file)
        res.status(200).json(newFileList);
      })
      .catch(err => {
        res.status(500).json('Error=>', err);
      });
  } else if (req.body.type === "文档") {
    File.findAll({
      where: {
        [Op.or]: [
          {
            uid: req.body.uid, type: ".doc"
          },
          {
            uid: req.body.uid, type: ".docx"
          },
          {
            uid: req.body.uid, type: ".pdf"
          },
          {
            uid: req.body.uid, type: ".xls"
          },
          {
            uid: req.body.uid, type: ".xlsx"
          },
          {
            uid: req.body.uid, type: ".ppt"
          },
          {
            uid: req.body.uid, type: ".pptx"
          },
          {
            uid: req.body.uid, type: ".txt"
          },
          {
            uid: req.body.uid, type: ".log"
          }
        ]
      }
    })
      .then(file => {
        let newFileList = sortArr(file)
        res.status(200).json(newFileList);
      })
      .catch(err => {
        res.status(500).json('Error=>', err);
      });
  } else if (req.body.type === "压缩") {
    File.findAll({
      where: {
        [Op.or]: [
          {
            uid: req.body.uid, type: ".zip"
          },
          {
            uid: req.body.uid, type: ".rar"
          },
          {
            uid: req.body.uid, type: ".7z"
          },
          {
            uid: req.body.uid, type: ".iso"
          },
          {
            uid: req.body.uid, type: ".dmg"
          }
        ]
      }
    })
      .then(file => {
        let newFileList = sortArr(file)
        res.status(200).json(newFileList);
      })
      .catch(err => {
        res.status(500).json('Error=>', err);
      });
  }
}

//文件夹打包
exports.packFails = (req, res) => {
  console.log(req.body.folderPath)
  let path1 = req.body.folderPath
  let path1Arr = path1.split("/")
  path1Arr.pop()
  let path2 = path1Arr.join("/")
  File.findAll({
    where: {
      path: { [Op.like]: `%${path1}%` }
    }
  })
    .then(file => {
      let date = new Date().getTime()
      file.forEach(item => {
        console.log("item", item.file_name)
        if (item.type == ".folder") {
          let dir = path.join(__dirname, `../打包文件/${date}/${item.path.replace(path2 + "/", "")}/${item.file_name}`)
          // console.log(dir)
          fs.ensureDir(dir, function (err) {
            if (err) {
              console.log("err1", err);
              res.status(500).json('Error=>', err);
            }
          })
        }
      });
      let errArr = []
      file.forEach(item => {
        if (item.type != ".folder") {
          let oldpath = path.join(__dirname, `../resource/${item.hash_name}`)
          let newpath = path.join(__dirname, `../打包文件/${date}/${item.path.replace(path2 + "/", "")}/${item.file_name}`)
          // console.log("oldpath", oldpath)
          // console.log("newpath", newpath)
          try {
            fs.copySync(oldpath, newpath)
          } catch (err) {
            errArr.push(err)
            console.error(err)
            res.status(500).json('Error=>', errArr.join(","));
          }
        }
      });
      if (errArr.length === 0) {
        let name = path1.split("/").pop()
        let zipdir = path.join(__dirname, `../打包文件/${date}/${name}`)
        compressing.zip.compressDir(zipdir, zipdir + ".zip")
          .then(() => {
            // res.download(zipdir + ".zip", name + ".zip");
            res.send(date + "/" + name + ".zip")
          })
          .catch(err => {
            console.error(err);
            res.status(500).json('Error=>', err);
          });
      } else {
        console.log(errArr)
        res.status(500).json('Error=>', err);
      }
    })
    .catch(err => {
      res.status(500).json('Error=>', err);
    });
}