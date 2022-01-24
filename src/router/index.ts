import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'
import { RouteNames } from '@/router/models'
import ViewHome from '@/views/ViewHome.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: RouteNames.Login,
    component: () => import(/* webpackChunkName: "login" */ '../views/ViewLogin.vue'),
  },
  {
    path: '/:apiKey',
    name: RouteNames.Home,
    component: ViewHome,
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
    }),
  },
  {
    path: '/:apiKey/sample1',
    name: RouteNames.Sample1,
    component: () => import(/* webpackChunkName: "sample1" */ '../views/ViewSample1.vue'),
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
    }),
  },
  {
    path: '/:apiKey/sample2',
    name: RouteNames.Sample2,
    component: () => import(/* webpackChunkName: "sample2" */ '../views/ViewSample2.vue'),
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
    }),
  },
  {
    path: '/:apiKey/sample3',
    name: RouteNames.Sample3a,
    component: () => import(/* webpackChunkName: "sample3" */ '../views/ViewSample3a.vue'),
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
    }),
  },
  {
    path: '/:apiKey/sample3/:peerId',
    name: RouteNames.Sample3b,
    component: () => import(/* webpackChunkName: "sample3" */ '../views/ViewSample3b.vue'),
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
      peerId: route.params.peerId,
    }),
  },
  {
    path: '/:apiKey/sample4',
    name: RouteNames.Sample4,
    component: () => import(/* webpackChunkName: "sample4" */ '../views/ViewSample4.vue'),
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
    }),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
