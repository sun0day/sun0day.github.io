import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/auto-adaptive',
      name: 'auto-adaptive',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AutoAdaptiveView.vue')
    },
    {
      path: '/height-adaptive',
      name: 'height-adaptive',
      component: () => import('../views/HeightAdaptiveView.vue')
    }
  ]
})

export default router
