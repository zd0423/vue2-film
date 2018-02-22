<template>
  <div class="navbar">
    <div ref="left" class="navbar-left">
      <div ref="back" class="navbar-back" style="display: none"></div>
      <div ref="city" class="navbar-city">{{selectedCityName}}</div>
    </div>
    <div ref="middle" class="navbar-middle">{{title}}</div>
    <div ref="right" class="navbar-right"></div>
  </div>
</template>

<script>

  import {TitleManage} from '../../utils/Manage';

  export default {

    name: "nav-bar",

    data() {
      return {
        title: '猫眼电影'
      }
    },
    methods: {

      //
      setTitle: function (title) {

        title = title ? title : '猫眼电影';

        document.title = title;
        this.title = title;
      },

      //
      addEventListener: function () {
        var self = this;

        var left = this.$refs.left;
        var back = this.$refs.back;
        var city = this.$refs.city;

        left.addEventListener('click', function () {

          if ('none' !== city.style.display) {
            self.$router.push({name: 'city'});
            return;
          }

          if ('block' === back.style.display) {
            self.$router.go(-1);
            return;
          }
        });
      }
    },

    computed: {
      selectedCityName: function () {
        var cityName  = this.$store.getters.cityName;

        if(!cityName){
          this.$store.dispatch('REFRESH_CITY_INFO');
        }

        return this.$store.getters.cityName;
      }
    },

    watch: {
      // 监听路由变化，构建导航栏
      '$route': function (to, from) {
        var back = this.$refs.back;
        var city = this.$refs.city;

        if (to.path === '' || to.path === '/') {
          city.style.display = 'block';
          back.style.display = 'none';
        } else {
          city.style.display = 'none';
          back.style.display = 'block';
        }

        var titleInfo = TitleManage.getTitleInfo();
        // 设置标题
        this.setTitle(titleInfo[to.name]);
      }
    },

    mounted() {

      this.setTitle(this.title);
      this.addEventListener();
    }
  }
</script>

<style scoped>

  @import "../../assets/css/navBar.css";

</style>
