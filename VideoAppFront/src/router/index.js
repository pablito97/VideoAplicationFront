import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import VideosView from '@/views/VideosView.vue'
import ApiView from '@/views/ApiView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/videos',
      name: 'videos',
      component: VideosView
    },
    {
       path: '/readapi',
       name: 'readapi',
       component: ApiView
    }
  ]
})

export default router
