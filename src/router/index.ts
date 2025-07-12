import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home/HomePageView.vue'),
    meta: {
      title: 'For Runner - 跑者專用工具',
    },
  },
  {
    path: '/pace-calculator',
    name: 'PaceCalculator',
    component: () => import('../views/pace-calculator/PaceCalculatorView.vue'),
    meta: {
      title: '配速計算機 - For Runner',
    },
  },
  // 未來可以加入其他功能，例如：
  // {
  //   path: '/for-runner/training-plan',
  //   name: 'TrainingPlan',
  //   component: () => import('../views/training-plan/TrainingPlanLayout.vue'),
  //   meta: { title: '訓練計劃 - For Runner' },
  //   children: [...]
  // },
  // {
  //   path: '/for-runner/race-calendar',
  //   name: 'RaceCalendar',
  //   component: () => import('../views/race-calendar/RaceCalendarLayout.vue'),
  //   meta: { title: '比賽行事曆 - For Runner' },
  //   children: [...]
  // },
  // 捕獲所有未匹配的路由，重定向到首頁
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHashHistory('/for-runner/'),
  routes,
})

export default router
