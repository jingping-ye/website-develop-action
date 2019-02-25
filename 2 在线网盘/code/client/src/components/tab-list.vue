<template>
  <div class="show">
    <base-header></base-header>
    <el-tabs v-model="activedName" class="tab">
      <el-tab-pane
        v-for="(item, index) in componentList"
        :key="index"
        :label="item.label"
        :name="item.name">
        <component :is="item.name" v-if="activedName===item.name"></component>
      </el-tab-pane>
    </el-tabs>
    <base-footer></base-footer>
  </div>
</template>

<script>
import BaseHeader from '../layout/header'
import BaseFooter from '../layout/footer'
import UploadFile from './file-upload'
import FileList from './file-list'
import userSet from './user-set'
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
    return {
      activedName: 'second',
      componentList: [
        {
          activeName: 'first',
          name: 'upload-file',
          label: '上传文件'
        },
        {
          activeName: 'second',
          name: 'file-list',
          label: '修改密码'
        },
        {
          activeName: 'user-set',
          name: 'user-set',
          label: '文件列表'
        }
      ]
    }
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tab {
  min-height: 400px;
  padding: 20px 40px;
}
</style>
