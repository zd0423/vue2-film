<template>
  <ul ref="sliderBar" class="sliderBar">
    <li ref="leftTab" class="active" data-target="leftTab">
      <a class="tab">{{tabNameL}}</a>
    </li>
    <li ref="rightTab" class="" data-target="rightTab">
      <a class="tab">{{tabNameR}}</a>
    </li>
    <div ref="slider" class="slider"></div>
  </ul>
</template>

<script>
  export default {
    name: "slider-bar",
    props: {
      tabNameL: {
        type: String,
        required: true
      },
      tabNameR: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        sliderBar: '',
        leftTab: '',
        rightTab: '',
        slider: '',
        startPoint: 0
      }
    },
    methods: {

      init: function () {
        this.sliderBar = this.$refs.sliderBar;
        this.leftTab = this.$refs.leftTab;
        this.rightTab = this.$refs.rightTab;
        this.slider = this.$refs.slider;
        // 记录滑条初始位置
        this.startPoint = this.slider.offsetLeft;
      },

      // 切换导航
      switchBar: function () {
        var self = this;

        var sliderBar = self.sliderBar;
        var leftTab = self.leftTab;
        var rightTab = self.rightTab;
        var slider = self.slider;
        var startPoint = self.startPoint;

        sliderBar.addEventListener('click', function (e) {

          var target = e.target.tagName === 'LI' ? e.target : e.target.parentNode;

          if (target.dataset.target === 'leftTab') {

            // 判断滑条现在的位置 是否大于 初始位置，若大于向左滚动
            if (startPoint < slider.offsetLeft)
            // 计算滚动距离
              slider.style.left = startPoint + 'px';

            // 切换样式
            if (!target.classList.contains('active')) target.classList.add('active');
            if (rightTab.classList.contains('active')) rightTab.classList.remove('active');

            self.$emit('switchTab', {selectedTab: 'leftTab'});

            return;
          }


          if (target.dataset.target === 'rightTab') {

            // 判断滑条初始位置是否大于现在的位置，若大于向右滚动
            if (startPoint >= slider.offsetLeft)
            // 计算滚动距离
              slider.style.left = startPoint + slider.offsetWidth + 'px';

            // 切换样式
            if (!target.classList.contains('active')) target.classList.add('active');
            if (leftTab.classList.contains('active')) leftTab.classList.remove('active');

            self.$emit('switchTab', {selectedTab: 'rightTab'});

            return;
          }
        });
      }
    },
    mounted() {
      this.init();
      this.switchBar();
    }
  }
</script>

<style scoped>
  @import "../../assets/css/sliderBar.css";
</style>
