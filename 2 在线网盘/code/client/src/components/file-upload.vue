<template>
  <el-upload class="upload-demo"
    drag
    action="http://localhost:8081/file/upload"
    :data="userInfo"
    multiple>
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip"
      slot="tip">只能上传jpg/png文件，且不超过500kb</div>
  </el-upload>
</template>
<script>
export default {
  data () {
    return {
      userInfo: {
        uid: sessionStorage.getItem('uid'),
        username: sessionStorage.getItem('username')
      }
    }
  }
}
</script>
<style scoped>
</style>
