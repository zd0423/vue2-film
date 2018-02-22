var state = {
  // 影厅信息
  hallInfo: {},
  order: {}
};

var getters = {
  hallInfo: function (state) {
    return state.hallInfo;
  },
  order: function (state) {
    return state.order;
  }
};

var mutations = {

  GET_HALL_INFO: function (state, hallInfo) {
    //state.hallInfo = {...hallInfo};
    state.hallInfo = hallInfo;
  },

  GET_ORDER: function (state, order) {
    state.order = order;
  }
};

var actions = {

  GET_HALL_INFO: function (context, {}) {

    return fetch('../../../static/data/data.json')
      .then(response => response.json())
      .then(data => {
        var hallInfo = data.hallInfo;
        context.commit('GET_HALL_INFO', hallInfo);
      })
  },

  GET_ORDER: function (context, {orderId}) {

    return fetch('../../../static/data/data.json')
      .then(reponse => reponse.json())
      .then(data => {
        var order = data.order;
        context.commit('GET_ORDER', order);
      })
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
