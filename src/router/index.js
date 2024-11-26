import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MyDomainsView from '../views/MyDomainsView.vue'
import ProfileView from '../views/ProfileView.vue'
import AITrainingView from '../views/AITrainingView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/my-domains',
      name: 'my-domains',
      component: MyDomainsView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/ai-training',
      name: 'ai-training',
      component: AITrainingView
    }
  ]
})

export default router