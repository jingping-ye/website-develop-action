import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import list from '@/components/tab-list'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/tab-list',
      name: 'tab-list',
      component: list
    }
  ]
})
