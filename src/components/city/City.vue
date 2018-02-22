<template>
  <div>
    <div class="cityInfo">
      <CityItem v-for="(item, index) in citiesInfo"
                :title="item.title"
                :cities="item.cities"
                :index="index"
                :key="index + 'city'"
                @selectCity="receiveCityInfo"/>
      <!-- @selectCity 接收子组件内部发出的事件 -->
    </div>
    <Footer/>
  </div>
</template>

<script>

  import {mapGetters} from 'vuex';

  import CityItem from './CityItem';
  import Footer from '../Footer'

  export default {
    name: 'city',
    data() {
      return {}
    },
    components: {
      CityItem,
      Footer
    },
    computed: {
      ...mapGetters({
        citiesInfo: 'cities'
      })
    },
    methods: {

      // 获取城市信息
      fetchCityInfo: function () {
        this.$store.dispatch({
          type: 'GET_CITIES'
        })
      },

      // 选择城市
      receiveCityInfo: function (name, code) {
        this.$store.dispatch({
          type: 'CHOOSE_CITY',
          cityCode: code,
          cityName: name
        });
        // 后退
        this.$router.go(-1);
      }
    },
    created() {
      this.fetchCityInfo();
    }
  }
</script>

<style scoped>

</style>
