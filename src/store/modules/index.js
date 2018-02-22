var state = {

  moviesInfo: [],

  cinemasInfo: []
};

var getters = {

  moviesInfo: function (state) {
    return state.moviesInfo;
  },

  cinemasInfo: function (state) {
    return state.cinemasInfo;
  }
};

var mutations = {

  CLEAR_MOVIES_INFO: function () {
    state.moviesInfo = [];
  },

  CLEAR_CINEMAS_INFO: function () {
    state.cinemasInfo = [];
  },

  GET_MOVIES_INFO: function (state, moviesInfo) {
    state.moviesInfo = state.moviesInfo.concat(moviesInfo);
  },

  GET_CINEMAS_INFO: function (state, cinemasInfo) {
    state.cinemasInfo = state.cinemasInfo.concat(cinemasInfo);
  },

  REFRESH_MOVIES_INFO: function (state, moviesInfo) {
    //debugger
    state.moviesInfo = moviesInfo;
  }
};

var actions = {

  // 获取影片信息
  GET_MOVIES_INFO: function (context, {cityCode, pageSize, startIndex}) {
    return fetch('../../../static/data/data.json')
      .then(response => response.json())
      .then(data => {
        // 影片信息
        var localMoviesInfo = data.localMoviesInfo;
        var moviesInfo = localMoviesInfo.slice(startIndex, startIndex + pageSize);
        context.commit('GET_MOVIES_INFO', moviesInfo);
      });
  },

  // 获取影院信息
  GET_CINEMAS_INFO: function (context, {cityCode, pageSize, startIndex}) {
    return fetch('../../../static/data/data.json')
      .then(response => response.json())
      .then(data => {
        // 影院信息
        var localCinemasInfo = data.localCinemasInfo;
        var cinemasInfo = localCinemasInfo.slice(startIndex, startIndex + pageSize);
        context.commit('GET_CINEMAS_INFO', cinemasInfo);
      });
  },

  // 清空电影信息
  CLEAR_MOVIES_INFO: function (context) {
    context.commit('CLEAR_MOVIES_INFO');
  },

  // 清空影院信息
  CLEAR_CINEMAS_INFO: function (context) {
    context.commit('CLEAR_CINEMAS_INFO');
  },

  // // 刷新电影信息
  // REFRESH_MOVIES_INFO: function (context, {cityCode, pageSize, startIndex}) {
  //   // context.dispatch('CLEAR_MOVIES_INFO').then(function () {
  //   //   var moviesInfo = localMoviesInfo.slice(index, index + pageSize);
  //   //   context.commit('GET_MOVIES_INFO', moviesInfo);
  //   // });
  //
  //   return fetch('../../../static/data/data.json')
  //     .then(response => response.json())
  //     .then(data => {
  //       // 影片信息
  //       var localMoviesInfo = data.localMoviesInfo;
  //       var moviesInfo = localMoviesInfo.slice(startIndex, startIndex + pageSize);
  //       context.dispatch('CLEAR_MOVIES_INFO')
  //         .then(() => context.commit('GET_MOVIES_INFO', moviesInfo));
  //     });
  // },

  // 涮新首页数据
  REFRESH_INDEX_INFO: function (context, {cityCode, pageSize, startIndex}) {
    return fetch('../../../static/data/data.json')
      .then(response => response.json())
      .then(data => {
        // 影片信息
        var localMoviesInfo = data.localMoviesInfo;
        var moviesInfo = localMoviesInfo.slice(startIndex, startIndex + pageSize);
        context.dispatch('CLEAR_MOVIES_INFO')
          .then(() => context.dispatch('CLEAR_CINEMAS_INFO'))
          .then(() => context.commit('GET_MOVIES_INFO', moviesInfo));
      })
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}


