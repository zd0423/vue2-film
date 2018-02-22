<template>
  <div>
    <div ref="ratingBar" class="rating">
      <img class="img noneBg" v-for="start in starts" :src="start"/>
      <span>{{score}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "rating-bar",
    props: {
      score: {
        typeL: Number,
        required: true
        // default: function () {
        //   return 0;
        // }
      }
    },
    data: function () {
      return {
        full: 'http://ms0.meituan.net/canary/img/star-full-new.png',
        half: 'http://ms0.meituan.net/canary/img/star-half-new.png',
        empty: 'http://ms0.meituan.net/canary/img/star-empty-new.png',
      }
    },
    methods: {

      buildStarts: function (score) {
        //debugger;
        var starts = [];

        // 整星个数
        var fullCount = parseInt(score / 2);
        // 半星个数
        var halfCount = score % 2 === 0 ? 0 : 1;

        for (var i = 0; i < 5; i++) {

          if (i < fullCount) {
            starts.push(this.full);
          } else if (halfCount !== 0) {
            halfCount = 0;
            starts.push(this.half);
          } else {
            starts.push(this.empty);
          }
        }
        return starts;
      }
    },
    // watch: {
    //   'score': function (newVal, oldVal) {
    //     // this.score <=> newVal
    //     if(this.score !== oldVal)
    //       this.starts = this.buildStarts(this.score);
    //   }
    // },
    computed: {
      starts: function () {
        return this.buildStarts(this.score);
      }
    },
    // created() {
    //   // console.log(this.score);
    //   // this.starts = this.buildStarts(this.score);
    // }
  }
</script>

<style scoped>
  @import "../../assets/css/ratingBar.css";
</style>
