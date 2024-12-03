import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MyDomainsView from '../views/MyDomainsView.vue'
import ProfileView from '../views/ProfileView.vue'
import AITrainingView from '../views/AITrainingView.vue'
import AINodesView from '../views/AINodesView.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/my-identity',
      name: 'my-identity',
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
    },
    {
      path: '/ai-nodes',
      name: 'ai-nodes',
      component: AINodesView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    }
  ]
})

export default router