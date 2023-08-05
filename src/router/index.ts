import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ToolView from '../views/ToolView.vue'
import ArticleView from '../views/ArticleView.vue'
import Causerie from '../views/CauserieView.vue'
import TodoView from '../views/TodoView.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    // component: HomeView,
    redirect: '/blog',
  },
  // {
  //   path: '/tool',
  //   name: 'tool',
  //   component: ToolView,
  // },
  {
    path: '/article',
    name: 'article',
    component: ArticleView,
  },
  {
    path: '/causerie',
    name: 'causerie',
    component: Causerie,
  },
  {
    path: '/todo',
    name: 'todo',
    component: TodoView,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/SignupView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
