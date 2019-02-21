<template>
  <el-dialog :visible.sync="dialogVisible"
    @closed="closedDialog">
    <div slot="title">
      <span class="title-name">图书信息</span>
      <el-button size="small"
        icon="el-icon-edit"
        round
        class="edit-btn"
        @click="editBookInfo">编辑</el-button>
    </div>
    <el-row>
      <el-col :span="4">
        <div class="label">名称</div>
      </el-col>
      <el-col :span="20">
        <span v-if="!isEdit">{{bookInfo.name}}</span>
        <el-input v-model="bookInfo.name"
          v-if="isEdit"
          size="medium"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">ISBN编号</div>
      </el-col>
      <el-col :span="20">
        <span v-if="!isEdit">{{bookInfo.isbn}}</span>
        <el-input v-if="isEdit"
          v-model="bookInfo.isbn"
          size="medium"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">作者</div>
      </el-col>
      <el-col :span="20">
        <span v-if="!isEdit">{{bookInfo.author}}</span>
        <el-input v-if="isEdit"
          v-model="bookInfo.author"
          size="medium"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">出版社</div>
      </el-col>
      <el-col :span="20">
        <span v-if="!isEdit">{{bookInfo.print}}</span>
        <el-input v-if="isEdit"
          v-model="bookInfo.print"
          size="medium"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="label">出版日期</div>
      </el-col>
      <el-col :span="20">
        <span v-if="!isEdit">{{bookInfo.publish_time}}</span>
        <el-date-picker v-if="isEdit"
          v-model="bookInfo.publish_time"
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
        <span v-if="!isEdit">{{bookInfo.intro}}</span>
        <el-input v-if="isEdit"
          type="textarea"
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
        <span v-if="!isEdit">{{bookInfo.remark}}</span>
        <el-input type="textarea"
          v-if="isEdit"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="bookInfo.remark"
          max-length="200">
        </el-input>
      </el-col>
    </el-row>
    <div slot="footer"
      class="dialog-footer"
      v-if="isEdit">
      <el-button @click="cancelEdit"
        size="medium">取 消</el-button>
      <el-button type="primary"
        @click="updateBookInfo"
        size="medium">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    bookId: {
      type: Number
    },
    visible: {
      type: Boolean
    }
  },
  watch: {
    visible: {
      handler (newV, oldV) {
        this.dialogVisible = newV
        if (this.dialogVisible) {
          this.getBookById()
        }
      }
    }
  },
  mounted () {},
  data () {
    return {
      dialogVisible: false,
      bookInfo: {},
      isEdit: false
    }
  },
  methods: {
    refreshBookInfo () {
      this.getBookById()
    },
    updateBookInfo () {
      this.$http
        .put(`/book/update/${this.bookId}`, this.bookInfo)
        .then(res => {
          console.log(this.$message)
          this.$message.success(res.data.msg)
          this.isEdit = false
          this.refreshBookInfo()
        })
        .catch(err => {
          console.log('err->', err)
          this.isEdit = false
        })
    },
    cancelEdit () {
      this.isEdit = false
    },
    resetData () {
      this.dialogVisible = false
      this.bookInfo = {}
      this.isEdit = false
    },
    closedDialog () {
      this.$emit('closedDialog')
      this.resetData()
    },
    getBookById () {
      this.$http
        .get(`/book/${this.bookId}`)
        .then(res => {
          this.bookInfo = res.data
        })
        .catch(err => {
          console.log('err->', err)
        })
    },
    editBookInfo () {
      this.isEdit = true
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
