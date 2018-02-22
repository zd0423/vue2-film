<template>
  <div ref="loading" class="loading">
    <div class="mp-loading">
      <span class="spin"></span>
      <span class="message">{{message}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "loading",
    props:{
      message:{
        type: String,
        default: function () {
          return '正在为您加载数据...'
        }
      }
    },
    mounted(){
      this.$refs.loading.style.height = document.documentElement.clientHeight + 'px';
    }
  }
</script>

<style scoped>
  @import "../../assets/css/loading.css";
</style>
