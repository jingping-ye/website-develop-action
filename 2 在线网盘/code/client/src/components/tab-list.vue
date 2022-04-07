<template>
  <div class="show">
    <base-header></base-header>
    <el-tabs
      v-model="tabActivedName"
      type="card"
      class="tab"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="(item, index) in componentList"
        :key="index"
        :label="item.tabLabel"
        :name="item.tabName"
      >
      </el-tab-pane>
    </el-tabs>
    <FileList v-if="tabActivedName === 'first'"></FileList>
    <userSet v-if="tabActivedName === 'third'"></userSet>
    <base-footer></base-footer>
  </div>
</template>

<script>
import BaseHeader from "../layout/header";
import BaseFooter from "../layout/footer";
import UploadFile from "./file-upload";
import FileList from "./file-list";
import userSet from "./user-set";

export default {
  name: "show",
  components: {
    BaseHeader,
    BaseFooter,
    UploadFile,
    FileList,
    userSet,
  },
  data() {
    return {
      path: "",
      tabActivedName: "first",
      componentList: [
        {
          tabName: "first",
          compoName: "file-list",
          tabLabel: "文件列表",
        },
        {
          tabName: "third",
          compoName: "user-set",
          tabLabel: "用户设置",
        },
      ],
      download: [],
    };
  },
  methods: {
    handleClick(tab, event) {
      this.tabActivedName = tab.name;
    },
    getDownloadList(list) {
      this.download = list;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tab {
  position: fixed;
  width: 1200px;
  left: 50%;
  top: 140px;
  background: #fff;
  z-index: 1999;
  transform: translateX(-50%);
}
</style>
