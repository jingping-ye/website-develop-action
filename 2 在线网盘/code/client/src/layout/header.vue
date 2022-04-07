<template>
  <div class="header">
    <div class="title">
      <img
        src="../assets/logo.png"
        style="height: 65px; margin: 0px 7px -9px 0"
        height="65"
        alt="logo"
      />
      孙同学的网盘<span class="label"
        >&nbsp;&nbsp;&nbsp;&nbsp;Classmate-Sun’s Cloud</span
      >
    </div>
    <div class="user">
      用户: {{ username }}&nbsp;&nbsp;<a href="#" @click="signOut">退出</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "base-header",
  data() {
    return {
      username: sessionStorage.getItem("username"),
    };
  },
  methods: {
    signOut() {
      this.$router.push({ path: "/" });
      sessionStorage.clear();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  box-sizing: border-box;
  position: fixed;
  width: 1200px;
  left: 50%;
  top: 0;
  text-align: center;
  font-size: 18px;
  box-shadow: 0 5px 15px -10px #ccc;
  padding: 20px;
  z-index: 1999;
  background: #fff;
  transform: translateX(-50%);
}
.title {
  font-size: 34px;
  text-align: left;
  float: left;
}
.label {
  font-size: 25px;
}
.user {
  float: right;
  margin-top: 40px;
}
</style>
