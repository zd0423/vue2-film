<template>
  <div class="footer">
    <!--  -->
    <div v-if="type === 'detailed'">
      <!--<div class="btn-group clearfix">-->
        <!--<div class="user-action">-->
          <!--<router-link :to="{name: 'login'}" class="link btn btn-login">-->
            <!--<span>登录</span>-->
          <!--</router-link>-->
          <!--<a class="link btn btn-signup">-->
            <!--<span>注册</span>-->
          <!--</a>-->
        <!--</div>-->
        <!--<router-link :to="{name: 'city'}" class="link btn btn-city">-->
          <!--<span>城市: </span>-->
          <!--<span class="change-city">{{city}}</span>-->
        <!--</router-link>-->
      <!--</div>-->
      <div class="footer-misc">
        <div class="copyright">
          <span>
            <span>© 猫眼电影 客服电话: </span>
            <a href="tel:10105335">1010-5335</a>
          </span>
        </div>
        <p class="icp">
          <a href="http://www.miibeian.gov.cn" class="link" target="_blank">
            <span>京ICP备16022489号-1</span>
          </a>
          <span>&nbsp;</span>
          <a href="http://www.beian.gov.cn" class="link" target="_blank">
            <span>京公网安备11010502030881号</span>
          </a>
        </p>
        <p class="sankuai">
          <a href="javascript:void(0)" class="link">
            <span>北京猫眼文化传媒有限公司</span>
          </a>
        </p>
      </div>
    </div>
    <!--  -->
    <div class="copyright" v-if="type === 'simple'">
      <span class="copyright">© 猫眼电影 客服电话：<a href="tel:4006705335">400-670-5335</a></span>
    </div>
    <!--  -->
    <div v-if="type === 'flink'">
      <div class="footer-links">友情链接：<a class="theme-color" href="//m.maoyan.com">猫眼电影</a></div>
      <div class="footer-line footer-copyright">
        <div class="hr"></div>
        <span class="footer-copyright-text">©2017 美团网 <a>京ICP证070791号</a></span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "footer-view",
    props: {
      // footer 类型
      type: {
        type: String,
        default: function () {
          return 'detailed'
        }
      }
    },
    computed: {
      city: function () {
        return this.$store.getters.cityName
      }
    }
  }
</script>

<style scoped>
  @import "../assets/css/footer.css";
</style>
