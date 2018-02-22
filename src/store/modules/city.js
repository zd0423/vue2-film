import {CityManage} from "../../utils/Manage";

var state = {

  cities: [],
  cityInfo: {
    code: '',
    name: ''
  }
};

var getters = {

  cities: function (state) {
    return state.cities;
  },

  cityCode: function (state) {
    return state.cityInfo.code;
  },

  cityName: function (state) {
    return state.cityInfo.name;
  }
};

var mutations = {

  // 获取城市信息
  GET_CITIES: function (state, cities) {
    state.cities = cities;
  },

  // 选择城市
  CHOOSE_CITY: function (state, {cityCode, cityName}) {

    // 持久化（避免页面刷新数据丢失）
    var cityInfo = {cityCode, cityName};
    CityManage.setCityInfo(cityInfo);

    state.cityInfo.code = cityCode;
    state.cityInfo.name = cityName;
  },

  // 获取本地城市信息
  REFRESH_CITY_INFO: function (state) {
    var cityInfo = CityManage.getCityInfo();

    if (cityInfo) { // 本地信息
      state.cityInfo.code = cityInfo.cityCode;
      state.cityInfo.name = cityInfo.cityName;
    } else { // 默认值
      state.cityInfo.code = 'bj';
      state.cityInfo.name = '北京';
    }
  }
};

var actions = {

  // 获取城市信息
  GET_CITIES: function (context) {
    return fetch('../../../static/data/data.json')
      .then(response => response.json())
      .then(data => {
        var citiesInfo = data.citiesInfo;
        context.commit('GET_CITIES', citiesInfo);
      });
  },

  // 选择城市
  CHOOSE_CITY: function (context, {cityCode, cityName}) {
    context.commit('CHOOSE_CITY', {
      cityCode, cityName
    });
  },

  // 获取本地城市信息
  REFRESH_CITY_INFO: function (context) {
    context.commit('REFRESH_CITY_INFO');
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
