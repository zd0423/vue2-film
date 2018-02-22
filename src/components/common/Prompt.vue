<template>
  <div ref="alert" class="msg-bg">
    <div id="msg" class="msg-doc msg-alert">
      <div class="msg-bd">{{message}}</div>
      <div class="msg-ft cf">
        <span class="msg-btn msg-btn-ok" @click="close">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "alert",
    // props: {
    //   message:{
    //     type: String,
    //     required: true
    //   }
    // },
    data() {
      return {
        show: false
      }
    },
    computed: {
      message: function () {
        return this.$store.getters.tipMessage;
      }
    },
    methods: {
      close: function () {
        var self = this;
        var alert = self.$refs.alert;
        alert.style.animation = 'hide .3s';
        alert.style.background = 'none';

        setTimeout(function () {
          alert.style.display = "none";
          self.$store.dispatch('CLOSE_TIP');
        }, 200);
      }
    },
    mounted() {
      this.$refs.alert.style.height = document.documentElement.clientHeight + 'px';
    },

    destroyed() {
      console.log("destroyed");
    }
  }
</script>

<style scoped>
  @import "../../assets/css/prompt.css";
</style>
