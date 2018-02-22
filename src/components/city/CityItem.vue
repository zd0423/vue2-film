<template>
  <div class="collapse">
    <h3 ref="title">{{title}}</h3>
    <!--<div :class="{ 'hide': isHide }" :data-status="isHide ? 'closed' : 'opened'">-->
    <ul ref="list" class="list-view" :class="{ 'hide': isHide }" :data-status="isHide ? 'closed' : 'opened'">
      <li class="list-view-item" v-for="(city, i) in cities" :key="i" :data-name="city.name" :data-code="city.code">
        {{city.name}}
      </li>
    </ul>
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    name: 'city-item',
    props: {
      index: {
        type: Number,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      cities: {
        ype: Array,
        required: true
      }
    },
    data() {
      return {
        isHide: this.index === 0 ? false : true
      }
    },
    methods: {

      openOrCloseBarEvent: function () {

        var self = this;
        var title = self.$refs.title; // 返回 所有h3

        title.addEventListener('click', function (e) {

          // 获取下一个相邻节点 (nextElementSibling的兼容性？)
          var nextSibling = this.nextElementSibling;
          var dataset = nextSibling.dataset;

          if (dataset.status === 'opened') {
            dataset.status = 'closed';
            self.isHide = true;
            //nextSibling.classList.add('hide');
          } else {
            dataset.status = 'opened';
            self.isHide = false;
            //nextSibling.classList.remove('hide');
          }
        })
      },

      // 选择城市（父子组件通信）
      selectCityEvent: function () {

        var self = this;
        var list = this.$refs.list;

        list.addEventListener('click', function (e) {

          var target = e.target;
          if (target.tagName === 'LI') {

            // 向外传递事件
            self.$emit('selectCity', target.dataset.name, target.dataset.code);
          }
        });
      }
    },
    created() {

    },
    mounted() {
      this.openOrCloseBarEvent();
      this.selectCityEvent();
    }
  }
</script>

<style scoped>
  @import "../../assets/css/cityItem.css";
</style>
