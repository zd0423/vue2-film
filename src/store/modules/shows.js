//import {} from '../../../static/data.'

var state = {
  showsInfo: {}
};

var getters = {
  showsInfo: function (state) {
    return state.showsInfo;
  }
};

var mutations = {

  GET_SHOWS_INFO: function (state, showsInfo) {
    // Object.assign({}, this.someObject, { a: 1, b: 2 }
    // state.showsInfo = {...showsInfo};
    state.showsInfo = showsInfo;
  }
};

var actions = {

  GET_SHOWS_INFO: function (context, {cinemaId, movieId, date}) {

    return fetch('../../../static/data/data.json')
      .then(response => response.json())
      .then(data => {
        var showsInfo = data.showsInfo;
        context.commit('GET_SHOWS_INFO', showsInfo)
      })
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
