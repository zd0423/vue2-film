<template>
  <div>
    <div v-if="pageStatus === 'completed'">
      <div class="movie-page">
        <!-- 头 -->
        <section class="movie-header">
          <div class="movie">
            <div class="movie-background"
                 :style="'background-image:url(' + bgimg +')'"></div>
            <div class="movie-filter"></div>
            <div class="movie-container clearfix">
              <div class="movie-cover movie-with-video">
                <a class="link">
                  <img class="img noneBg" :src="posterUrl">
                </a>
              </div>
              <div class="movie-content">
                <div class="movie-name text-ellipsis">
                  <span>{{movieName}}</span>
                </div>
                <div class="movie-ename text-ellipsis">{{movieEnm}}</div>
                <div class="movie-score">
                  <div class="released-score">
                    <RatingBar :score="score"/>
                    <div class="score-num">
                      <span>(</span>
                      <span>{{snum}}</span>
                      <span>人评分)</span>
                    </div>
                  </div>
                </div>
                <div class="movie-category">
                  <span class="movie-cat">{{cat}}</span>
                </div>
                <div class="movie-content-row">
                  <span>{{src}}</span>
                  <span> / </span>
                  <span>
                    <span>{{dur}}</span>
                    <span> 分钟</span>
                  </span>
                  <span></span>
                </div>
                <div class="movie-content-row">{{pubDesc}}</div>
              </div>
            </div>
          </div>
        </section>
        <!-- 简介 -->
        <section class="section-seperate section-expander">
          <a class="btn btn-block" @click="toCinemaPage">
            <span>立即购票</span>
          </a>
          <div ref="intro" class="text-expander" data-status="closed">
            <div ref="expander" class="text-expander-content">
              <p ref="context">{{dra}}</p>
            </div>
            <div class="text-expander-button">
              <i class="icon icon-chevron-down" @click="expandCloseContent"></i>
            </div>
          </div>
        </section>
        <!-- 观影小贴士 -->
        <section class="section-seperate section-tips" v-if="egg">
          <h3>观影小贴士</h3>
          <div class="tip">
            <img src="http://p0.meituan.net/mmdb/8f52014d6b15bf93415d10cdcd16cbf52917.png"/>
            <span>有1个彩蛋，随片尾字幕出现</span>
          </div>
        </section>
        <!-- 演职人员 -->
        <section class="section-seperate section-movie-celebrities">
          <ul class="movie-celebrities">
            <li v-for="item in staff">
              <a class="link">
                <img class="img noneBg lazy"
                     :data-lazy-src="item.photo">
                <span>{{item.name}}</span>
                <span class="movie-celebrities-roles">{{item.role}}</span>
              </a>
            </li>
          </ul>
        </section>
      </div>
      <Footer/>
    </div>
    <Loading v-if="pageStatus === 'loading'"/>
  </div>
</template>

<script>

  import {mapGetters, mapActions} from 'vuex'

  import {TitleManage} from '../utils/Manage';
  import LazyLoader from '../utils/LazyLoader';

  import RatingBar from './common/RatingBar';
  import Footer from './Footer';
  import Loading from './common/Loading'

  export default {
    name: "movie-page",
    //mixins: [mixin],
    components: {
      RatingBar,
      Footer,
      Loading
    },
    data() {
      return {
        pageStatus: 'loading',
        LazyLoader: null,

        // 影片id
        movieId: '',
        // 影片海报
        bgimg: '',
        posterUrl: '',
        // 影片名称
        movieName: '',
        movieEnm: '',
        // 评分
        score: 0,
        snum: 0,
        // 类型
        cat: '',
        // 上映地区
        src: '',
        // 时长
        dur: '',
        pubDesc: '',
        // 简介
        dra: '',

        egg: false,

        // 演职人员
        staff: []
      }
    },
    computed: {
      ...mapGetters([
        'movieInfo'
      ])
    },
    methods: {

      ...mapActions({
        getMovieInfo: 'GET_MOVIE_INFO'
      }),

      // 加载数据
      fetchData: function (movieId) {

        this.getMovieInfo({movieId})
          .then(() => {
            this.bgimg = this.movieInfo.bgimg;
            this.posterUrl = this.movieInfo.posterUrl;
            this.movieName = this.movieInfo.nm;
            this.movieEnm = this.movieInfo.enm;
            this.score = this.movieInfo.sc;
            this.snum = this.movieInfo.snum;
            this.cat = this.movieInfo.cat;
            this.src = this.movieInfo.src;
            this.dur = this.movieInfo.dur;
            this.pubDesc = this.movieInfo.pubDesc;
            this.dra = this.movieInfo.dra;
            this.egg = this.movieInfo.egg;
            this.staff = this.movieInfo.staff;
            this.pageStatus = 'completed';

            this.$nextTick(function () {
              if (this.staff.length > 0 && !this.LazyLoader)
                this.LazyLoader = new LazyLoader({
                  el: '.movie-celebrities',
                  orientation: 'horizontal'
                });
            });
          })
          .catch(e => console.log(e))
      },
      // 初始化
      initLayout: function () {

        var intro = this.$refs.intro;
        var expander = this.$refs.expander;

        intro.dataset.status = 'closed';
        intro.classList.remove('text-expander-expand-true');
        expander.style.maxHeight = '';
      },

      // 展开详细
      expandCloseContent: function () {
        var intro = this.$refs.intro;
        var status = intro.dataset.status;
        var expander = this.$refs.expander;

        if (status === 'closed') {
          intro.dataset.status = 'open';
          intro.classList.add('text-expander-expand-true');
          expander.style.maxHeight = this.$refs.context.clientHeight / window.devicePixelRatio + 'rem';
        } else {
          intro.dataset.status = 'closed';
          intro.classList.remove('text-expander-expand-true');
          expander.style.maxHeight = '';
        }
      },

      // 到影院列表
      toCinemaPage: function () {
        // 设置标题
        TitleManage.setTitleInfo('cinema', this.movieInfo.nm);
        // 页面跳转
        this.$router.push({name: 'cinema', params: {movieId: this.movieId}});
      }
    },
    watch: {
      '$route': function (newVal, oldVal) {

        if (newVal.name !== 'movie') return;
        var movieId = newVal.params.movieId;
        if (movieId !== this.movieId) {
          this.pageStatus = 'loading';
          this.LazyLoader = null;
          this.movieId = movieId;

          this.initLayout();
          this.fetchData(this.movieId);
        }
      }
    },
    created() {
      this.movieId = this.$route.params.movieId;
      this.fetchData(this.movieId)
    }
  }
</script>

<style scoped>
  @import "../assets/css/movie.css";
</style>
