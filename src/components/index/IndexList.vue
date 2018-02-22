<template>
  <ul class="list">
    <!-- v-bind:info 建绑定的值传给对应的li（MovieItem） -->
    <slot name="item" v-for="item in info" v-bind:info="item"></slot>
  </ul>
</template>

<script>

  export default {
    name: "common-list",
    props: {
      info: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {}
    },
    mounted() {
    }
  }
</script>

<style scoped>
  @import "../../assets/css/indexList.css";
</style>
