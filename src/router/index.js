import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ThreeScene',
    component: () => import(/* webpackChunkName: "threeScene" */ '../views/ThreeScene.vue')
  },
  {
    path: '/skyBox',
    name: 'SkyBox',
    component: () => import(/* webpackChunkName: "skyBox" */ '../views/SkyBox.vue')
  },
  {
    path: '/sphere',
    name: 'Sphere',
    component: () => import(/* webpackChunkName: "sphere" */ '../views/Sphere.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
