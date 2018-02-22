<template>
  <!-- tr 需要绑定点击事件 -->
  <tr @click="booking">
    <td class="stl-time">
      <div class="stl-time-wrap">
        <strong>{{sltInfo.tm}}</strong>
        <em>23:52结束</em>
      </div>
    </td>
    <td class="stl-info">
      <div class="stl-ver">{{sltInfo.lang + " " + sltInfo.tp}}</div>
      <div class="two-line">{{sltInfo.th}}</div>
    </td>
    <td class="stl-price">
      <span class="unit theme-color">
        <span class="stonefont">{{sltInfo.price}}</span>元</span>
      <span class="origin-price">{{sltInfo.extraDesc}}</span>
    </td>
    <td class="stl-buy">
      <a class="stl-btn">选座购票</a>
    </td>
  </tr>
</template>

<script>

  import {TitleManage} from '../../utils/Manage';

  export default {
    name: "show-time-item",
    props: {
      cinemaId: {
        type: String,
        required: true
      },
      movieId: {
        type: String,
        required: true
      },
      // 排片情况
      sltInfo: {
        type: Object,
        required: true
      }
    },
    data() {
      return {}
    },
    methods: {
      booking: function () {
        // 允许订购
        if (this.sltInfo.id) {
          // 获取标题信息
          TitleManage.setTitleInfo('seats', document.title);
          // 页面跳转
          this.$router.push({name: 'seats', params: {id: this.cinemaId}})
        }
      }
    }
  }
</script>

<style scoped>
  @import "../../assets/css/showTimeItem.css";
</style>
