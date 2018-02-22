import {UserManage} from '../../utils/Manage';

// var state = {};
//
// var getters = {};

var mutations = {

  // 登陆
  LOGIN: function (state, userInfo) {
    // 添加用户信息
    UserManage.setUserInfo(userInfo);
  },

  // 退出
  LOGOUT: function (state) {
    // 清除用户信息
    UserManage.clearUserInfo();
  }
};

var actions = {

  // 登陆
  LOGIN: function (context, {account, ticket, type}) {

    return fetch('../../../static/data/data.json')
      .then(response => response.json())
      .then(data => {
        var userInfo = data.userInfo;
        context.commit('LOGIN', userInfo);
      });
  },

  // 退出
  LOGOUT: function (context, {userId, token}) {
    context.commit('LOGOUT');
  }
};

export default {
  // state,
  // getters,
  mutations,
  actions
}
