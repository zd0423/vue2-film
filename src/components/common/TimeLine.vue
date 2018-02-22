<template>
  <div>
    <ul ref="timeline" class="time-line">
      <li v-for="(item, i) in timeInfo"
          :class=" i === selectedIndex ? 'time active': 'time' "
          :data-index="i"
          :data-date="item.showDate">{{item.dateShow}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    //
    name: "time-line-menu",
    // 不允许改变
    props: {
      timeInfo: {
        type: Array,
        required: true,
        validator: function (value) {
          return value.length > 0
        }
      },
      initialIndex: {
        type: Number,
        default: function () {
          return 0;
        },
        validator: function (value) {
          return value >= 0;
        }
      }
    },
    //
    data() {
      return {
        timeLine: null,
        ulWidth: 0,
        sliderWidth: 0,
        paddingRight: 0,
        paddingLeft: 0,

        selectedIndex: this.initialIndex
      }
    },
    watch: {
      'timeInfo': function (newVal) {
        this.selectedIndex = 0;
      }
    },

    methods: {

      // 初始化
      init: function () {

        this.timeLine = this.$refs.timeline;
        this.ulWidth = this.timeLine.offsetWidth;
        this.sliderWidth = this.timeLine.children[0].offsetWidth;

        var style = window.getComputedStyle(this.timeLine);
        this.paddingRight = +(style.paddingRight.replace("px", ''));
        this.paddingLeft = +(style.paddingLeft.replace("px", ''));

        this.scroll(this.selectedIndex);
        // 添加监听
        this.addClickListener();
      },

      // 点击事件
      addClickListener: function () {
        var self = this;
        // 添加监听
        this.timeLine.addEventListener('click', function (e) {
          var target = e.target;
          if (target.tagName !== 'LI') return;

          var proSelectedIndex = self.selectedIndex;
          self.selectedIndex = +target.dataset.index;
          var date = target.dataset.date;
          // 互动
          self.scroll(self.selectedIndex);
          // 发出事件
          self.$emit('timeLineClick', {
            proSelectedIndex: proSelectedIndex,
            selectedIndex: self.selectedIndex,
            selectedDate: date
          });
        });
      },

      // 滑动
      scroll: function (selectedIndex) {

        var self = this;

        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
          window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

        // 获取最大滚动值
        var maxScrollX = this.timeLine.children.length * self.sliderWidth - (self.ulWidth - self.paddingLeft - self.paddingRight);
        // 最小滚动值
        var minScrollX = 0;
        // 所点击元素位置
        var w = (+selectedIndex + 1) * self.sliderWidth;
        // 计算选中节点到指定位置，所需滚动的距离
        var targetScrollX = w - ((this.ulWidth - self.paddingLeft - self.paddingRight) / 2) - self.sliderWidth / 2;
        // 小于最小时
        if (targetScrollX < minScrollX) targetScrollX = 0;
        // 大于最大时
        if (targetScrollX > maxScrollX) targetScrollX = maxScrollX;

        // 滑动效果
        function sliding() {
          // // 向后滚
          // if (self.timeLine.scrollLeft > targetScrollX) {
          //   var distance = self.timeLine.scrollLeft - 20 < targetScrollX ? targetScrollX : self.timeLine.scrollLeft - 20;
          //   self.timeLine.scrollTo(distance, 0);
          //   //if (self.timeLine.scrollLeft > targetScrollX) {
          //   if (!(Math.abs(self.timeLine.scrollLeft - targetScrollX) < 2)) {
          //     cancelAnimationFrame(timer);
          //     timer = requestAnimationFrame(sliding);
          //   }
          // }
          // // 向前滚
          // if (self.timeLine.scrollLeft < targetScrollX) {
          //   var distance = self.timeLine.scrollLeft + 20 > targetScrollX ? targetScrollX : self.timeLine.scrollLeft + 20;
          //   self.timeLine.scrollTo(distance, 0);
          //   // if (self.timeLine.scrollLeft < targetScrollX) {
          //   if (!(Math.abs(self.timeLine.scrollLeft - targetScrollX) < 2)) {
          //     cancelAnimationFrame(timer);
          //     timer = requestAnimationFrame(sliding);
          //   }
          // }

          var distance = self.timeLine.scrollLeft;
          // 判断滚动方向
          if (self.timeLine.scrollLeft > targetScrollX) { // 向后滚
            distance = self.timeLine.scrollLeft - 20 < targetScrollX ? targetScrollX : self.timeLine.scrollLeft - 20;
          } else { // 向前滚
            distance = self.timeLine.scrollLeft + 20 > targetScrollX ? targetScrollX : self.timeLine.scrollLeft + 20;
          }
          // 滚动
          self.timeLine.scrollTo(distance, 0);

          cancelAnimationFrame(handle);
          // self.timeLine.scrollLeft 获取的数值为整数，targetScrollX的数值可能为小数，因而采用绝对值，控制误差范围
          if (Math.abs(self.timeLine.scrollLeft - targetScrollX) >= 5) {
            handle = requestAnimationFrame(sliding);
          }

          // // self.timeLine.scrollLeft 获取的数值为整数，targetScrollX的数值可能为小数，因而采用绝对值，控制误差范围
          // if (Math.abs(self.timeLine.scrollLeft - targetScrollX) >= 2) {
          //   handle = requestAnimationFrame(sliding);
          // } else {
          //   self.timeLine.scrollTo(self.timeLine.scrollLeft, 0);
          // }
        }

        // 触发滑动
        var handle = requestAnimationFrame(sliding);
      }
    },

    mounted() {
      this.init();
    }
  }
</script>

<style scoped>
  @import "../../assets/css/timeLine.css";
</style>
