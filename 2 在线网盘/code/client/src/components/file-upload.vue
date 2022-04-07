<template>
  <el-dialog
    title="上传文件"
    :visible.sync="dialogVisible"
    width="600px"
    :close-on-click-modal="true"
    :before-close="handleClose"
  >
    <div class="upbox">
      <el-upload
        drag
        multiple
        ref="upload"
        :action="hostUrl + '/file/add'"
        :auto-upload="false"
        :data="userInfo"
        :on-success="dealSuccess"
        :on-error="dealError"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <el-button
        style="margin: 15px auto 0"
        size="small"
        type="success"
        @click="submitUpload"
        >开始上传</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {
        uid: sessionStorage.getItem("uid"),
        path: "",
      },
      fileNum: 0,
      hostUrl: "",
    };
  },
  props: ["dialogVisible"],
  watch: {
    // upPath(oldValue, newValue) {
    //   if (newValue !== oldValue) {
    //     this.userInfo.path = newValue;
    //   }
    // },
  },
  methods: {
    setPath(path) {
      this.userInfo.path = path;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    dealSuccess() {
      this.$message.success("上传文件成功!");
      this.fileNum += 1;
      if (this.fileNum === this.$refs.upload.uploadFiles.length) {
        this.$emit("reGetFileList", this.userInfo.path);
        this.fileNum = 0;
        this.$refs.upload.clearFiles();
      }
    },
    dealError() {
      this.$message.error("上传文件失败,请重新上传!");
      this.$emit("reGetFileList", this.userInfo.path);
    },
    handleClose() {
      this.$emit("reGetFileList", this.userInfo.path);
    },
  },
  mounted() {
    let protocol = window.location.protocol; //协议
    let host = window.location.host; //主机
    this.hostUrl = `${protocol}//${host}`;
  },
};
</script>
<style scoped>
.upbox {
  width: 100%;
  text-align: center;
}
</style>
