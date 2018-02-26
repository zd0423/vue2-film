/**
 *
 * @param option
 * @constructor
 */
const LazyLoader = function LazyLoader(option) {
  this.init(option);
};

/**
 *
 * @type {{}}
 */
LazyLoader.prototype.config = {

  orientation: 'vertical',//  horizontal
  addListener: true
};

/**
 *
 * @param option
 */
LazyLoader.prototype.init = function (option) {

  this.timer = undefined;
  // 获取节点
  this.node = document.querySelector(option.el);
  // 设置滚动方向
  if (option.orientation) this.config.orientation = option.orientation;
  // 获取发生滚动的节点
  this.scrollView = this.getScrollView(this.node);
  // 获取视口
  this.viewport = this.getViewport(this.scrollView);
  // 获取img标签
  var imgTags = this.getImgTags();

  for (var i = 0; i < imgTags.length; i++) {
    // 标记是否加载图片
    //imgTags[i].setAttribute("data-lazy-loaded", false);
    // 获取所以url
    this.loadImg(imgTags[i]);
  }

  // 是否添加监听
  if(option.addListener === undefined || option.addListener)
    this.addListener(this.scrollView)
};


/**
 * 获取所有img标签
 * @returns {*}
 */
LazyLoader.prototype.getImgTags = function () {

  return this.node.querySelectorAll('img.lazy:not([data-lazy-loaded=true])');
};

/**
 * 获取发生滚动的节点
 * @param node
 * @returns {Window}
 */
LazyLoader.prototype.getScrollView = function (node) {
  var orientation = this.config.orientation === 'horizontal' ? 'overflowX' : 'overflowY';
  var overflow = window.getComputedStyle(node)[orientation];
  var scrollView = (overflow === 'auto' || overflow === 'scroll') ? node : window;
  return scrollView;
};

/**
 * 获取视口
 * @param scrollView
 * @returns {{}}
 */
LazyLoader.prototype.getViewport = function (scrollView) {
  // top, bottom, left, right
  var doc = document.documentElement;

  if (scrollView.self === scrollView)
    return {top: 0, bottom: doc.clientHeight, left: 0, right: doc.clientWidth};

  var viewport = {};
  var rect = scrollView.getBoundingClientRect();

  viewport.top = rect.top > 0 ? rect.top : 0;
  viewport.bottom = rect.bottom > doc.clientHeight ? doc.clientHeight : rect.bottom;
  viewport.left = rect.left > 0 ? rect.left : 0;
  viewport.right = rect.right > doc.clientWidth ? doc.clientWidth : rect.right;

  return viewport;
};

/**
 * 判断是否为有效区域
 * @param elem
 * @returns {boolean}
 */
LazyLoader.prototype.isVisibleArea = function (elem) {

  var result = false;
  // 获取目标元素与视口的位置关系
  var elemRect = elem.getBoundingClientRect();
  // 判断滚动方向 水平、竖直
  //debugger;
  if (this.config.orientation === 'horizontal') {
    if (elemRect.right > this.viewport.left && elemRect.left < this.viewport.right) result = true;
  } else {
    //if(elemRect.top > viewport.bottom && elemRect.bottom > viewport.top) return true;
    if (elemRect.bottom > this.viewport.top && elemRect.top < this.viewport.bottom) result = true;
  }
  return result;
};

/**
 * 添加监听
 * @param scrollView
 */
LazyLoader.prototype.addListener = function (scrollView) {

  // 滚动监听
  scrollView.addEventListener('scroll', function () {
    //var self = this;

    // 节流（防抖）
    if (this.timer) clearTimeout(this.timer);
    var imgTags = this.getImgTags();
    this.timer = setTimeout(function () {
      for (var i = 0; i < imgTags.length; i++) {
        this.loadImg(imgTags[i]);
      }
    }.bind(this), 250);
  }.bind(this));
};

/**
 * 对外抛出滚动监听方法
 */
LazyLoader.prototype.scrollListener = function () {
  var imgTags = this.getImgTags();
  for (var i = 0; i < imgTags.length; i++) {
    this.loadImg(imgTags[i]);
  }
};

/**
 * 加载图片
 * @param elem
 */
LazyLoader.prototype.loadImg = function (elem) {

  // 判断图片是否加载
  var isLoaded = elem.getAttribute("data-lazy-loaded");
  // 判断是否在可见区域 并 是否需要加载图片
  if (!(this.isVisibleArea(elem) && isLoaded != 'true')) return;

  // 获取待加载图片地址
  var src = elem.getAttribute('data-lazy-src');
  // 加载图片
  var img = new Image();
  /*
   当图片加载过一次以后，如果再有对该图片的请求时，
   由于浏览器已经缓存住这张图片了，不会再发起一次新的请求，而是直接从缓存中加载过来。
   对于 firefox和safari，它们视图使这两种加载方式对用户透明，
   同样会引起图片的onload事件，而ie和opera则忽略了这种同一性，不会引起图片的onload事件，
   因此上边的代码在它们里边不能得以实现效果
  */
  /*if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
      //callback.call(img);
      return; // 直接返回，不用再处理onload事件
  }*/
  // 当图像装载完毕时调用的事件句柄。
  img.onload = function () {
    //console.log('图片加载成功');
    img.onload = null;
    img = null;
    elem.src = src;
    elem.setAttribute("data-lazy-loaded", true);
  };
  // 在装载图像的过程中发生错误时调用的事件句柄。
  img.onerror = function () {
    console.log(img.src);
    img.onerror = null;
    img = null;
    //console.log('图片加载失败');
  };
  img.src = src;
};

export default LazyLoader;
