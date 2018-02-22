import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/index/Index'

import {UserManage} from '../utils/Manage'

Vue.use(Router);
//const Movie = () => import('../components/movie/Movie');

const scrollBehavior = (to, from, savedPosition) => {
  const position = {};

  if (to.matched.some(m => m.meta.scrollToTop)) {
    position.x = 0;
    position.y = 0;
  }
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  return position
};

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/movie/:movieId',
    name: 'movie',
    component: function (resolve) {
      require(['../components/Movie'], resolve);
    },
    meta: {scrollToTop: true}
  },
  {
    path: '/cinema/:movieId',
    name: 'cinema',
    component: function (resolve) {
      require(['../components/Cinema'], resolve);
    },
    meta: {scrollToTop: true}
  },
  {
    path: '/city',
    name: 'city',
    component: function (resolve) {
      require(['../components/city/City'], resolve);
    },
    meta: {scrollToTop: true}
  },
  {
    path: '/shows/:cinemaId',
    name: 'shows',
    component: function (resolve) {
      require(['../components/show/Shows'], resolve);
    },
    meta: {scrollToTop: true}
  },
  {
    path: '/seats/:id',
    name: 'seats',
    component: function (resolve) {
      require(['../components/Seats'], resolve);
    },
    meta: {hasEnter: true, scrollToTop: true}
  },
  {
    path: '/login',
    name: 'login',
    component: function (resolve) {
      require(['../components/Login'], resolve);
    },
    meta: {scrollToTop: true}
  },
  {
    path: '/createOrder/:orderId',
    name: 'createOrder',
    component: function (resolve) {
      require(['../components/CreateOrder'], resolve);
    },
    meta: {scrollToTop: true}
  }
];

const router = new Router({
  mode: 'history',
  scrollBehavior,
  routes
});

router.beforeEach((to, from, next) => {

  if (to.matched.some(record => record.meta.hasEnter)) {
    // 判断是否登陆
    if (!UserManage.isLogin()) {
      next({
        name: 'login',
        query: {redirect: to.fullPath}
      })
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
