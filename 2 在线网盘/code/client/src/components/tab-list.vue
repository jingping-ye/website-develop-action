<template>
  <div class="show">
    <base-header></base-header>
    <el-tabs v-model="activeName"
      @tab-click="handleClick"
      class="tab">
      <el-tab-pane label="上传文件"
        name="first">
        <upload-file></upload-file>
      </el-tab-pane>
      <el-tab-pane label="文件列表"
        name="second">
        <file-list></file-list>
      </el-tab-pane>
      <el-tab-pane label="修改密码"
        name="third">
        <user-set></user-set>
      </el-tab-pane>
    </el-tabs>
    <base-footer></base-footer>
  </div>
</template>

<script>
import BaseHeader from '../layout/header';
import BaseFooter from '../layout/footer';
import UploadFile from './file-upload';
import FileList from './file-list';
import userSet from './user-set';
export default {
  name: 'show',
  components: {
    BaseHeader,
    BaseFooter,
    UploadFile,
    FileList,
    userSet
  },
  data () {
    return { activeName: 'second' }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tab {
  min-height: 400px;
  padding: 20px 40px;
}
</style>
