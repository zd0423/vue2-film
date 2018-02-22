var MovieWallBuilder = function MovieWall(option) {
  this.init(option);
};

/**
 * 工具函数
 * @type {{isMobile: MovieWall.util.isMobile, preventDefault: MovieWall.util.preventDefault}}
 */
MovieWallBuilder.prototype.util = {

  isMobile: function () {
    var sUserAgent = navigator.userAgent.toLowerCase(),
      bIsIpad = sUserAgent.match(/ipad/i) == "ipad",
      bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os",
      bIsMidp = sUserAgent.match(/midp/i) == "midp",
      bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4",
      bIsUc = sUserAgent.match(/ucweb/i) == "ucweb",
      bIsAndroid = sUserAgent.match(/android/i) == "android",
      bIsCE = sUserAgent.match(/windows ce/i) == "windows ce",
      bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile",
      bIsWebview = sUserAgent.match(/webview/i) == "webview";
    return (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM);
  },
  preventDefault: function (e) {
    var e = e || window.event;
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }
};

/**
 *
 * @type {{maxLeft: number, minLeft: number, startX: number, disX: number, isDown: boolean, startLeft: number, duration: number, callback: undefined}}
 */
MovieWallBuilder.prototype.config = {
  // 最大、最小偏移量（left）
  maxLeft: 0,
  minLeft: 0,
  // 判断是否按下
  isDown: false,
  // 按下时偏移量（left）
  startLeft: 0,
  // 按下时X坐标
  startX: 0,
  // X滑动距离
  disX: 0,
  // 持续时长
  duration: 5,
  // 回调函数
  callback: undefined
};

/**
 * 初始化
 * @param option
 */
MovieWallBuilder.prototype.init = function (option) {

  var config = this.config;
  // 初始化参数
  if (!option.el) throw new Error('请传入有效的el');

  if (option.duration) config.duration = option.duration;
  if (option.callback) config.callback = option.callback;

  this.sliderNode = document.querySelector(option.el);
  // // 设置并获取子节点信息
  // for (var i = 0; i < this.sliderNode.children.length; i++) {
  //   this.sliderNode.children[i].setAttribute('data-index', i);
  // }
  //debugger;
  var childNode = this.sliderNode.children[0];
  this.childNodeWidth = childNode.clientWidth;
  // 设置滑块信息
  this.sliderNode.style.width = this.childNodeWidth * this.sliderNode.children.length + 'px';
  this.sliderNode.style.left = '0px';
  // 设置偏移量，保证第一个或最后一个子节点显示在屏幕中间
  this.sliderNode.style.paddingLeft = this.sliderNode.style.paddingRight = this.sliderNode.parentNode.clientWidth / 2 - this.childNodeWidth / 2 + 'px';

  // 最大、最小left值 （this.sliderNode.clientWidth 包括上一步设置的padding值）
  config.maxLeft = this.sliderNode.clientWidth - this.sliderNode.parentNode.clientWidth;
  config.minLeft = 0;

  // 获取选中节点
  this.selectedNode = this.sliderNode.querySelector('.selected');
  this.selectedIndex = this.selectedNode.dataset.index;

  // 滑动到指定位置
  this.scrollToSelectedNode(option.selectedIndex || 0, config.callback);

  // 绑定事件
  this.bindTouchEvent();
};

/**
 * 鼠标或手指按下
 * @param e
 */
MovieWallBuilder.prototype.touchstart = function (e) {

  var config = this.config;
  var e = e || window.event;   //要判断使用哪种event
  config.isDown = true;
  // 区分动作
  var touchEvent = this.util.isMobile() ? e.touches[0] : e;
  config.startX = touchEvent.clientX;
  // 获取选中节点和选中索引
  this.selectedNode = this.sliderNode.querySelector('.selected');
  // selectedIndex 也表示 selectedNode 子元素的索引
  this.selectedIndex = this.selectedNode.dataset.index;
  // 获取开始时的left
  config.startLeft = this.sliderNode.offsetLeft;

  this.util.preventDefault(e);
};

/**
 * 鼠标或手指滑动
 * @param e
 */
MovieWallBuilder.prototype.touchmove = function (e) {

  var config = this.config;
  if (!config.isDown) return;
  var e = e || window.event;
  var touchEvent = this.util.isMobile() ? e.touches[0] : e;
  // 获取滑动距离
  var endX = touchEvent.clientX;
  config.disX = endX - config.startX;
  // 区分点击事件
  //if (Math.abs(config.disX) > 20) {
  //this.util.preventDefault(e);
  // 产生滑动效果
  this.sliderNode.style.left = config.startLeft + config.disX + 'px';
  //return true;
  //}
};

/**
 * 鼠标或手指离开
 * @param e
 */
