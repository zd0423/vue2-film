<template>
  <li class="cinema-container" @click="selectCinema(cinemaInfo.id, cinemaInfo.name)">
    <!--<router-link :to="{name: 'shows', params: {cinemaId: cinemaInfo.id}}">-->
    <a>
      <div class="cinema-name text-ellipsis">{{cinemaInfo.name}}</div>
      <div class="price theme-color">
        <span class="num">{{cinemaInfo.num}}</span>
        <span>元起</span>
      </div>
      <div>
        <p class="address text-ellipsis">{{cinemaInfo.address}}</p>
      </div>
      <div class="dis" v-if="isShowDis">{{cinemaInfo.dis}}</div>
      <div class="tag-list">
        <div v-for="tag in cinemaInfo.tags">{{tag}}</div>
      </div>
    </a>
    <!--</router-link>-->
  </li>
</template>

<script>
  export default {
    //
    name: "show-item",
    //
    props: {
      cinemaInfo: {
        type: Object,
        required: true
      },
      isShowDis: {
        type: Boolean,
        default: function () {
          return true;
        }
      }
    },
    //
    data() {
      return {}
    },
    //
    methods: {
      // 选择影院
      selectCinema: function (cinemaId, cinemaName) {
        //
        this.$emit('selectCinema', {'cinemaId': cinemaId, 'cinemaName': cinemaName});
      }
    }
  }
</script>

<style scoped>
  @import "../../assets/css/cinemaItem.css";
</style>
