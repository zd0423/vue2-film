var state = {
  cinemasInfo: []
};

var getters = {

  //  获取影院信息
  cinemas: function (state) {
    return state.cinemasInfo
  }
};

var mutations = {

  GET_CINEMA_DETAILS: function (state, cinemas) {
    state.cinemasInfo = cinemas;
  }
};

var actions = {

  // 根据movieId获取
  GET_CINEMA_DETAILS: function (context, {cityCode, movieId}) {

    return fetch('../../../static/data/data.json')
      .then(response => response.json())
      .then(date => {
        var cinemasInfo = date.cinemasInfo;
        context.commit('GET_CINEMA_DETAILS', cinemasInfo);
      })
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
