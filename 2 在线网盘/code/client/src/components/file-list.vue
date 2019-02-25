<template>
  <div>
    <el-table :data="tableData"
      style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="lastName"
        label="文件名"
        width="180px">
      </el-table-column>
      <el-table-column prop="size"
        label="文件大小"
        width="180px">
      </el-table-column>
      <el-table-column prop="lastTime"
        label="上传时间"
        width="180px">
      </el-table-column>
      <el-table-column prop="download"
        label="下载次数"
        width="180px">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"
            @click="handleEdit(scope.$index, scope.row)">预览</el-button>
          <a :href="getFile(scope.row)">
            <el-button size="mini"
              type="info">下载</el-button>
          </a>
          <el-button size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      预览区
      <img :src="previewImage">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      previewImage: null
    }
  },
  methods: {
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    handleDownload (index, row) {
      let params = {
        filename: row.hashName
      }
      this.$http
        .post('file/download', params)
        .then(res => {
          // window.open('/download?foo=bar&xxx=yyy')
          let urlCreator = window.URL || window.webkitURL
          let imageUrl = urlCreator.createObjectURL(res)
          this.previewImage = imageUrl
        })
        .catch(err => {
          console.log(err)
        })
    },
    getFileList () {
      let params = {
        username: sessionStorage.getItem('username'),
        pageNum: 1
      }
      this.$http
        .post('/file/list', params)
        .then(res => {
          if (res.data.code === 0) {
            this.$message.error(res.data.msg)
          } else {
            console.log('res====', JSON.stringify(res))
            this.tableData = res.data
          }
          console.log(JSON.stringify(res))
        })
        .catch(err => {
          console.log(err)
        })
    },
    getFile (data) {
      return `http://localhost:8081/file/download?filename=${data.hashName}`
    }
  },
  mounted () {
    this.getFileList()
  }
}
</script>
