<template>
  <div id="app">
    <!-- 路由 -->
    <NavBar/>
    <!-- 切换出去的组件保留在内存中，可以保留它的状态或避免重新渲染。 -->
    <!-- :exclude 匹配的是组件的name属性 -->
    <keep-alive :exclude="excludeComponent">
      <!-- style会向下传递 -->
      <router-view style="padding-top: 1rem"/>
    </keep-alive>
    <!-- 弹窗 -->
    <Alert v-if="tipStatus === 'opened'"/>
  </div>
</template>

<script>

  import NavBar from './components/common/NavBar';
  import Alert from './components/common/Prompt';

  export default {
    name: 'app',

    data() {
      return {
        excludeComponent: ['login', 'createOrder']
      }
    },
    computed: {
      // 计算属性基于依赖进行缓存，当依赖没有变化是，计算属性不会重新触发
      tipStatus: function () {
        return this.$store.getters.tipStatus
      }
    },
    components: {
      NavBar,
      Alert
    }
  }
</script>

<style>
  @import "./assets/css/common.css";
</style>
