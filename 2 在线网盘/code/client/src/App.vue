<template>
  <div id="app" style="display: block">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",

  mounted() {
    
  },
};
</script>

<style>
@import url("./styles/reset.css");
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#app .el-dialog__title{
    text-align: left;
    font-weight: bold;
}
</style>
