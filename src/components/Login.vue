<template>
  <div>
    <div ref="topTip" id="topTip"></div>
    <div>
      <SliderBar :tabNameL="'美团账号登陆'" :tabNameR="'手机账号登陆'" @switchTab="changeLoginWay"/>
    </div>
    <div class="login-way">
      <div class="normal-login-way" v-show="normalLoginWay">
        <div>
          <div class="account">
            <input ref="username" id="username" class="input-weak" type="text"
                   placeholder="账户名/手机号/Email" name="email" value="" required>
          </div>
        </div>
        <div>
          <div class="password">
            <input ref="password" id="password" class="input-weak" type="password" placeholder="请输入您的密码" name="password"
                   required="">
          </div>
        </div>
      </div>
      <div class="quick-login-way" v-show="quickLoginWay">
        <!-- 手机号码 -->
        <div>
          <div class="captacha">
            <input ref="mobile" type="tel" name="mobile" class="input-captacha"
                   placeholder="请输入手机号" @input="onMobileInput">
            <button ref="smsCode" type="button" class="btn btn-captacha" disabled @click="getCaptacha">发送验证码</button>
          </div>
        </div>
        <!-- 验证码 -->
        <div>
          <div class="tel">
            <input ref="captacha" class="input-weak" name="code" type="tel" pattern="[0-9]+"
                   placeholder="请输入短信验证码" disabled="disabled">
          </div>
        </div>
      </div>
      <!-- v-show="isShowTip"-->
      <div ref="tip" id="tip" class="tip">请填写该字段</div>
    </div>
    <div class="btn-wrapper">
      <button ref="login" type="submit" class="btn btn-larger btn-block disabled login-btn" @click="doLogin">登录</button>
    </div>
    <Footer :type="2"/>
  </div>
</template>

<script>

  import {mapActions} from 'vuex'

  import SliderBar from './common/SliderBar'
  import Footer from './Footer'

  export default {
    name: "login",
    data() {
      return {
        normalLoginWay: true,
        quickLoginWay: false
      }
    },
    components: {
      SliderBar,
      Footer
    },
    methods: {

      ...mapActions({
        login: 'LOGIN'
      }),

      // 检查手机号码是否正确
      checkMobile: function (value) {
        // 验证手机号码
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        return reg.test(value);
      },

      // 初始化布局
      initView: function () {
        var tip = this.$refs.tip;
        tip.style.left = (document.documentElement.clientWidth - tip.clientWidth) / 2 + 'px';
        tip.style.display = 'none';
        tip.style.visibility = 'visible';
      },

      // 显示tip
      showTip: function (top) {
        var tip = this.$refs.tip;
        // 设置样式
        tip.style.top = top + 'px';
        tip.style.display = '';
        setTimeout(() => {
          tip.style.display = 'none';
        }, 1000);
      },

      // 选择登陆方式
      changeLoginWay: function (result) {

        if (result.selectedTab === 'leftTab') {

          this.normalLoginWay = true;
          this.quickLoginWay = false;
          return;
        }

        if (result.selectedTab === 'rightTab') {

          this.quickLoginWay = true;
          this.normalLoginWay = false;
          return;
        }
      },

      // 监听输入
      onMobileInput: function (e) {
        var target = e.target;
        var value = target.value.trim();
        this.$refs.smsCode.disabled = !this.checkMobile(value);
      },

      // 获取验证码
      getCaptacha: function () {

        var mobile = this.$refs.mobile.value.trim();

        if (!this.checkMobile(mobile)) {
          this.$store.dispatch({
            type: 'OPEN_TIP',
            message: '请输入正确的11位手机号码'
          });
          return;
        }

        var target = e.target;
        // 60秒倒计时
        var count = 60;

        function timerDown() {
          target.innerHTML = --count + '秒';
          // 判断倒计时是否结束
          if (count === 0) {
            clearInterval(timer);
            target.disabled = false;
            target.innerHTML = '再次发送验证码';
          }
        }

        this.$refs.captacha.disabled = false;
        target.disabled = true;
        target.innerHTML = count + '秒';
        // 开始倒计时
        var timer = setInterval(timerDown, 1000);
      },

      // 登陆
      doLogin: function () {

        var account = '';
        var ticket = '';
        var type = '';

        if (this.normalLoginWay) { // 账号密码
          var username = this.$refs.username;
          var password = this.$refs.password;

          // 判断用户名是否为空
          if (!username.value.trim()) {
            //  获取焦点
            username.focus();
            this.showTip(username.offsetTop + username.offsetHeight);
            return;
          }

          // 判断密码是否为空
          if (!password.value.trim()) {
            //  获取焦点
            password.focus();
            this.showTip(password.offsetTop + password.offsetHeight);
            return;
          }

          account = username.value.trim();
          ticket = password.value.trim();
          type = 'normalLoginWay';

        } else { // 快速登陆

          var topTip = this.$refs.topTip;

          var mobile = this.$refs.mobile.value.trim();
          var captacha = this.$refs.captacha.value.trim();

          // 验证手机号码
          if (!this.checkMobile(mobile)) {

            topTip.innerHTML = '请输入正确的手机号';
            topTip.style.display = 'block';
            return;
          }

          // 判断验证码是否为空
          if (!captacha) {
            topTip.innerHTML = '请输入验证码';
            topTip.style.display = 'block';
            return;
          }

          account = mobile;
          ticket = captacha;
          type = 'quickLoginWay';
        }

        // 登陆
        this.login({
          account,
          ticket,
          type
        })
          .then(() => {
            var redirect = this.$route.query.redirect;
            if (redirect)
              this.$router.replace(redirect);
            else
              this.$router.go(-1);
          })
          .catch(e => console.log(e));
      }
    },
    mounted() {
      this.initView();
    }
  }
</script>

<style scoped>
  @import "../assets/css/login.css";
</style>
