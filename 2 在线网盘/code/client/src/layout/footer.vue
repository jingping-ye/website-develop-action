<template>
  <div class="footer">
    Copyright © {{ date }}
    <a href="mailto:suntongxue@sun0623.top">Classmate-Sun</a> 版权所有
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      date: new Date().getFullYear(),
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer {
  box-sizing: border-box;
  padding: 10px;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  height: 40px;
  text-align: center;
  font-size: 16px;
  z-index: 999;
  background: #fff;
}
</style>
