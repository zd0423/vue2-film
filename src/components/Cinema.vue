<template>
  <div class="cinema">
    <div v-if="pageStatus === 'completed'">
      <TimeLine :timeInfo="timeLine" @timeLineClick="timeLineClick"/>
      <ul>
        <CinemaItem v-for="(cinema, index) in cinemaList" :cinemaInfo="cinema" :isShowDis="false" :key="index"
                    @selectCinema="cinemaClick"/>
      </ul>
    </div>
    <Loading v-if="pageStatus === 'loading'"/>
  </div>
</template>

<script>

  import {mapGetters, mapActions} from 'vuex';
  import {TitleManage} from '../utils/Manage';

  import Loading from './common/Loading';
  import TimeLine from './common/TimeLine'
  import CinemaItem from './common/CinemaItem'

  export default {
    name: "cinema",
    components: {
      Loading,
      TimeLine,
      CinemaItem
    },
    data() {
      return {
        pageStatus: 'loading',
        error: '',
        // 影片id
        movieId: '',
        // 时间轴
        timeLine: [],
        // 影院列表
        cinemaList: [],
        // 选中的日期
        selectedDate: ''
      }
    },
    computed: {
      // timeLine: function () {
      //   return this.cinemasInfo
      // },
      ...mapGetters({
        cinemasInfo: 'cinemas',
        cityCode: 'cityCode'
      })
    },
    methods: {

      ...mapActions({
        getCinemaDetails: 'GET_CINEMA_DETAILS'
      }),

      // 根据cityCode,movieId 获取相关播放影院
      fetchData: function (cityCode, movieId) {

        this.getCinemaDetails({cityCode, movieId})
          .then(() => {
            this.pageStatus = 'completed';
            this.timeLine = this.cinemasInfo;
            // 获取最第一天的影院列表
            this.cinemaList = this.cinemasInfo[0].cinemaList;
            // 默认选中的日期
            this.selectedDate = this.cinemasInfo[0].showDate;
          })
          .catch(e => console.log(e));
      },

      // 选择日期
      timeLineClick: function (result) {
        if (this.selectedDate == result.selectedDate) return;
        // 切换日期
        var index = result.selectedIndex;
        this.cinemaList = this.cinemasInfo[index].cinemaList;
        this.selectedDate = result.selectedDate;
      },

      // 选择影院
      cinemaClick: function (result) {
        // 设置标题信息
        TitleManage.setTitleInfo('shows', result.cinemaName);
        // 页面跳转
        this.$router.push({
          name: 'shows',
          params: {cinemaId: result.cinemaId},
          query: {movieId: this.movieId, date: this.selectedDate}
        });
      }
    },
    watch: {
      '$route': function (newVal, oldVal) {
        if (newVal.name !== 'cinema') return;
        var movieId = newVal.params.movieId;
        if (movieId && movieId != this.movieId) {
          this.pageStatus = 'loading';
          this.movieId = movieId;
          this.fetchData(this.movieId);
        }
      }
    },
    created() {
      // 获取影片id
      this.movieId = this.$route.params.movieId;
      // 加载数据
      this.fetchData(this.cityCode, this.movieId);
    }
  }
</script>

<style scoped>
  @import "../assets/css/cinema.css";
</style>
