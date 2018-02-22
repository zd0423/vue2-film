// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router/router'
import store from './store/store'
import App from './App'

Vue.config.productionTip = false;

(function (window, document) {
  'use strict';
  var hotcss = {};
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

  (function () {
    var viewportEl = document.querySelector('meta[name="viewport"]'),
      dpr = window.devicePixelRatio || 1,
      maxWidth = 540;

    dpr = dpr >= 3 ? 3 : (dpr >= 2 ? 2 : 1);

    document.documentElement.setAttribute('data-dpr', dpr);
    hotcss.dpr = dpr;

    //document.documentElement.setAttribute('max-width', maxWidth);
    hotcss.maxWidth = maxWidth;

    var scale = 1 / dpr,
      content = 'width=device-width, initial-scale=' + scale + ', minimum-scale=' + scale + ', maximum-scale=' + scale + ', user-scalable=no'

    if (viewportEl) {
      viewportEl.setAttribute('content', content);
    } else {
      viewportEl = document.createElement('meta');
      viewportEl.setAttribute('name', 'viewport');
      viewportEl.setAttribute('content', content);
      document.head.appendChild(viewportEl);
    }
  })();

  hotcss.mresize = function () {
    // css px
    // 视口缩小为 1/dpr，(物理像素密度不变，在缩小1/dpr后， 变为dpr倍 css计量)
    var clientWidth = document.documentElement.clientWidth;
    // 保证缩放前宽短不超过450
    if (hotcss.maxWidth && (clientWidth / hotcss.dpr > hotcss.maxWidth)) {
      clientWidth = hotcss.maxWidth * hotcss.dpr;
    }
    if (!clientWidth) {
      return false;
    }
    // 以宽度 375px，fontSize 50px 为基准 （未缩放）
    var base = 375 / 50;
    // (clientWidth / dpr) / (fontSize / dpr) = base(375 / 50)
    var htmlSize = clientWidth / base;
    htmlSize = htmlSize < 50 ? 50 : htmlSize;
    document.documentElement.style.fontSize = htmlSize + 'px';
  };

  if (!document.addEventListener) return;
  window.addEventListener(resizeEvt, hotcss.mresize, false);
  document.addEventListener('DOMContentLoaded', hotcss.mresize, false);
  hotcss.mresize();
})(window, document);


(function () {
  Number.isInteger = Number.isInteger || function (value) {
    return typeof value === "number" &&
      isFinite(value) &&
      Math.floor(value) === value;
  };
})();

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
});
