var state = {
  movieInfo: {}
};

var getters = {
  movieInfo: function (state) {
    return state.movieInfo;
  }
};

var mutations = {
  GET_MOVIE_INFO: function (state, movieInfo) {
    state.movieInfo = movieInfo;
  }
};

var actions = {
  GET_MOVIE_INFO: function (context, {movieId}) {
    return fetch('../../../static/data/data.json')
      .then(response => response.json())
      .then(data => {
        var movieInfo = data.movieInfo;
        context.commit('GET_MOVIE_INFO', movieInfo);
      })
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
