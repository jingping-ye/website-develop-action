<template>
  <div class="footer">
    created by <a href="mailto:yejingping96@gmail.com">vine</a> @{{date}}
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      date: new Date().getFullYear()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer {
  height: 50px;
  text-align: center;
  font-size: 18px;
}
</style>
