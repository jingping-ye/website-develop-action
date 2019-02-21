<template>
  <el-dialog :visible.sync="dialogVisible"
    @closed="closedDialog"
    min-width="360px">
    <div slot="title">
      <span class="title-name">
        <span>新增图书</span>
      </span>
    </div>
    <el-row>
      <el-col :span="4">
        <div class="label">名称</div>
      </el-col>
      <el-col :span="20">
        <el-input v-model="bookInfo.name"
          size="medium"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">ISBN编号</div>
      </el-col>
      <el-col :span="20">
        <el-input v-model="bookInfo.isbn"
          size="medium"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">作者</div>
      </el-col>
      <el-col :span="20">
        <el-input v-model="bookInfo.author"
          size="medium"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">出版社</div>
      </el-col>
      <el-col :span="20">
        <el-input v-model="bookInfo.print"
          size="medium"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">出版日期</div>
      </el-col>
      <el-col :span="20">
        <el-date-picker v-model="bookInfo.publish_time"
          type="date"
          placeholder="选择日期"
          size="medium">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">简介</div>
      </el-col>
      <el-col :span="20">
        <el-input type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="bookInfo.intro"
          max-length="200">
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">其他</div>
      </el-col>
      <el-col :span="20">
        <el-input type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="bookInfo.remark"
          max-length="200">
        </el-input>
      </el-col>
    </el-row>
    <div slot="footer"
      class="dialog-footer">
      <el-button @click="cancelEdit"
        size="medium">取 消</el-button>
      <el-button type="primary"
        @click="addBook"
        size="medium">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean
    }
  },
  watch: {
    visible: {
      handler (newV, oldV) {
        this.dialogVisible = newV
      }
    }
  },
  mounted () {},
  data () {
    return {
      dialogVisible: false,
      bookInfo: {}
    }
  },
  methods: {
    addBook () {
      this.$http
        .post('/book/add', this.bookInfo)
        .then(res => {
          this.$message.success(res.data.msg)
          let bookId = res.data.setTimeout(() => {
            this.$emit('addNewBook', bookId)
            this.closedDialog()
          }, 1000)
        })
        .catch(err => {
          console.log('err=>', err)
        })
    },
    cancelEdit () {
      this.closedDialog()
    },
    resetData () {
      this.dialogVisible = false
      this.bookInfo = {}
    },
    closedDialog () {
      this.$emit('closedDialog')
      this.resetData()
    }
  }
}
</script>
<style scoped>
.el-row {
  line-height: 40px;
  margin-top: 10px;
}
.label {
  font-weight: bold;
}
.edit-btn {
  margin-left: 10px;
}
.title-name {
  font-size: 30px;
}
.dialog-footer {
  text-align: center;
}
</style>
