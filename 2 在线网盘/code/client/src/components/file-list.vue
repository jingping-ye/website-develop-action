<template>
  <div v-clickoutside:outside="closebar" @click="closeRight">
    <el-dialog
      title="选择移动位置"
      :visible.sync="dialogFormVisible"
      width="600px"
      :show-close="false"
      class="moveDialog"
      ><div class="folderTree">
        <el-tree
          :data="moveFolderData"
          :props="defaultProps"
          accordion
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="moveFileNewFolder()" style="float: left"
          >新建文件夹</el-button
        >
        <el-button size="mini" @click="dialogMoveFileCancel()">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogMoveFileOk()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <context-menu
      class="right-menu"
      :target="contextMenuTarget"
      :style="{
        display: contextMenuVisible === true ? 'block' : 'none',
        top: mouse.y,
        left: mouse.x,
      }"
    >
      <a href="javascript:void(0);" @click="handleDownload(clickFile)">下载</a>
      <a
        href="javascript:;"
        @click="handleShare(clickFile.id, clickFile)"
        v-if="clickFile.type !== '.folder'"
        >分享</a
      >
      <a
        href="javascript:;"
        @click="moveFileBox(clickFile.id, clickFile)"
        v-if="clickFile.type !== '.folder'"
        >移动</a
      >
      <a href="javascript:;" @click="reFileNameBox(clickFile.id)">重命名</a>
      <a href="javascript:;" @click="handleDelete(clickFile.id, clickFile)"
        >删除</a
      >
    </context-menu>
    <div class="searchBox" style="margin-top: 15px">
      <el-input placeholder="请输入分享链接" v-model="searchUrl">
        <el-button
          class="searchDownload"
          slot="append"
          @click="checkMethod(b64(searchUrl), null, downloadList.length)"
          >获取文件</el-button
        >
      </el-input>
    </div>

    <!-- 
    * 分享链接 ==>增加弹出框:【仅下载，仅保存，保存至网盘并下载。】
    * 保存分享文件选择保存路径
    -->
    <el-dialog
      title="提示"
      :visible.sync="checkMethodBox"
      width="520px"
      :before-close="checkMethodBoxClose"
      :center="false"
      :close-on-click-modal="false"
    >
      <p
        style="font-size: 16px; text-align: left; line-height: 25px"
        key="checkMethodBox1"
      >
        请选择获取文件方式
      </p>
      <p
        style="font-size: 16px; text-align: left; line-height: 25px"
        key="checkMethodBox1"
      >
        (如需转存，建议转存文件大小在1.5GB之内。
      </p>
      <p
        style="font-size: 16px; text-align: left; line-height: 25px"
        key="checkMethodBox11"
      >
        如文件过大可能导致转存失败，可刷新后查看文件是否转存成功！)
      </p>
      <p
        slot="footer"
        class="dialog-footer"
        style="text-align: center"
        key="checkMethodBox2"
      >
        <el-button
          type="primary"
          @click="onlySaveCloud"
          :loading="checkMethodBoxState.btn1Sta"
          key="checkMethodBox3"
          >{{ checkMethodBoxState.btn1Text }}</el-button
        >
        <el-button
          type="primary"
          @click="onlySavePC"
          :loading="checkMethodBoxState.btn2Sta"
          key="checkMethodBox4"
          >{{ checkMethodBoxState.btn2Text }}</el-button
        >
        <el-button
          type="primary"
          @click="savePCAndCloud"
          :loading="checkMethodBoxState.btn3Sta"
          key="checkMethodBox5"
          >{{ checkMethodBoxState.btn3Text }}</el-button
        >
      </p>
    </el-dialog>

    <div class="fixedBox">
      <div class="leftNav">
        <div
          :class="{
            leftNavBtn: true,
            leftNavBtnClick: this.fileTypeClick === '全部',
          }"
          @click="findType('全部')"
        >
          <i class="el-icon-folder"></i>&nbsp;&nbsp;全部
        </div>
        <div
          :class="{
            leftNavBtn: true,
            leftNavBtnClick: this.fileTypeClick === '图片',
          }"
          @click="findType('图片')"
        >
          <i class="el-icon-picture-outline"></i>&nbsp;&nbsp;图片
        </div>
        <div
          :class="{
            leftNavBtn: true,
            leftNavBtnClick: this.fileTypeClick === '视频',
          }"
          @click="findType('视频')"
        >
          <i class="el-icon-film"></i>&nbsp;&nbsp;视频
        </div>
        <div
          :class="{
            leftNavBtn: true,
            leftNavBtnClick: this.fileTypeClick === '音乐',
          }"
          @click="findType('音乐')"
        >
          <i class="el-icon-service"></i>&nbsp;&nbsp;音乐
        </div>
        <div
          :class="{
            leftNavBtn: true,
            leftNavBtnClick: this.fileTypeClick === '文档',
          }"
          @click="findType('文档')"
        >
          <i class="el-icon-tickets"></i>&nbsp;&nbsp;文档
        </div>
        <div
          :class="{
            leftNavBtn: true,
            leftNavBtnClick: this.fileTypeClick === '压缩',
          }"
          @click="findType('压缩')"
        >
          <i class="el-icon-box"></i>&nbsp;&nbsp;压缩
        </div>
      </div>
      <div class="navBar">
        <div class="navB">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item, index) in path" :key="index"
              ><a @click="getPath(item, index)">{{ item }}</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              {{ nowfolder }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="view">
          <el-radio-group v-model="listType"
            ><span class="viewTip">视图：</span>
            <el-radio label="平铺"></el-radio>
            <el-radio label="列表"></el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="fileBox">
      <el-table
        v-if="listType === '列表'"
        :height="height"
        :data="tableData"
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
        style="width: 1015px; margin-left: 184px; margin-top: -50px; padding: 0"
      >
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="file_name" label="文件名" width="180px">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.type !== '.folder'"
              @click.native.prevent="gotofolder(scope.row)"
              type="text"
              size="small"
            >
              {{ scope.row.file_name }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="size"
          label="大小"
          width="130px"
          :formatter="dealSize"
        >
        </el-table-column>
        <el-table-column
          prop="upload_time"
          label="上传时间"
          width="170px"
          :formatter="dealTime"
        >
        </el-table-column>
        <el-table-column prop="download" label="下载次数" width="120px">
        </el-table-column>
        <el-table-column label="操作" min-width="350px">
          <template slot-scope="scope">
            <a href="javascript:void(0);">
              <el-button
                size="mini"
                type="success"
                @click="handleDownload(scope.row)"
                >下载</el-button
              >
            </a>
            <el-button
              size="mini"
              type="primary"
              @click="handleShare(scope.$index, scope.row)"
              :disabled="scope.row.type === '.folder'"
              >分享</el-button
            >
            <el-button
              size="mini"
              type="warning"
              @click="moveFileBox(scope.row.id, scope.row)"
              :disabled="scope.row.type === '.folder'"
              >移动</el-button
            >
            <el-button
              size="mini"
              type="info"
              @click="reFileNameBox(scope.row.id)"
              >重命名</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="infoBox outside" v-if="listType !== '列表'">
        <div class="infoBar outside" v-if="barFlag === 1">
          <p class="fs outside" v-if="clickFile.type !== '.folder'">
            大小：
            {{ clickFile.filesize }}
          </p>
          <p class="ft outside">
            上传时间：
            {{ clickFile.upload_time }}
          </p>
          <p class="fd outside" v-if="clickFile.type !== '.folder'">
            下载次数：
            {{ clickFile.download }}
          </p>
          <div class="fb outside">
            <a href="javascript:void(0);">
              <el-button
                size="mini"
                type="success"
                @click="handleDownload(clickFile)"
                >下载</el-button
              >
            </a>
            <el-button
              size="mini"
              type="primary"
              @click="handleShare(clickFile.id, clickFile)"
              :disabled="clickFile.type === '.folder'"
              >分享</el-button
            >
            <el-button
              size="mini"
              type="warning"
              @click="moveFileBox(clickFile.id, clickFile)"
              :disabled="clickFile.type === '.folder'"
              >移动</el-button
            >
            <el-button
              size="mini"
              type="info"
              @click="reFileNameBox(clickFile.id)"
              >重命名</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(clickFile.id, clickFile)"
              >删除</el-button
            >
          </div>
        </div>
      </div>
      <div class="listpp" v-if="listType === '平铺'">
        <div
          :class="{
            fileListpp: true,
            fileListppClick: item.id === clickFile.id,
          }"
          v-for="(item, i) in tableData"
          :key="item.id"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="item.file_name"
            placement="bottom"
            transition="el-zoom-in-top"
            :disabled="tooltipArr[i]"
          >
            <div
              class="clickBox"
              @click="infoBar(item)"
              @contextmenu.prevent="showRight(item)"
              @dblclick="openFile(item)"
              @mouseup="showPopup"
            >
              <div class="fileIcon outside">
                <img
                  class="icon"
                  width="256"
                  height="256"
                  :src="getIconType(item)"
                  :alt="item.file_name"
                />
              </div>
              <p style="-webkit-box-orient: vertical" class="fileName">
                {{ item.file_name }}
              </p>
            </div>
          </el-tooltip>

          <!-- 文件类型为MP3 -->
          <!-- @dblclick="dialogMp3Box(item)" -->

          <!-- 文件类型为MP4 -->
          <!-- @dblclick="dialogMovieBox(item)" -->

          <!-- 文件类型为文本文档 -->
          <!-- @dblclick="dialogTXTBox(item)" -->

          <!-- 文件类型为IMG -->
          <!-- @dblclick="dialogImageBox(item)" -->

          <!-- 文件类型为其他 -->
          <!-- @dblclick="dialogMessageBox()" -->

          <!-- 文件类型为文件夹 -->
          <!-- @dblclick="gotofolder(item)" -->
        </div>
        <div class="fileListpp" v-if="fileTypeClick === '全部'">
          <div class="clickBox" @click="showUpAlert()">
            <div class="fileIcon">
              <img
                class="icon"
                width="256"
                height="256"
                :src="`${hostUrl}/icon/up.png`"
                alt="上传文件"
              />
            </div>
            <p style="-webkit-box-orient: vertical" class="fileName">
              上传文件
            </p>
          </div>
        </div>
      </div>
    </div>
    <fileUpload
      ref="upFile"
      :dialogVisible="ifShowUpload"
      @reGetFileList="reGetFileList"
    ></fileUpload>

    <el-popover
      placement="bottom-end"
      width="300"
      trigger="click"
      popper-class="downloadListBox"
    >
      <div
        class="nofile"
        v-if="downloadList.length === 0"
        style="font-size: 18px; text-align: center"
      >
        没有正在下载的文件
      </div>
      <div class="havefile" v-if="downloadList.length !== 0">
        <div
          class="dllistitem"
          v-for="(item, index) in downloadList"
          :key="index"
          :style="item.v_if"
        >
          <p
            style="
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              line-height: 18px;
              font-size: 14.4px;
            "
          >
            {{ item.downloadFileName }}
          </p>
          <el-progress :percentage="item.percent"></el-progress>
          <a
            :href="item.newHerf"
            :download="item.downName"
            :class="{ canNotClick: item.disabled }"
            style="
              display: block;
              text-align: right;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              line-height: 19px;
              font-size: 14.4px;
              transform: translateY(-2px) translateX(-1px);
            "
            ><el-button
              size="mini"
              round
              type="primary"
              :disabled="item.disabled"
              >另存为</el-button
            ></a
          >
          <p
            style="
              text-align: right;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              line-height: 19px;
              font-size: 14.4px;
              margin-right: 3px;
            "
          >
            {{ dealSize({ size: item.loaded }) }}/{{
              dealSize({ size: item.total })
            }}
            {{ item.time }} {{ item.netSpeed }}/s
          </p>
        </div>
      </div>
      <div class="dllistbtn" @click="btnlist = !btnlist" slot="reference">
        <el-badge
          :value="dlFileNum"
          class="redDot"
          type="primary"
          :hidden="dlFileNum === 0"
        >
          <i class="el-icon-download"></i>
        </el-badge>
      </div>
      <!-- <el-button slot="reference">click 激活</el-button> -->
    </el-popover>
  </div>
</template>  

<script>
import Clickoutside from "element-ui/src/utils/clickoutside";
import fileUpload from "./file-upload";
import "xgplayer";
import Player from "xgplayer";
import PDFJS from "pdfjs-dist";
import { Base64 } from "js-base64";
import workerSrc from "pdfjs-dist/build/pdf.worker.entry";
PDFJS.workerSrc = workerSrc;

export default {
  directives: { Clickoutside },
  components: { fileUpload },
  data() {
    return {
      player: null,
      moveFolderData: [
        {
          label: "我的网盘",
          path: "/",
          children: [],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      tableData: [],
      listType: "平铺",
      barFlag: 2,
      clickFile: {},
      path: [],
      nowfolder: "我的网盘",
      newFilePath: "我的网盘",
      fileTypeClick: "全部",
      addfolderName: "",
      needMoveFileId: null,
      uid: 0,
      ifShowUpload: false,
      upPath: "",
      contextMenuTarget: document.querySelector(".listpp"), //绑定的dom
      contextMenuVisible: false,
      dialogFormVisible: false,
      mouse: {
        x: "0px",
        y: "0px",
      },
      fullHeight: document.documentElement.clientHeight,
      height: document.documentElement.clientHeight - 280,
      clickFolderData: null,
      hostUrl: "",
      downloadList: [],
      dlFileNum: 0,
      btnlist: false,
      searchUrl: "",
      checkMethodBox: false,
      shareUrl: {
        url: "",
        fileName: "",
        n: 0,
        fileID: "",
      },
      checkMethodBoxState: {
        btn1Sta: false,
        btn2Sta: false,
        btn3Sta: false,
        btn1Text: "仅保存至网盘",
        btn2Text: "仅下载至电脑",
        btn3Text: "保存并下载",
      },
      tooltipArr: [],
    };
  },
  watch: {
    fullHeight(val) {
      if (!this.timer) {
        this.fullHeight = val;
        this.timer = true;
        let that = this;
        setTimeout(function () {
          that.timer = false;
        }, 400);
      }
      this.height = this.fullHeight - 280;
    },
    tableData() {
      this.$nextTick(() => {
        /*现在数据已经渲染完毕*/
        let fileNameArr = document.querySelectorAll(".fileName");
        this.tooltipArr = [];
        fileNameArr.forEach((item, index) => {
          let cHeight = item.clientHeight;
          let sHeight = item.scrollHeight;
          if (sHeight > cHeight) {
            this.tooltipArr.push(false);
          } else {
            this.tooltipArr.push(true);
          }
        });
      });
    },
  },
  methods: {
    checkMethodBoxClose(done) {
      done();
      this.searchUrl = "";
    },
    onlySaveCloud() {
      this.checkMethodBoxState.btn1Sta = true;
      this.checkMethodBoxState.btn1Text = "文件转存中";
      // alert("暂未开通");
      let params = {
        fileId: this.shareUrl.fileID,
        uid: this.uid,
      };
      this.$http
        .post(`${this.hostUrl}/file/share`, params)
        .then((res) => {
          if (res.data.flag === 0) {
            this.$message.error(res.data.msg);
            this.shareUrl = {
              url: "",
              fileName: "",
              n: 0,
              fileID: "",
            };
            this.checkMethodBox = false;
            this.searchUrl = "";
            this.checkMethodBoxState.btn1Sta = false;
            this.checkMethodBoxState.btn1Text = "仅保存至网盘";
          } else {
            this.$message.success(res.data.msg);
            this.shareUrl = {
              url: "",
              fileName: "",
              n: 0,
              fileID: "",
            };
            this.checkMethodBox = false;
            this.searchUrl = "";
            this.checkMethodBoxState.btn1Sta = false;
            this.checkMethodBoxState.btn1Text = "仅保存至网盘";
            let path = "";
            if (this.path.length === 0) {
              path = this.nowfolder;
            } else {
              path = this.path.join("/") + "/" + this.nowfolder;
            }
            this.$refs.upFile.setPath(path);
            this.refreshFileList(path);
            this.closebar();
          }
        })
        .catch((err) => {
          console.log(err);
          this.shareUrl = {
            url: "",
            fileName: "",
            n: 0,
            fileID: "",
          };
          this.checkMethodBox = false;
          this.searchUrl = "";
          this.checkMethodBoxState.btn1Sta = false;
          this.checkMethodBoxState.btn1Text = "仅保存至网盘";
        });
    },
    onlySavePC() {
      this.downlodFile(
        this.shareUrl.url,
        this.shareUrl.fileName,
        this.shareUrl.n
      );
      this.shareUrl = {
        url: "",
        fileName: "",
        n: 0,
        fileID: "",
      };
      this.checkMethodBox = false;
      this.searchUrl = "";
    },
    savePCAndCloud() {
      this.checkMethodBoxState.btn3Sta = true;
      this.checkMethodBoxState.btn3Text = "文件转存中";
      let params = {
        fileId: this.shareUrl.fileID,
        uid: this.uid,
      };
      this.$http
        .post(`${this.hostUrl}/file/share`, params)
        .then((res) => {
          if (res.data.flag === 0) {
            this.$message.error(res.data.msg);
            this.shareUrl = {
              url: "",
              fileName: "",
              n: 0,
              fileID: "",
            };
            this.checkMethodBox = false;
            this.searchUrl = "";
            this.checkMethodBoxState.btn3Sta = false;
            this.checkMethodBoxState.btn3Text = "保存并下载";
          } else {
            this.$message.success(res.data.msg);
            let path = "";
            if (this.path.length === 0) {
              path = this.nowfolder;
            } else {
              path = this.path.join("/") + "/" + this.nowfolder;
            }
            this.$refs.upFile.setPath(path);
            this.refreshFileList(path);
            this.closebar();
            this.onlySavePC();
            this.shareUrl = {
              url: "",
              fileName: "",
              n: 0,
              fileID: "",
            };
            this.checkMethodBox = false;
            this.searchUrl = "";
            this.checkMethodBoxState.btn3Sta = false;
            this.checkMethodBoxState.btn3Text = "保存并下载";
          }
        })
        .catch((err) => {
          console.log(err);
          this.shareUrl = {
            url: "",
            fileName: "",
            n: 0,
            fileID: "",
          };
          this.checkMethodBox = false;
          this.searchUrl = "";
          this.checkMethodBoxState.btn3Sta = false;
          this.checkMethodBoxState.btn3Text = "保存并下载";
        });
    },
    retime(loaded, total, num) {
      let time = (total - loaded) / num;
      if (time < 60) {
        return `预计剩余${time.toFixed(0)}秒 `;
      } else if (time < 60 * 60) {
        return `预计剩余${(time / 60).toFixed(0)}分钟`;
      } else if (time < 60 * 60 * 60) {
        return `预计剩余${(time / 60 / 60).toFixed(0)}小时`;
      } else if (time < 60 * 60 * 60 * 24) {
        return `预计剩余时间大于1天`;
      }
    },
    ddownload(url, fileName, n) {
      this.dlFileNum++;
      this.downloadList[n] = {
        url: "",
        netSpeed: "0Kb",
        netvindex: 0,
        loaded: 0,
        total: 0,
        oldn: 0,
        downloadFileName: "",
        percent: 0,
        disabled: true,
        newHerf: "",
        downName: "",
        time: "预计剩余",
        v_if: { display: "block" },
      };
      // this.downloadList[n].url = url;
      this.$set(this.downloadList[n], "v_if", { display: "block" });
      this.$set(this.downloadList[n], "url", url);
      this.$forceUpdate();
      this.$message.success("已添加到下载列表！");
      //this.downloadList[n].netSpeed = "0Kb";
      this.$set(this.downloadList[n], "netSpeed", "0Kb");
      this.$forceUpdate();
      this.downloadList[n].netvindex = setInterval(() => {
        let dlNum = this.downloadList[n].loaded - this.downloadList[n].oldn;
        let speed = this.dealSize({ size: dlNum });
        let time = this.retime(
          this.downloadList[n].loaded,
          this.downloadList[n].total,
          dlNum
        );
        //this.downloadList[n].netSpeed = speed;
        this.$set(this.downloadList[n], "netSpeed", speed);
        this.$forceUpdate();
        this.$set(this.downloadList[n], "time", time);
        this.$forceUpdate();
        //this.downloadList[n].oldn = this.downloadList[n].loaded;
        this.$set(this.downloadList[n], "oldn", this.downloadList[n].loaded);
        this.$forceUpdate();
      }, 1000);
      //this.downloadList[n].downloadFileName = fileName;
      if (fileName) {
        this.$set(this.downloadList[n], "downloadFileName", fileName);
        this.$forceUpdate();
      } else {
        let name = url.substring(60, url.length);
        this.$set(this.downloadList[n], "downloadFileName", name);
        this.$forceUpdate();
      }
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.send(null);
      // 设置服务端的响应类型
      xhr.responseType = "blob";
      // 监听下载
      xhr.addEventListener("progress", (event) => {
        let v_if = this.downloadList[n].v_if.display;
        if (v_if === "none") {
          xhr.abort();
        }

        this.$set(this.downloadList[n], "total", event.total);
        this.$forceUpdate();
        // 计算出百分比
        const percent = (event.loaded / event.total) * 100;
        //this.downloadList[n].loaded = event.loaded;
        this.$set(this.downloadList[n], "loaded", event.loaded);
        this.$forceUpdate();
        // test.value = percent;
        // test1.innerHTML = percent;
        //this.downloadList[n].percent = percent.toFixed(2);
        this.$set(this.downloadList[n], "percent", percent.toFixed(2));
        this.$forceUpdate();
        if (percent === 100) {
          this.$message.success("文件下载完成！");
          this.dlFileNum--;

          setTimeout(() => {
            this.$set(this.downloadList[n], "netSpeed", "0Kb");
            this.$set(this.downloadList[n], "time", "已完成");
            this.$forceUpdate();
            clearInterval(this.downloadList[n].netvindex);
          }, 1000);
        }
      });
      xhr.onreadystatechange = (event) => {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            // 获取ContentType
            const contentType = xhr.getResponseHeader("Content-Type");
            let getfileName = decodeURI(
              xhr
                .getResponseHeader("Content-Disposition")
                .replace("attachment; filename=", "")
            );
            if (/\;/.test(getfileName)) {
              getfileName = getfileName
                .split(";")[1]
                .replace(" filename*=UTF-8''", "");
            } else {
              getfileName = getfileName.split('"')[1];
            }
            this.$set(this.downloadList[n], "downloadFileName", getfileName);
            this.$forceUpdate();

            // 创建一个a标签用于下载
            // const donwLoadLink = document.createElement("a");
            // donwLoadLink.download = getfileName;
            // donwLoadLink.href = URL.createObjectURL(xhr.response);

            this.$set(
              this.downloadList[n],
              "newHerf",
              URL.createObjectURL(xhr.response)
            );
            this.$set(this.downloadList[n], "downName", getfileName);
            this.$set(this.downloadList[n], "disabled", false);
            this.$forceUpdate();
            // // 触发下载事件，IO到磁盘
            // donwLoadLink.click();

            // // 释放内存中的资源
            // URL.revokeObjectURL(donwLoadLink.href);
          } else if (response.status == 404) {
            alert(`文件不存在`);
            this.downloadList[n].percent = 0;
            this.downloadList[n].loaded = 0;
            clearInterval(this.downloadList[n].netvindex);
            downloadList.splice(n, 1);
          } else if (response.status == 500) {
            alert("系统异常");
            this.downloadList[n].percent = 0;
            this.downloadList[n].loaded = 0;
            clearInterval(this.downloadList[n].netvindex);
            downloadList.splice(n, 1);
          }
        }
      };
    },
    ifNoFile(url, fileName, n) {
      for (let i = 0; i < this.downloadList.length; i++) {
        if (this.downloadList[i].url === url) {
          this.$alert(`此文件已在下载列表中，是否重新下载文件？`, `提示`, {
            dangerouslyUseHTMLString: true,
            showConfirmButton: true,
            showCancelButton: true,
            closeOnClickModal: false,
            lockScroll: false,
            callback: (action) => {
              if (action === "confirm") {
                for (let j = i; j < this.downloadList.length; j++) {
                  if (this.downloadList[j].url === url) {
                    if (this.downloadList[j].v_if.display === "block") {
                      this.$set(this.downloadList[j], "v_if", {
                        display: "none",
                      });
                      this.$forceUpdate();
                      if (this.downloadList[j].time !== "已完成") {
                        this.dlFileNum--;
                      }
                    }
                  }
                }
                this.ddownload(url, fileName, n);
              }
            },
          });
          return false;
        }
      }
      return true;
    },
    b64(text) {
      if (!/#Classmate-Sun's Cloud 专用分享链接#/.test(text)) {
        this.$message.error("请输入正确的分享链接！！");
        return false;
      }
      let url = text.replace(/#Classmate-Sun's Cloud 专用分享链接#/, "");
      let reg =
        /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
      if (!reg.test(url)) {
        this.$message.error("请输入正确的分享链接！！");
        return false;
      }
      let newText = decodeURIComponent(window.atob(url)); //.replace(//,"");
      //134/9b7a70bd9df3612134b6c79dd9c4d927.log
      if (!/\//.test(newText)) {
        this.$message.error("请输入正确的分享链接！！");
        return false;
      }
      this.shareUrl.fileID = newText.split("/")[0];
      let newUrl = "http://b2838339y2.qicp.vip:8105/file/download/" + newText;
      return newUrl;
    },
    downlodFile(url, fileName, n) {
      if (url === false) {
        return;
      }
      this.searchUrl = "";
      if (this.downloadList.length === 0) {
        this.ddownload(url, fileName, n);
      } else {
        if (this.ifNoFile(url, fileName, n)) {
          this.ddownload(url, fileName, n);
        }
      }
    },
    checkMethod(url, fileName, n) {
      if (url === false) {
        return;
      } else {
        this.shareUrl.url = url;
        this.shareUrl.fileName = fileName;
        this.shareUrl.n = n;
        this.checkMethodBox = true;
      }
    },
    judgType(type) {
      let filetype = type.toLowerCase();
      if (filetype === ".folder") {
        return "folder";
      } else if (
        filetype === ".jpg" ||
        filetype === ".jpeg" ||
        filetype === ".png" ||
        filetype === ".tiff" ||
        filetype === ".bmp" ||
        filetype === ".gif" ||
        filetype === ".ico"
      ) {
        return "img";
      } else if (
        filetype === ".crt" ||
        filetype === ".pem" ||
        filetype === ".url" ||
        filetype === ".vue" ||
        filetype === ".cfg" ||
        filetype === ".config" ||
        filetype === ".ini" ||
        filetype === ".zpl" ||
        filetype === ".txt" ||
        filetype === ".html" ||
        filetype === ".htm" ||
        filetype === ".asp" ||
        filetype === ".jsp" ||
        filetype === ".xml" ||
        filetype === ".json" ||
        filetype === ".properties" ||
        filetype === ".md" ||
        filetype === ".gitignore" ||
        filetype === ".log" ||
        filetype === ".java" ||
        filetype === ".py" ||
        filetype === ".c" ||
        filetype === ".cpp" ||
        filetype === ".sql" ||
        filetype === ".sh" ||
        filetype === ".bat" ||
        filetype === ".m" ||
        filetype === ".bas" ||
        filetype === ".prg" ||
        filetype === ".cmd" ||
        filetype === ".css" ||
        filetype === ".js"
      ) {
        return "TEXT";
      } else if (filetype === ".mp3") {
        return "MP3";
      } else if (filetype === ".mp4") {
        return "MP4";
      } else if (
        filetype === ".wav" ||
        filetype === ".flv" ||
        filetype === ".m3u8" ||
        filetype === ".ts"
      ) {
        return "Media";
      } else if (filetype === ".pdf") {
        return "PDF";
      } else if (
        filetype === ".docx" ||
        filetype === ".doc" ||
        filetype === ".xlsx" ||
        filetype === ".xls"
      ) {
        return "OFFICE";
      } else if (filetype === ".ppt" || filetype === ".pptx") {
        return "PPT";
      } else if (
        filetype === ".zip" ||
        filetype === ".rar" ||
        filetype === ".jar" ||
        filetype === ".gzip" ||
        filetype === ".7z"
      ) {
        return "ZIP";
      } else {
        return "其他";
      }
    },
    base64Encode(url) {
      let newurl = Base64.encode(url);
      return newurl;
    },
    openFile(file) {
      if (this.judgType(file.type) === "img") {
        this.dialogImageBox(file);
      } else if (this.judgType(file.type) === "TEXT") {
        this.dialogTXTBox(file);
      } else if (this.judgType(file.type) === "folder") {
        this.gotofolder(file);
      } else if (this.judgType(file.type) === "MP3") {
        this.dialogMp3Box(file);
      } else if (this.judgType(file.type) === "MP4") {
        this.dialogMovieBox(file);
      } else if (this.judgType(file.type) === "Media") {
        this.dialogMediaBox(file);
      } else if (this.judgType(file.type) === "PDF") {
        this.dialogPDFBox(file);
      } else if (this.judgType(file.type) === "OFFICE") {
        this.dialogOFFICEBox(file);
      } else if (this.judgType(file.type) === "PPT") {
        this.dialogPPTBox(file);
      } else if (this.judgType(file.type) === "ZIP") {
        this.dialogZIPBox(file);
      } else if (this.judgType(file.type) === "其他") {
        this.dialogMessageBox();
      }
    },
    dialogOFFICEBox(item) {
      let kkurl = this.hostUrl.replace("8081", "8012");
      // console.log(kkurl)
      let fileurl = `${this.hostUrl}/file/download/${item.id}/${item.hash_name}`;
      // console.log(fileurl)
      let src = `${kkurl}/onlinePreview?url=${encodeURIComponent(
        this.base64Encode(fileurl)
      )}`;
      //http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url))
      // console.log(src)
      this.$alert(
        `<div id="office${item.id}" style="width:1150px;height:0px;padding:0;"><iframe style="width:965px;height:630px;margin:0 auto;" src="${src}"></iframe></div>`,
        `${item.file_name}`,
        {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          customClass: "messageWordBoxClass",
          closeOnClickModal: false,
          lockScroll: false,
          callback: (action) => {
            this.clickFile.id = item.id;
            // let box = document.getElementById(`office${item.id}`);
            // if (box != null) box.parentNode.removeChild(box);
          },
        }
      );
    },
    dialogZIPBox(item) {
      let kkurl = this.hostUrl.replace("8081", "8012");
      // console.log(kkurl)
      let fileurl = `${this.hostUrl}/file/download/${item.id}/${item.hash_name}`;
      // console.log(fileurl)
      let src = `${kkurl}/onlinePreview?url=${encodeURIComponent(
        this.base64Encode(fileurl)
      )}`;
      //http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url))
      // console.log(src)
      this.$alert(
        `<div id="zip${item.id}" style="width:100%;height:630px;padding:0;"><iframe style="width:100%;height:600px;margin:0 auto;" src="${src}"></iframe></div>`,
        `${item.file_name}`,
        {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          customClass: "messageZIPBoxClass",
          closeOnClickModal: false,
          lockScroll: false,
          callback: (action) => {
            this.clickFile.id = item.id;
            // let box = document.getElementById(`zip${item.id}`);
            // if (box != null) box.parentNode.removeChild(box);
          },
        }
      );
    },
    dialogPPTBox(item) {
      let kkurl = this.hostUrl.replace("8081", "8012");
      // console.log(kkurl)
      let fileurl = `${this.hostUrl}/file/download/${item.id}/${item.hash_name}`;
      // console.log(fileurl)
      let src = `${kkurl}/onlinePreview?url=${encodeURIComponent(
        this.base64Encode(fileurl)
      )}`;
      //http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url))
      // console.log(src)
      this.$alert(
        `<div id="pptshow${item.id}" style="width:1150px;height:0px;padding:0;"><iframe style="width:1150px;height:600px;margin:0 auto;" src="${src}"></iframe></div>`,
        `${item.file_name}`,
        {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          customClass: "messagePPTBoxClass",
          closeOnClickModal: false,
          lockScroll: false,
          callback: (action) => {
            this.clickFile.id = item.id;
            // let box = document.getElementById(`pptshow${item.id}`);
            // if (box != null) box.parentNode.removeChild(box);
          },
        }
      );
    },
    dialogTXTBox(item) {
      let kkurl = this.hostUrl.replace("8081", "8012");
      // console.log(kkurl)
      let fileurl = `${this.hostUrl}/file/download/${item.id}/${item.hash_name}`;
      // console.log(fileurl)
      let src = `${kkurl}/onlinePreview?url=${encodeURIComponent(
        this.base64Encode(fileurl)
      )}`;
      //http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url))
      // console.log(src)
      this.$alert(
        `<div id="text${item.id}" style="width:570px;height:630px;padding:0;"><iframe style="width:100%;height:600px;margin:0 auto;" src="${src}"></iframe></div>`,
        `${item.file_name}`,
        {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          customClass: "messageTextBoxClass",
          closeOnClickModal: false,
          lockScroll: false,
          callback: (action) => {
            this.clickFile.id = item.id;
            // let box = document.getElementById(`text${item.id}`);
            // if (box != null) box.parentNode.removeChild(box);
          },
        }
      );
    },
    dialogMediaBox(item) {
      let kkurl = this.hostUrl.replace("8081", "8012");
      // console.log(kkurl)
      let fileurl = `${this.hostUrl}/file/download/${item.id}/${item.hash_name}`;
      // console.log(fileurl)
      let src = `${kkurl}/onlinePreview?url=${encodeURIComponent(
        this.base64Encode(fileurl)
      )}`;
      this.$alert(
        `<div id="media${item.id}" style="width:100%;height:500px;padding:0;"><iframe style="width:100%;height:500px;margin:0 auto;" src="${src}"></iframe></div>`,
        `${item.file_name}`,
        {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          customClass: "messageMediaBoxClass",
          closeOnClickModal: false,
          lockScroll: false,
          callback: (action) => {
            let box = document.getElementById(`media${item.id}`);
            if (box != null) {
              let ifr = box.firstChild;
              let ifrLink = ifr.src;
              ifr.setAttribute("src", ifrLink);
            }
          },
        }
      );
    },
    dialogMovieBox(item) {
      this.$alert(`<div id="movie${item.id}"></div>`, `${item.file_name}`, {
        dangerouslyUseHTMLString: true,
        showConfirmButton: false,
        customClass: "messageMp4BoxClass",
        closeOnClickModal: false,
        lockScroll: false,
        callback: (action) => {
          if (action === "cancel") {
            this.player.destroy(true);
            this.player = null;
            // let box = document.getElementById(`movie${item.id}`);
            // if (box != null) box.parentNode.removeChild(box);
          }
        },
      });
      setTimeout(() => {
        this.player = new Player({
          id: `movie${item.id}`,
          autoplay: true,
          volume: 1,
          url: `${this.hostUrl}/file/download/${item.id}/${item.hash_name}`,
          playsinline: true,
          screenShot: true,
          playbackRate: [0.5, 1, 1.5, 2, 3],
          download: false,
          keyShortcut: "on",
          width: 1070,
          height: 600,
        });
      }, 300);
    },
    dialogPDFBox(item) {
      console.log(item);
      this.$alert(
        `<div id="pdfshow${item.id}" style="width:965px;height:630px;padding:0;"><iframe style="width:965px;height:630px;margin:0 auto;" src="${this.hostUrl}/pdf/web/viewer.html?file=${this.hostUrl}/file/download/${item.id}/${item.hash_name}"></iframe></div>`,
        `${item.file_name}`,
        {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          customClass: "messagePDFBoxClass",
          closeOnClickModal: false,
          lockScroll: false,
          callback: (action) => {
            // let box = document.getElementById(`pdfshow${item.id}`);
            // if (box != null) box.parentNode.removeChild(box);
          },
        }
      );
    },
    dialogMp3Box(item) {
      this.$alert(
        `<audio id="music${item.id}" src="${this.hostUrl}/file/download/${item.id}/${item.hash_name}" style="margin:0 auto;width:470px;" controls="controls" autoplay=true;>您的浏览器不支持在线播放！请先下载该资源！</audio>`,
        `${item.file_name}`,
        {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          customClass: "messageMp3BoxClass",
          closeOnClickModal: false,
          lockScroll: false,
          callback: (action) => {
            if (action === "cancel") {
              document.querySelector(`#music${item.id}`).pause();
              // let box = document.getElementById(`music${item.id}`);
              // if (box != null) box.parentNode.removeChild(box);
            }
          },
        }
      );
    },
    dialogImageBox(item) {
      this.$alert(
        `<img src="${this.hostUrl}/file/download/${item.id}/${item.hash_name}" alt="${item.file_name}" style="margin:0 auto;width:1170px;height:600px;object-fit: scale-down;">`,
        `${item.file_name}`,
        {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          customClass: "messageBoxClass",
          closeOnClickModal: true,
          lockScroll: false,
          callback: (action) => {},
        }
      );
    },
    dialogMessageBox() {
      this.$alert("请下载后查看！", "提示", {
        confirmButtonText: "确定",
        lockScroll: false,
        callback: (action) => {},
      });
    },
    findType(type) {
      this.fileTypeClick = type;
      this.path = [];
      this.closebar();
      this.nowfolder = "我的网盘";
      if (type === "全部") {
        this.getFileList("我的网盘");
        this.$refs.upFile.setPath("我的网盘");
      } else {
        let params = {
          uid: sessionStorage.getItem("uid"),
          type: type,
        };
        this.$http
          .post(`${this.hostUrl}/file/fileType`, params)
          .then((res) => {
            if (res.data.code === 0) {
              this.$message.error(res.data.msg);
            } else {
              this.tableData = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    moveFileNewFolder() {
      this.$prompt("请输入文件夹名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          if (value) {
            this.addfolder({
              file_name: value,
              path: this.newFilePath,
              uid: this.uid,
              hash_name: "folder" + new Date().getTime(),
            });
            this.handleNodeClick(this.clickFolderData);
          } else {
            this.$message.error("文件名禁止为空");
          }
        })
        .catch(() => {});
    },
    handleNodeClick(data) {
      if (data) {
        this.clickFolderData = data;
        let path = "";
        if (data.path === "/") {
          path = data.label;
        } else {
          path = data.path;
        }
        this.getfolderList(path, data);
      } else {
        this.$message.error("请先选择文件夹！");
      }
    },
    getfolderList(path, data) {
      this.newFilePath = path;
      let params = {
        uid: sessionStorage.getItem("uid"),
        path: path,
      };
      this.$http
        .post(`${this.hostUrl}/file/list`, params)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.error(res.data.msg);
          } else {
            let fileList = res.data;
            let newFolderData = [];
            for (let i = 0; i < fileList.length; i++) {
              if (fileList[i].type === ".folder") {
                newFolderData.push({
                  label: fileList[i].file_name,
                  path: fileList[i].path + "/" + fileList[i].file_name,
                  children: [],
                });
              }
              data.children = newFolderData;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getIconType(item) {
      let type = item.type.replace(/./, "").toLowerCase();
      let iconType = "";
      let test =
        /^aep$|^ai$|^avi$|^cdr$|^crt$|^css$|^dmg$|^doc$|^docx$|^dwg$|^eps$|^exe$|^folder$|^gif$|^html$|^ipa$|^iso$|^jpeg$|^jpg$|^js$|^json$|^log$|^mov$|^mp3$|^mp4$|^new$|^pdf$|^php$|^png$|^ppt$|^pptx$|^psd$|^rar$|^ttf$|^txt$|^url$|^vue$|^xls$|^xlsx$|^zip$|^bmp$|^raw$|^tiff$|^xml$/;
      if (test.test(type)) {
        iconType = `${this.hostUrl}/icon/${type}.png`;
      } else {
        iconType = `${this.hostUrl}/icon/unk.png`;
      }
      return iconType;
    },
    reGetFileList(path) {
      this.ifShowUpload = false;
      this.refreshFileList(path);
      this.closebar();
    },
    addfolder(addfolderName) {
      if (addfolderName !== "") {
        this.$http
          .post(`${this.hostUrl}/file/addfolder`, addfolderName)
          .then((res) => {
            if (res.data.flag === 0) {
              this.$message.error(res.data.msg);
            } else {
              this.$message.success(res.data.msg);
              let path = "";
              if (this.path.length === 0) {
                path = this.nowfolder;
              } else {
                path = this.path.join("/") + "/" + this.nowfolder;
              }
              this.$refs.upFile.setPath(path);
              this.refreshFileList(path);
              this.closebar();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$message.error("文件名禁止为空");
      }
    },
    showUpAlert() {
      this.ifShowUpload = false;
      this.$confirm("选择建立文件夹或上传文件", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "上传文件",
        cancelButtonText: "新建文件夹",
        type: "info",
        center: true,
      })
        .then(() => {
          this.ifShowUpload = true;
        })
        .catch((action) => {
          this.ifShowUpload = false;
          if (action !== "cancel") {
            return;
          } else {
            this.$prompt("请输入文件夹名称", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
            })
              .then(({ value }) => {
                if (value) {
                  let upPath = "";
                  if (this.path.length === 0) {
                    upPath = this.nowfolder;
                  } else {
                    upPath = this.path.join("/") + "/" + this.nowfolder;
                  }
                  this.addfolder({
                    file_name: value,
                    path: upPath,
                    uid: this.uid,
                    hash_name: "folder" + new Date().getTime(),
                  });
                } else {
                  this.$message.error("文件名禁止为空");
                }
              })
              .catch(() => {});
          }
        });
    },
    getPath(item, index) {
      let num = this.path.length;
      this.path.splice(index, num - index);
      this.nowfolder = item;
      let path = "";
      if (this.path.length === 0) {
        path = this.nowfolder;
      } else {
        path = this.path.join("/") + "/" + this.nowfolder;
      }
      this.$refs.upFile.setPath(path);
      this.refreshFileList(path);
      this.closebar();
    },
    gotofolder(item) {
      this.path = item.path.split("/");
      this.nowfolder = item.file_name;
      let path = "";
      if (this.path.length === 0) {
        path = this.nowfolder;
      } else {
        path = this.path.join("/") + "/" + this.nowfolder;
      }
      this.$refs.upFile.setPath(path);
      this.refreshFileList(path);
      this.closebar();
    },
    closebar() {
      this.barFlag = 2;
      this.clickFile = {};
    },
    infoBar(item) {
      this.barFlag = 1;
      this.clickFile = item;
      this.clickFile.filesize = this.dealSize({ size: item.size * 1 });
      this.clickFile.downloadUrl = `${this.hostUrl}/file/download/${item.id}/${item.hash_name}`;
      this.contextMenuVisible = false;
    },
    showRight(item) {
      this.barFlag = 1;
      this.clickFile = item;
      this.clickFile.filesize = this.dealSize({ size: item.size * 1 });
      this.clickFile.downloadUrl = `${this.hostUrl}/file/download/${item.id}/${item.hash_name}`;
      this.contextMenuVisible = true;
    },
    closeRight() {
      this.contextMenuVisible = false;
    },
    showPopup(e) {
      this.mouse.x = e.clientX + 1 + "px";
      this.mouse.y = e.clientY + 1 + "px";
    },
    moveFileBox(id, file) {
      //弹窗 选择文件夹
      this.needMoveFileId = id;
      this.dialogFormVisible = true;
    },
    dialogMoveFileCancel() {
      //清空输入内容 关闭窗口
      this.needMoveFileId = null;
      this.newFilePath = "我的网盘";
      this.dialogFormVisible = false;
      this.moveFolderData = [
        {
          label: "我的网盘",
          path: "/",
          children: [],
        },
      ];
      this.clickFolderData = null;
    },
    dialogMoveFileOk() {
      //路径为空
      if (this.newFilePath === "") {
        this.$message({
          type: "error",
          message: `路径不能为空`,
        });
      } else {
        //向后台发送信息
        //(id file newPath)
        this.moveFile();
        this.moveFolderData = [
          {
            label: "我的网盘",
            path: "/",
            children: [],
          },
        ];
      }
    },
    moveFile() {
      let params = {
        id: this.needMoveFileId,
        newPath: this.newFilePath,
        uid: this.uid,
      };
      this.$http
        .post(`${this.hostUrl}/file/moveFile`, params)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.error(res.data.msg);
          } else {
            let path = "";
            if (this.path.length === 0) {
              path = this.nowfolder;
            } else {
              path = this.path.join("/") + "/" + this.nowfolder;
            }
            this.$message.success(res.data.msg);
            this.$refs.upFile.setPath(path);
            this.refreshFileList(path);
            this.closebar();
            this.dialogFormVisible = false;
            this.needMoveFileId = null;
            this.newFilePath = "我的网盘";
          }
        })
        .catch((err) => {
          this.$message.error(res.data.msg);
          this.$refs.upFile.setPath(path);
          this.refreshFileList(path);
          this.closebar();
          this.dialogFormVisible = false;
          this.needMoveFileId = null;
          this.newFilePath = "我的网盘";
          console.log(err);
        });
    },
    reFileNameBox(id) {
      this.$prompt("请输入文件名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        //inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        //inputErrorMessage: "邮箱格式不正确",
      })
        .then(({ value }) => {
          if (value) {
            this.reFileName(id, value);
          } else {
            this.$message.error("文件名禁止为空");
          }
        })
        .catch(() => {});
    },
    reFileName(id, value) {
      let params = {
        id: id,
        file_Name: value,
        uid: this.uid,
      };
      this.$http
        .post(`${this.hostUrl}/file/reName`, params)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.error(res.data.msg);
          } else {
            let path = "";
            if (this.path.length === 0) {
              path = this.nowfolder;
            } else {
              path = this.path.join("/") + "/" + this.nowfolder;
            }
            this.$message.success(res.data.msg);
            this.$refs.upFile.setPath(path);
            this.refreshFileList(path);
            this.closebar();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        lockScroll: false,
        type: "warning",
      })
        .then(() => {
          this.$http
            .delete(`${this.hostUrl}/file/delete/${row.hash_name}/${row.id}`)
            .then((res) => {
              this.$message.success(res.data.msg);
              let path = "";
              if (this.path.length === 0) {
                path = this.nowfolder;
              } else {
                path = this.path.join("/") + "/" + this.nowfolder;
              }
              this.$refs.upFile.setPath(path);
              this.refreshFileList(path);
              this.closebar();
            })
            .catch((err) => {
              console.log("Error=>", err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleShare(index, row) {
      let url = `${row.id}/${row.hash_name}`;
      let newText = window.btoa(encodeURIComponent(url));

      this.$confirm(
        `<p style="word-wrap: break-word; word-break: break-all;">${newText}</p>`,
        "点击确定复制以下文本分享给好友哦~",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "success",
        }
      )
        .then(() => {
          this.$copyText(`#Classmate-Sun's Cloud 专用分享链接#${newText}`).then(
            (e) => {
              this.$message({
                type: "success",
                message: "已复制到剪切板!",
              });
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消分享!",
          });
        });
    },
    handleDownload(file) {
      if (file.type !== ".folder") {
        let url = this.getFile(file);
        this.downlodFile(url, file.file_name, this.downloadList.length);
      }
      let path = "";
      if (this.path.length === 0) {
        path = this.nowfolder;
      } else {
        path = this.path.join("/") + "/" + this.nowfolder;
      }
      this.$refs.upFile.setPath(path);
      setTimeout(() => {
        this.refreshFileList(path);
        this.closebar();
      }, 1000);
    },
    refreshFileList(path) {
      this.getFileList(path);
    },
    getFileList(path) {
      let params = {
        uid: sessionStorage.getItem("uid"),
        path: path,
      };
      this.uid = sessionStorage.getItem("uid");
      this.$http
        .post(`${this.hostUrl}/file/list`, params)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.error(res.data.msg);
          } else {
            this.tableData = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getFile(data) {
      let url = `${this.hostUrl}/file/download/${data.id}/${data.hash_name}`;
      return url;
    },
    dealSize(row, column) {
      if (0 <= row.size && row.size < 102.4) {
        return `${row.size}byte`;
      } else if (102.4 <= row.size && row.size < 1024 * 1024) {
        let kb = (row.size / 1024).toFixed(2);
        return `${kb}Kb`;
      } else if (1024 * 1024 <= row.size && row.size < 1024 * 1024 * 1024) {
        let mb = (row.size / 1024 / 1024).toFixed(2);
        return `${mb}Mb`;
      } else if (
        1024 * 1024 * 1024 <= row.size &&
        row.size < 1024 * 1024 * 1024 * 1024
      ) {
        let gb = (row.size / 1024 / 1024 / 1024).toFixed(2);
        return `${gb}Gb`;
      }
    },
    dealTime(row, column) {
      return this.formatTime(row.upload_time);
    },
    formatTime(value) {
      var date = new Date(value);
      var Y = date.getFullYear();
      var M =
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1;
      var D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      var h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
      var m =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      var s =
        date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
      return `${Y}-${M}-${D} ${h}:${m}:${s}`;
    },
  },
  mounted() {
    let protocol = window.location.protocol; //协议
    let host = window.location.host; //主机
    this.hostUrl = `${protocol}//${host}`;
    const that = this;
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight;
        that.fullHeight = window.fullHeight;
      })();
    };
    this.height = this.fullHeight - 280;
    this.getFileList("我的网盘");
    this.$refs.upFile.setPath("我的网盘");
  },
};
</script>
<style scoped>
.viewTip {
  display: inline-block;
  width: 100px;
  height: 25px;
  font-size: 15px;
  margin-right: -19px;
  text-align: center;
}
.el-button + .el-button {
  margin: 0;
}
.fixedBox {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 230px;
  background: #fff;
  z-index: 1998;
}
.leftNav {
  width: 180px;
  height: 400px;
  position: fixed;
  left: 50%;
  transform: translateX(-333%);
  top: 280px;
  z-index: 1998;
}
.leftNavBtn {
  box-sizing: border-box;
  padding-left: 20px;
  width: 100%;
  height: 50px;
  font-size: 18px;
  line-height: 50px;
  text-align: left;
  border-left: 4px solid #fff;
  transition: 0.2s;
  background: #fff;
  color: #333;
}
.leftNavBtn:hover {
  border-left: 4px solid #edf6fb;
  background: #edf6fb;
  color: #06a8ff;
}
.leftNavBtnClick {
  border-left: 4px solid #06a8ff;
  background: #edf6fb;
  color: #06a8ff;
}
.leftNavBtnClick:hover {
  border-left: 4px solid #06a8ff;
  background: #edf6fb;
  color: #06a8ff;
}
.fileBox {
  width: 1200px;
  margin: 280px auto 50px;
}
.listpp {
  position: fixed;
  left: 50%;
  transform: translateX(-41%);
  width: 1015px;
  overflow: hidden;
  height: 441px;
  overflow: hidden;
  overflow-y: auto;
}
.fileListpp {
  box-sizing: border-box;
  float: left;
  width: 145px;
  height: 160px;
  font-size: 16px;
  border: 1px solid rgba(0, 0, 0, 0);
}
.fileListpp .icon {
  margin: 14px 14px 0;
  width: 100px;
  height: 100px;
}
.fileListpp:hover {
  box-sizing: border-box;
  background: #e0f4fc;
  border: 1px solid #98e6fc;
  border-radius: 10px;
}
.fileListppClick {
  box-sizing: border-box;
  background: #c7eefc;
  border: 1px solid #1ed0ff;
  border-radius: 10px;
}
.fileListppClick:hover {
  box-sizing: border-box;
  background: #c7eefc;
  border: 1px solid #1ed0ff;
  border-radius: 10px;
}
.fileIcon {
  width: 143px;
  height: 116px;
  text-align: center;
}
.clickBox .fileName {
  word-break: break-all;
  height: 44px;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  text-align: center;
}
.infoBox {
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  position: fixed;
  top: 230px;
  left: 0;
  background: #fff;
  z-index: 1998;
}
.infoBar {
  box-sizing: border-box;
  padding-left: 184px;
  width: 1200px;
  height: 50px;
  position: fixed;
  top: 230px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1998;
}
.infoBar p {
  display: block;
  font-size: 20px;
  text-align: left;
  line-height: 50px;
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.infoBar .ft {
  width: 330px;
}
.infoBar .fs {
  width: 165px;
}
.infoBar .fd {
  width: 170px;
}
.infoBar .fb {
  padding-top: 10px;
  width: 310px;
  float: left;
}
.navBar {
  box-sizing: border-box;
  padding-top: 10px;
  width: 1200px;
  height: 50px;
  position: fixed;
  top: 190px;
  background: #fff;
  left: 50%;
  transform: translateX(-50%);
}
.navBar .navB {
  box-sizing: border-box;
  width: 80%;
  float: left;
  height: 30px;
  padding: 8px 12px;
  box-shadow: 0 0 8px #063e8b inset;
  transition: 0.2s;
  border-radius: 7px;
}
.navBar .navB:hover {
  box-shadow: 0 0 8px #377ee3 inset;
}
.navBar .view {
  box-sizing: border-box;
  padding-top: 7px;
  width: 230px;
  float: right;
}
.el-button--text {
  color: #6b809f;
}
.el-button.is-disabled {
  color: #606266;
}
.right-menu {
  border: 1px solid #eee;
  box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, 0.1);
  border-radius: 1px;
  font-family: Microsoft Yahei, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: fixed;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  z-index: 1998;
}
.right-menu a {
  text-decoration: none;
  padding: 2px 15px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  display: block;
  color: #1a1a1a;
}
.right-menu a:hover {
  font-weight: bold;
}
/*正常的未被访问过的链接*/
.right-menu a:link {
  text-decoration: none;
}
/*已经访问过的链接*/
.right-menu a:visited {
  text-decoration: none;
}
/*鼠标划过(停留)的链接*/
.right-menu a:hover {
  text-decoration: none;
}
/* 正在点击的链接，鼠标在元素上按下还没有松开*/
.right-menu a:active {
  text-decoration: none;
}
/* 获得焦点的时候 鼠标松开时显示的颜色*/
.right-menu a:focus {
  text-decoration: none;
}
.folderTree {
  overflow: auto;
  width: 560px;
  height: 250px;
}
.dllistbtn {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid #409eff;
  position: fixed;
  top: 124px;
  right: 25px;
  z-index: 1999;
  color: #409eff;
  font-size: 25px;
  text-align: center;
  line-height: 35px;
  transition: 0.2s;
}
.dllistbtn:hover {
  border: 2px solid #a1ccf6;
  color: #a1ccf6;
}
.dllistitem {
  box-sizing: border-box;
  width: 100%;
  height: 65px;
  font-size: 18px;
  line-height: 50px;
  text-align: left;
  transition: 0.2s;
  background: #fff;
  color: #333;
}
.dllistitem:hover {
  background: #edf6fb;
}
.searchBox {
  position: fixed;
  left: 470px;
  top: 110px;
  margin: 0 auto;
  width: 700px;
  z-index: 1999;
}
.canNotClick {
  pointer-events: none;
  cursor: no-drop;
}
.redDot {
  margin-top: 0;
  margin-right: 0;
}
</style>