<template>
  <div>
    <div v-if="pageStatus === 'completed'">
      <div>
        <SliderBar ref="sliderBar" :tabNameL="'影片'" :tabNameR="'影院'" @switchTab="switchTab"/>
      </div>
      <div ref="moviePage" class="movies" v-show="showTab === 'movieTab'">
        <IndexList :info="moviesInfo">
          <!-- slot="item" 表示具名插槽 -->
          <!-- MovieItem 插入对应的slot -->
          <MovieItem slot="item" slot-scope="props" :movieInfo="props.info"></MovieItem>
        </IndexList>
        <div ref="mloading" class="scroll-loading">加载中...</div>
      </div>

      <div ref="cinemaPage" id="cinemas" v-show="showTab === 'cinemaTab'">
        <IndexList :info="cinemasInfo">
          <CinemaItem slot="item" slot-scope="props" :cinemaInfo="props.info" @selectCinema="cinemaClick"></CinemaItem>
        </IndexList>
        <div ref="cloading" class="scroll-loading">加载中...</div>
      </div>
    </div>
    <Loading v-if="pageStatus === 'loading'"/>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  import {TitleManage} from '../../utils/Manage';

  import SliderBar from '../common/SliderBar'
  import IndexList from './IndexList';
  import MovieItem from './MovieItem';
  import CinemaItem from '../common/CinemaItem';
  import Loading from '../common/Loading'

  import LazyLoader from '../../utils/LazyLoader'

  export default {
    name: 'index',
    components: {
      SliderBar,
      IndexList,
      MovieItem,
      CinemaItem,
      Loading
    },
    data() {
      return {
        pageStatus: 'loading',
        showTab: "movieTab",
        pageSize: 6,
        movieLazyLoader: null,

        mLoaded: false,
        cLoaded: false,
      }
    },
    computed: {
      // cityCode: function () {
      //   return this.$store.getters.cityCode;
      // }
      ...mapGetters([
        'cityCode',
        'moviesInfo',
        'cinemasInfo'
      ])
    },
    watch: {
      // 当城市变化时重新加载数据
      'cityCode': function (newVal, oldVal) {
        this.pageStatus = 'loading';
        this.movieLazyLoader = null;
        this.refresh(newVal, this.pageSize, 0);
      }
    },
    methods: {

      // getMoviesInfo: function (cityCode, pageSize, startIndex) {
      //   return this.$store.dispatch({
      //     type: 'GET_MOVIES_INFO',
      //     cityCode: cityCode,
      //     pageSize: pageSize,
      //     index: startIndex
      //   })
      // },

      ...mapActions({
        getMoviesInfo: 'GET_MOVIES_INFO',
        getCinemasInfo: 'GET_CINEMAS_INFO',
        refreshData: 'REFRESH_INDEX_INFO'
      }),

      loadMoviesInfo: function (cityCode, pageSize, startIndex) {
        this.getMoviesInfo({cityCode, pageSize, startIndex})
          .then(() => {
            this.movieLoaded();
          })
          .catch(e => {
            this.mLoaded = true;
          })
      },

      loadCinemasInfo: function (cityCode, pageSize, startIndex) {
        this.getCinemasInfo({cityCode, pageSize, startIndex})
          .then(() => {
            this.cinemaLoaded()
          })
          .catch(function (e) {
            this.cLoaded = true;
          })
      },

      // 影片加载完成
      movieLoaded: function () {
        this.mLoaded = true;
        // 判断是否还有剩余数据
        if (this.moviesInfo.length % this.pageSize !== 0)
          this.$refs.mloading.style.display = 'none';
      },

      // 影院加载完成
      cinemaLoaded: function () {
        this.cLoaded = true;
        if (this.cinemasInfo.length % this.pageSize !== 0)
          this.$refs.cloading.style.display = 'none';
      },

      // 初始化
      init: function (cityCode, pageSize, startIndex) {
        this.getMoviesInfo({cityCode, pageSize, startIndex})
          .then(() => {
            this.initLayout();
          })
          .catch(e => {
            this.cLoaded = true;
          });
      },

      // 初始化布局
      initLayout: function () {
        this.pageStatus = 'completed';
        this.showTab = 'movieTab';

        this.movieLoaded();

        // 待页面渲染完成后执行
        this.$nextTick(function () {
          // 初始化懒加载工具
          if (this.moviesInfo.length > 0 && !this.movieLazyLoader) {
            this.movieLazyLoader = new LazyLoader({
              el: '.movies .list',
              addListener: false
            });
          }
        });
      },

      // 刷新数据
      refresh: function (cityCode, pageSize, startIndex) {
        this.refreshData({cityCode, pageSize, startIndex})
          .then(() => {
            setTimeout(() => { // 保证页面回到index 在执行
              // 回到顶部
              document.body.scrollTop = document.documentElement.scrollTop = 0;
              this.initLayout();
            }, 0);
          })
          .catch(e => {

          })
      },

      // 选择导航
      switchTab: function (result) {
        // 选中电影
        if (result.selectedTab === 'leftTab') {
          this.showTab = 'movieTab';
          if (this.moviesInfo.length === 0) {
            this.loadMoviesInfo(this.cityCode, this.pageSize, 0);
          }
          return;
        }
        // 选中影院
        if (result.selectedTab === 'rightTab') {
          this.showTab = 'cinemaTab';
          if (this.cinemasInfo.length === 0) {
            this.loadCinemasInfo(this.cityCode, this.pageSize, 0);
          }
          return;
        }
      },

      // 添加滚动监听（图片懒加载，下拉加载更多）
      addScrollListener: function () {
        var self = this;
        var timer = 0;
        // 屏幕高
        var clientHeight = document.documentElement.clientHeight;

        // 添加滚动监听
        window.addEventListener('scroll', function () {

          // 保证该监听事件只在 'index'执行
          if (self.$route.name !== 'index') return;
          // 防抖
          if (timer) clearTimeout(timer);
          timer = setTimeout(function () {
            // 获取滚动位置
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (self.showTab === 'movieTab') {
              // 懒加载图片（若加载事件在lazyLoader中，不能保证事件触发在指定页面（index））
              if (self.movieLazyLoader) self.movieLazyLoader.scrollListener();
              // 判断是否滚动到底部
              if (self.mLoaded && scrollTop + 173 >= document.documentElement.scrollHeight - clientHeight) {
                self.mLoaded = false;
                // 判断数据是否已经全部加载
                if (self.moviesInfo.length % self.pageSize !== 0) return;
                // 加载数据
                self.loadMoviesInfo(self.cityCode, self.pageSize, self.moviesInfo.length);
              }
              return;
            }
            if (self.showTab === 'cinemaTab') {
              // 判断是否滚动到底部
              if (self.cLoaded && scrollTop + 173 >= document.documentElement.scrollHeight - clientHeight) {
                self.cLoaded = false;
                // 判断数据是否已经全部加载
                if (self.cinemasInfo.length % self.pageSize !== 0) return;
                // 加载数据
                self.loadCinemasInfo(self.cityCode, self.pageSize, self.cinemasInfo.length);
              }
              return;
            }
          }, 250);
        });
      },

      // 选择影院
      cinemaClick: function (result) {
        // 设置标题
        TitleManage.setTitleInfo('shows', result.cinemaName);
        // 页面跳转
        this.$router.push({
          name: 'shows',
          params: {cinemaId: result.cinemaId}
        });
      }
    },
    created() {
      // 加载数据
      this.init(this.cityCode, this.pageSize, 0);
    },
    mounted() {
      // 添加监听
      this.addScrollListener();
    }
  }
</script>

<style scoped>
  @import "../../assets/css/index.css";
</style>
