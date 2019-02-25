<template>
  <div class="header">
    <div class="title">
      在线网盘系统 <span class="label">Cloud Drive</span>
    </div>
    <div class="user">
      用户:{{username}}&nbsp;&nbsp;<a href="#">退出</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'base-header',
  data () {
    return {
      username: sessionStorage.getItem('username')
    }
  },
  methods: {
    exit () {
      this.$router.push({ path: '/' })
      sessionStorage.clear()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
  box-shadow: 0 5px 15px -10px #ccc;
  padding: 20px;
}
.title {
  font-size: 34px;
  text-align: left;
  margin-left: 40px;
}
.label {
  font-size: 25px;
}
.user {
  top: 20px;
  right: 40px;
  position: absolute;
}
</style>
