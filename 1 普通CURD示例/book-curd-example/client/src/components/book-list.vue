<template>
  <div>
    <header>图书列表</header>
    <div class="container">
      <div class="operate-btn">
        <el-button @click="addBook"
          class="add-btn"
          size="medium">新增图书</el-button>
        <el-input placeholder="输入书名或者作者名进行搜索"
          v-model="searchInfo"
          class="search-input"
          size="medium"
          @keyup.enter.native="searchBook"
          @change="changeSearchInfo">
          <el-button slot="append"
            icon="el-icon-search"
            @click="searchBook"></el-button>
        </el-input>
      </div>
      <el-table :data="tableData"
        border
        style="width: 100%">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="name"
          label="图书名称"
          min-width="180px">
        </el-table-column>
        <el-table-column prop="isbn"
          label="ISBN编号"
          min-width="180px">
        </el-table-column>
        <el-table-column prop="author"
          label="作者"
          min-width="180px">
        </el-table-column>
        <el-table-column prop="print"
          label="出版社"
          min-width="180px">
        </el-table-column>
        <el-table-column prop="publish_time"
          label="出版日期"
          min-width="180px">
        </el-table-column>
        <el-table-column label="操作"
          min-width="200px">
          <template slot-scope="scope">
            <el-button size="mini"
              @click="handleDetail(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <book-detail :bookId="bookId"
      :visible="bookDetailVisible"
      @closedDialog="closedDetailDialog">
    </book-detail>
    <book-add :visible="bookAddVisible"
      @closedDialog="closeAddDialog"
      @addNewBook="addNewBook">
    </book-add>
  </div>
</template>
<script>
import BookDetail from './book-detail';
import BookAdd from './book-add';
export default {
  components: {
    BookDetail,
    BookAdd
  },
  mounted () {
    this.getBookList()
  },
  data () {
    return {
      tableData: [],
      bookId: null,
      bookDetailVisible: false,
      bookAddVisible: false,
      searchInfo: ''
    }
  },
  methods: {
    changeSearchInfo () {
      if (!this.searchInfo) {
        this.getBookList()
      }
    },
    searchBook () {
      let params = {
        searchInfo: this.searchInfo
      }
      this.$http
        .post('/book/search', params)
        .then(res => {
          this.tableData = res.data
        })
        .catch(err => {
          console.log('err=>', err)
        })
    },
    addNewBook (val) {
      this.bookId = val
      this.bookDetailVisible = true
    },
    addBook () {
      this.bookAddVisible = true
    },
    refreshBookList () {
      this.getBookList()
    },
    closeAddDialog () {
      this.bookAddVisible = false
      this.refreshBookList()
    },
    closedDetailDialog () {
      this.bookDetailVisible = false
      this.refreshBookList()
    },
    handleDelete (index, row) {
      this.$http
        .delete(`/book/delete/${row.id}`)
        .then(res => {
          this.$message.success(res.data.msg)
          this.refreshBookList()
        })
        .catch(err => {
          console.log('err=>', err)
        })
    },
    handleDetail (index, row) {
      this.bookId = row.id
      this.bookDetailVisible = true
    },
    getBookList () {
      this.$http
        .get('/book/list')
        .then(res => {
          this.tableData = res.data
        })
        .catch(err => {
          console.log('err->', err)
        })
    }
  }
}
</script>
<style scoped>
header {
  font-size: 36px;
  height: 60px;
  padding-top: 30px;
  padding-left: 40px;
  box-shadow: 0px 15px 10px -15px #ccc;
  margin-bottom: 10px;
}
.container {
  text-align: center;
  box-shadow: 0px -15px 10px -15px #ccc;
  padding: 30px;
}
.el-table {
  padding-top: 20px;
}
.operate-btn {
  text-align: right;
  margin-bottom: 10px;
}
.search-input {
  width: 280px;
}
.add-btn {
  float: left;
}
</style>
