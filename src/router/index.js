import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/indexTranslate.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: index
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginAdmin.vue')
  },
  {
    path: '/panelConfiguracion',
    name: 'Config',
    component: () => import(/* webpackChunkName: "about" */ '../views/PanelConfig.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
