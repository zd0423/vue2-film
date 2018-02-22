<template>
  <div>
    <div id="order">
      <div class="buy-time">请在<i ref="timerDown"></i>内完成支付</div>
      <dl class="buy-content" style="padding:0;">
        <dt class="cont-title">影票信息</dt>&nbsp;
        <dd class="w-box">
          <dl class="buy-information">
            <dt>影院</dt>
            <dd>{{orderInfo.cinemaName}}</dd>
            <dt>电影</dt>
            <dd>{{orderInfo.movieName}}</dd>
            <dt>场次</dt>
            <dd><i>{{orderInfo.showInfo}}</i></dd>
            <dt>座位</dt>
            <dd>{{orderInfo.hallName}}<br>
              {{seats.join(' ')}}
            </dd>
          </dl>
        </dd>
        <dt class="cont-title">接收短信手机号码</dt>
        <dd class="w-box buy-mob">
          <input ref="userPhone" type="tel" name="user_phone" :value="orderInfo.mobilePhone">
          <span class="btn-close" @click="clearUserPhone">×</span>
        </dd>
        <dt class="cont-title">结算信息</dt>
        <dd class="w-box buy-coupon">
          <ul>
            <li><span class="name">总价：</span><span class="value">29元</span></li>
            <li>
              <span class="name">还需支付：</span>
              <span class="value">
                <span class="num coupon-value">{{orderInfo.sellMoney}}</span>元</span>
            </li>
          </ul>
        </dd>
      </dl>
      <div class="buy-btn">
        <em>请仔细<i id="J-check">核对</i>购票信息，出票后<i>不支持退换</i></em>
        <button type="submit" class="btn-block btn-pay background-color">确认支付</button>
      </div>
    </div>
    <div id="J_BuyCards"></div>
  </div>
</template>

<script>

  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: "createOrder",
    data() {
      return {
        orderId: '',
        orderInfo: {},
        seats: []
      }
    },
    computed: {
      ...mapGetters([
        'order'
      ])
    },
    methods: {

      ...mapActions({
        getOrder: 'GET_ORDER'
      }),

      init: function (orderId) {
        this.getOrder({orderId})
          .then(() => {
            this.orderInfo = this.order.order;
            for (var seat of this.orderInfo.seats.list) {
              this.seats.push(seat.rowId + '排' + seat.columnId + '座');
            }
          })
          .catch(e => console.log(e));
      },

      // 倒计时
      timerDown: function (el, count) {

        if (!el) throw new Error('请传入有效的el');
        if (!Number.isInteger(count)) throw new Error('count 必须为整数');

        var m = Math.floor(count / 60);
        var s = count % 60;

        el.innerHTML = (m ? m + '分' : '') + s + '秒';
      },

      clearUserPhone: function () {

        var userPhone = this.$refs.userPhone;
        userPhone.value = '';
      }
    },
    created() {
      this.orderId = this.$route.params.orderId;
      this.init(this.orderId);
    },
    mounted() {

      var count = 15 * 60;
      var el = this.$refs.timerDown;

      this.timerDown(el, count);
      var timer = setInterval(() => {
        if (!--count) clearInterval(timer);
        this.timerDown(el, count);
      }, 1000);
    }
  }
</script>

<style scoped>
  @import "../assets/css/createOrder.css";
</style>
