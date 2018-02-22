<template>
  <div>
    <div v-if="pageStatus === 'completed'">
      <div class="showtime-cinema-info">
        <div class="stci-info">
          <div class="cinema-name">{{cinemaInfo.name}}</div>
          <p class="cinema-address">{{cinemaInfo.address}}</p>
        </div>
        <div class="cinema-tel">
          <a :href="'tel:' + cinemaInfo.tel" data-tel="cinemaDetail.tel">
            <i class="phone-icon"></i>
          </a>
        </div>
      </div>
      <!-- 影院电影 -->
      <div class="showtime-movies">
        <ul ref="slider" id="slider">
          <li v-for="(item, index) in moviesInfo">
            <a :class="{ 'selected': !index }" :data-index="index" :data-id="item.id">
              <img :src="item.poster"/>
            </a>
          </li>
        </ul>
      </div>
      <div class="showtime-mname">
        <a class="movie-relative">
          <span class="movie-name">{{selectedMovie.name}}</span>
          <span class="sc"><strong>{{selectedMovie.score}}</strong>分</span>
        </a>
      </div>
      <!--排片时间-->
      <TimeLine :timeInfo="timeLine" :initialIndex="selectedDateIndex" @timeLineClick="timeLineClick"/>
      <!-- 场次 -->
      <div class="showtime-list">
        <ShowTimeList v-if="plist.length > 0"
                      :plist="plist"
                      :cinemaId="cinemaId"
                      :movieId="selectedMovie.id"/>
        <div class="sell-out" v-else>今日场次已映完</div>
      </div>
      <Footer :type="3"/>
    </div>
    <Loading v-if="pageStatus === 'loading'"/>
  </div>
</template>

<script>

  import {mapGetters, mapActions} from 'vuex';

  import MovieWallBuilder from '../../utils/MovieWallBuilder';

  import Loading from '../common/Loading';
  import TimeLine from '../common/TimeLine'
  import ShowTimeList from './ShowTimeList';
  import ShowTimeItem from './ShowTimeItem';
  import Footer from '../Footer';

  export default {
    name: "show",
    props: {},
    components: {
      Loading,
      TimeLine,
      ShowTimeList,
      ShowTimeItem,
      Footer
    },
    data() {
      return {
        // 页面状态
        pageStatus: 'loading',
        error: '',

        // 查询条件
        cinemaId: '',
        movieId: '',
        date: '',

        // 影院信息
        cinemaInfo: {},
        // 影院播放影片
        moviesInfo: [],
        // 影片墙
        movieWall: null,
        // 当前选中影片
        selectedMovie: {},
        // 当前选中影片索引
        selectedMovieIndex: 0,
        // 前选中影片排片情况
        plist: [],
        // 选中的日期索引
        selectedDateIndex: 0
      }
    },
    computed: {
      // 时间轴
      'timeLine': function () {
        return this.selectedMovie.shows
      },
      ...mapGetters([
        'showsInfo'
      ])
    },
    //
    methods: {

      ...mapActions({
        getShowsInfo: 'GET_SHOWS_INFO'
      }),

      // 获取影院信息
      fetchData: function (cinemaId, movieId, date) {

        this.getShowsInfo({
          cinemaId,
          movieId,
          date
        })
          .then(() => {
            // 影院信息
            this.cinemaInfo = this.showsInfo.cinemaInfo;
            // 全部的影片信息
            this.moviesInfo = this.showsInfo.moviesInfo;

            // 所选影片索引（默认显示第一个）
            this.selectedMovieIndex = this.findSelectedIndex(this.moviesInfo, 'id', movieId);
            // 当前展示的影片
            this.selectedMovie = this.moviesInfo[this.selectedMovieIndex];
            // 所选日期
            this.selectedDateIndex = this.findSelectedIndex(this.selectedMovie.shows, 'showDate', date);
            // 当天排片
            this.plist = this.selectedMovie.shows[this.selectedDateIndex].plist;

            this.pageStatus = 'completed';

            // 保证dom更新后执行
            this.$nextTick(function () {
              //
              this.buildMovieWall();
            });
          })
          .catch(e => console.log(e));
      },

      findSelectedIndex: function (data, key, element) {

        if (data.length <= 0 || !element) return 0;

        for (var i = 0; i < data.length; i++) {
          if (data[i][key] == element) {
            //console.log(i);
            return i;
          }
        }
        return 0;
      },

      // 构建影片墙
      buildMovieWall: function () {
        var self = this;
        self.movieWall = new MovieWallBuilder({
          el: '#slider',
          selectedIndex: self.selectedMovieIndex,
          callback: function (index) {
            // 判断前后两次选中元素是否相同
            if (index === self.selectedMovieIndex) return;
            // 当前影片索引
            self.selectedMovieIndex = index;
            // 当前影片播放信息
            self.selectedMovie = self.moviesInfo[index];
            // 排片情况
            self.plist = self.selectedMovie.shows[0].plist;
          }
        });
      },

      // timeLine点击事件
      timeLineClick: function (result) {
        var proSelectedIndex = result.proSelectedIndex;
        var selectedIndex = result.selectedIndex;
        if (proSelectedIndex == selectedIndex) return;
        //this.selectedTimeIndex = index;
        // 切换日期
        this.plist = this.selectedMovie.shows[selectedIndex].plist;
      }
    },
    //
    watch: {
      // 监听路由变化，配合更新数据
      '$route': function (to, from) {

        if (to.name === 'shows' && from.name !== 'seats') {
          var cinemaId = to.params.cinemaId;
          var movieId = to.query.movieId;
          var date = to.query.date;

          this.pageStatus = 'loading';
          this.cinemaId = cinemaId;
          this.fetchData(this.cinemaId, movieId, date);
        }
      }
    },
    //
    created() {
      // 获取影院ID （当第一次进入此页面，或涮新该页面时触发）
      this.cinemaId = this.$route.params.cinemaId;
      //this.cinemaId = this.$route.params.cinemaId + '';

      var movieId = this.$route.query.movieId;
      var date = this.$route.query.date;

      this.fetchData(this.cinemaId, movieId, date);
    }
  }
</script>

<style scoped>
  @import "../../assets/css/shows.css";
</style>