MovieWallBuilder.prototype.touchend = function (e) {

  var config = this.config;
  var e = e || window.event;

  // 区分点击事件
  if (Math.abs(config.disX) <= 20) {
    this.reset();
    // 执行点击事件
    this.click(e, config.callback);
    return;
  }

  this.reset();
  // 四舍五入, 获取拖动结束后的选中节点的索引
  this.selectedIndex = Math.round(Math.abs(this.sliderNode.offsetLeft) / this.childNodeWidth);
  // 左边界
  if (this.sliderNode.offsetLeft <= -config.maxLeft) {
    this.selectedIndex = this.sliderNode.children.length - 1;
  }
  // 右边界
  if (this.sliderNode.offsetLeft >= config.minLeft) {
    this.selectedIndex = 0;
  }
  // 滑动
  this.scrollToSelectedNode(this.selectedIndex, config.callback);
  return;
};

/**
 * 滑动
 * @param e
 * @param cb
 */
MovieWallBuilder.prototype.scrollToSelectedNode = function (selectedIndex, cb) {

  var self = this;

  var sliderNode = self.sliderNode;
  var childNodeWidth = self.childNodeWidth;

  // // 使新的选中节点处于中间位置
  // this.sliderNode.style.left = -this.selectedIndex * this.childNodeWidth + 'px';
  // // 样式变更
  // config.selectedNode.classList.remove('selected');
  // config.selectedNode = this.sliderNode.children[config.selectedIndex];
  // config.selectedNode.classList.add('selected');


  // 当前位置
  var curLeft = sliderNode.offsetLeft;
  // 目标位置
  var target = -selectedIndex * childNodeWidth; //sliderNode.offsetLeft 的值永远小于等于0(left)，且被选中的元素处于中间位置， 所以用 -selectedIndex,
  // 移动速度
  var speed = Math.abs(Math.abs(target) - Math.abs(curLeft)) / self.config.duration;

  // 滑动效果
  function sliding() {
    // 判断移动方向
    if (target > curLeft) { // 向右
      //
      var distance = sliderNode.offsetLeft + speed > target ? target : sliderNode.offsetLeft + speed;
      sliderNode.style.left = distance + 'px';

      cancelAnimationFrame(handle);
      if (sliderNode.offsetLeft < -selectedIndex * childNodeWidth)
        requestAnimationFrame(sliding);
      else
        self.changeSelectedNode(selectedIndex);

    } else if (target < curLeft) { // 向左移动
      // 要移动到位置与目标值比较，若小于目标位置表示 移过 ，则去目标值作为移动距离
      var distance = sliderNode.offsetLeft - speed < target ? target : sliderNode.offsetLeft - speed;
      sliderNode.style.left = distance + 'px';

      cancelAnimationFrame(handle);
      if (sliderNode.offsetLeft > -selectedIndex * childNodeWidth)
        handle = requestAnimationFrame(sliding);
      else
        self.changeSelectedNode(selectedIndex);
    }
  }

  // 开始滑动
  var handle = requestAnimationFrame(sliding);
  //
  if (typeof cb === 'function') {
    cb(selectedIndex);
  }
};

/**
 *
 * @param selectedIndex
 */
MovieWallBuilder.prototype.changeSelectedNode = function (selectedIndex) {

  var config = this.config;

  // 样式变更，变换选中节点
  this.selectedNode.classList.remove('selected');
  //
  this.selectedNode = this.sliderNode.children[selectedIndex].children[0];
  this.selectedNode.classList.add('selected');
};

/**
 * 参数重置
 */
MovieWallBuilder.prototype.reset = function () {

  var config = this.config;

  config.startX = 0;
  config.disX = 0;
  config.isDown = false;
  config.startLeft = 0;
};

/**
 * 点击事件
 * @param e
 * @param cb
 */
MovieWallBuilder.prototype.click = function (e, cb) {
  //e.target.tagName);
  var target = e.target.tagName === "A" ? e.target : e.target.parentNode;
  if (target.dataset.index) {
    this.selectedIndex = target.dataset.index;
    this.scrollToSelectedNode(this.selectedIndex, cb);
  }
};

/**
 * 绑定事件
 */
MovieWallBuilder.prototype.bindTouchEvent = function () {

  var touchStartEvent, touchMoveEvent, touchEndEvent;
  touchStartEvent = this.util.isMobile() ? 'touchstart' : 'mousedown';
  touchMoveEvent = this.util.isMobile() ? 'touchmove' : 'mousemove';
  touchEndEvent = this.util.isMobile() ? 'touchend' : 'mouseup';

  this.sliderNode.addEventListener(touchStartEvent, this.touchstart.bind(this));
  this.sliderNode.addEventListener(touchMoveEvent, this.touchmove.bind(this));
  this.sliderNode.addEventListener(touchEndEvent, this.touchend.bind(this));
};

export default MovieWallBuilder;



