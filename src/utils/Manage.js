/**
 * LocalManage
 * @type {{getItem: LocalManage.getItem, setItem: LocalManage.setItem, removeItem: LocalManage.removeItem, clear: LocalManage.clear}}
 */
var LocalManage = {

  /**
   *
   * @param key
   * @returns {string | null}
   */
  getItem: function (key) {
    return sessionStorage.getItem(key);
  },

  /**
   *
   * @param key
   * @param value
   */
  setItem: function (key, value) {
    if (typeof value === 'object') value = JSON.stringify(value);
    sessionStorage.setItem(key, value);
  },

  /**
   *
   * @param key
   */
  removeItem: function (key) {
    sessionStorage.removeItem(key)
  },

  /**
   *
   */
  clear: function () {
    sessionStorage.clear();
  },
};

/**
 * CookieManage
 * @type {{getItem: CookieManage.getItem, setItem: CookieManage.setItem, removeItem: CookieManage.removeItem, hasItem: CookieManage.hasItem, keys: CookieManage.keys}}
 */
var CookieManage = {

  getItem: function (sKey) {
    if (!sKey) {
      return null;
    }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          // sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          /*
          Note: Despite officially defined in RFC 6265, the use of `max-age` is not compatible with any
          version of Internet Explorer, Edge and some mobile browsers. Therefore passing a number to
          the end parameter might not work as expected. A possible solution might be to convert the the
          relative time to an absolute time. For instance, replacing the previous line with:
          */

          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; expires=" + (new Date(vEnd * 1e3 + Date.now())).toUTCString();

          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) {
      return false;
    }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }
    return aKeys;
  }
};

/**
 * title
 * @type {{getTitleInfo: TitleManage.getTitleInfo, setTitleInfo: TitleManage.setTitleInfo, clearTitleInfo: TitleManage.clearTitleInfo}}
 */
var TitleManage = {

  /**
   * 获取title
   * @returns {*}
   */
  getTitleInfo: function () {
    var titleInfo = LocalManage.getItem('TITLE_INFO');
    if (titleInfo) return JSON.parse(titleInfo);
    return {};
  },

  /**
   * 添加title
   * @param pageName
   * @param title
   */
  setTitleInfo: function (pageName, title) {
    // 获取标题信息
    var titleInfo = this.getTitleInfo();
    // 设置标题信息
    titleInfo[pageName] = title;
    // 存到sessionStorage
    LocalManage.setItem('TITLE_INFO', titleInfo);
  },

  /**
   * 删除title
   */
  clearTitleInfo: function () {
    LocalManage.removeItem('TITLE_INFO');
  }
};

/**
 * 所选城市
 * @type {{getCityInfo: CityManage.getCityInfo, setCityInfo: CityManage.setCityInfo, clearCityInfo: CityManage.clearCityInfo}}
 */
var CityManage = {

  /**
   * 获取城市信息
   * @returns {*}
   */
  getCityInfo: function () {
    var cityInfo = LocalManage.getItem('CITY_INFO');
    if (cityInfo) return JSON.parse(cityInfo);
    return null;
  },

  /**
   * 设置城市信息
   * @param cityInfo
   */
  setCityInfo: function (cityInfo) {
    LocalManage.setItem('CITY_INFO', cityInfo)
  },

  /**
   * 清除城市信息
   */
  clearCityInfo: function () {
    LocalManage.removeItem('CITY_INFO');
  }
};

/**
 * 用户管理
 * @type {{getToken: UserManage.getToken, isLogin: UserManage.isLogin, setUserInfo: UserManage.setUserInfo, getUserInfo: UserManage.getUserInfo, clearUserInfo: UserManage.clearUserInfo}}
 */
var UserManage = {

  /**
   * 获取token
   */
  getToken: function () {
    return CookieManage.getItem('token');
  },

  /**
   * 判断用户是否登陆
   * @returns {boolean}
   */
  isLogin: function () {
    if (this.getToken()) return true;
    return false;
  },

  /**
   * 添加用户信息
   * @param userName
   * @param userId
   * @param token
   * @param vEnd
   */
  setUserInfo: function ({userName, userId, token}, vEnd) {

    // 默认7天
    vEnd = vEnd || 7 * 24 * 60 * 60;
    // 添加cookie信息
    CookieManage.setItem('userName', userName, vEnd);
    CookieManage.setItem('userId', userId, vEnd);
    CookieManage.setItem('token', token, vEnd);
  },

  /**
   * 获取用户信息
   * @returns {{userName: *, userId: *, token: *}}
   */
  getUserInfo: function () {

    var userName = CookieManage.getItem('userName');
    var userId = CookieManage.getItem('userId');
    var token = CookieManage.getItem('token');

    return {
      userName,
      userId,
      token
    }
  },

  /**
   * 清除用户信息
   */
  clearUserInfo: function () {
    // 清除cookie
    CookieManage.removeItem('userName');
    CookieManage.removeItem('userId');
    CookieManage.removeItem('token');
  }
};

export {
  TitleManage,
  CityManage,
  UserManage
}
