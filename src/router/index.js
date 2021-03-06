import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home'
import Page404 from '../components/Page/404'

const Boards = resolve => {
  require.ensure(['../components/Board/Boards'], () => {
    resolve(
      require('../components/Board/Boards')
    )
  })
}

const Board = resolve => {
  require.ensure(['../components/Board/Board'], () => {
    resolve(
      require('../components/Board/Board')
    )
  })
}

const User = resolve => {
  require.ensure(['../components/User/User'], () => {
    resolve(
      require('../components/User/User')
    )
  })
}

Vue.use(Router)

const ifAuth = (to, from, next) => {
  if (localStorage.getItem('user')) {
    next()
  } else {
    next('/')
  }
}

export default new Router({
  routes: [
    {
      path: '',
      name: 'home',
      component: Home,
    },
    {
      path: '/boards',
      name: 'boards',
      component: Boards,
      beforeEnter: ifAuth,
    },{
      path: '/board/:id',
      name: 'board',
      props: true,
      component: Board,
      beforeEnter: ifAuth,
    },
    {
      path: '/user',
      name: 'user',
      component: User,
      beforeEnter: ifAuth,
    },
    {
      path: '*',
      component: Page404,
    },
  ],
  mode: 'history'
})
