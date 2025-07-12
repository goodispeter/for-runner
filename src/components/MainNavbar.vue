<template>
  <div class="main-navbar">
    <div class="navbar-content">
      <!-- 應用程式標題 -->
      <h1 class="title-text" @click="handleTitleClick">For Runner</h1>

      <!-- 導航按鈕 -->
      <n-space :size="20">
        <n-button
          v-for="option in mainNavOptions"
          :key="option.key"
          :type="isCurrentSection(option.key) ? 'primary' : 'default'"
          size="large"
          class="main-nav-button"
          :class="{ active: isCurrentSection(option.key) }"
          @click="handleMainNavSelect(option.key)"
        >
          <template #icon>
            <n-icon>
              <component :is="option.icon" />
            </n-icon>
          </template>
          {{ option.label }}
        </n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NCard, NSpace, NButton, NIcon } from 'naive-ui'
import { Timer, Calendar, TrendingUp, Settings } from '@vicons/ionicons5'

const router = useRouter()
const route = useRoute()

// 主要導航選項
const mainNavOptions = [
  {
    label: '配速計算',
    key: 'pace-calculator',
    icon: Timer,
    route: '/for-runner/pace-calculator',
  },
  // 未來功能擴充預留
  // {
  //   label: '訓練計劃',
  //   key: 'training-plan',
  //   icon: TrendingUp,
  //   route: '/for-runner/training-plan'
  // },
  // {
  //   label: '比賽行事曆',
  //   key: 'race-calendar',
  //   icon: Calendar,
  //   route: '/for-runner/race-calendar'
  // },
  // {
  //   label: '設定',
  //   key: 'settings',
  //   icon: Settings,
  //   route: '/for-runner/settings'
  // }
]

// 判斷當前是否在該功能區塊
const isCurrentSection = (key: string) => {
  return route.path.includes(`/${key}`)
}

// 處理主導航選擇
const handleMainNavSelect = (key: string) => {
  const option = mainNavOptions.find((opt) => opt.key === key)
  if (option) {
    router.push(option.route)
  }
}

// 處理標題點擊，回到首頁
const handleTitleClick = () => {
  router.push('/for-runner')
}
</script>

<style scoped>
.main-navbar {
  padding: 12px 0;
  margin-bottom: 20px;
}

.navbar-content {
  display: flex;
  align-items: center;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.title-text {
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  margin-right: 8px;
  background: linear-gradient(135deg, #64ffda 0%, #00bcd4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 8px rgba(100, 255, 218, 0.3);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.title-text:hover {
  transform: scale(1.05);
  text-shadow: 0 4px 16px rgba(100, 255, 218, 0.5);
}

.main-nav-button {
  min-width: 140px;
  height: 48px;
  font-weight: 600;
  font-size: 15px;
  border-radius: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  border: 2px solid transparent;
  background: rgba(26, 26, 46, 0.7);
  color: #8892b0;
}

.main-nav-button:hover {
  border-color: rgba(100, 255, 218, 0.4);
  background: rgba(100, 255, 218, 0.1);
  color: #64ffda;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(100, 255, 218, 0.2);
}

.main-nav-button.active,
.main-nav-button:deep(.n-button--primary) {
  background: linear-gradient(135deg, #64ffda 0%, #00bcd4 100%);
  border-color: #64ffda;
  color: #0f172a;
  font-weight: 700;
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(100, 255, 218, 0.4);
}

.main-nav-button.active:hover,
.main-nav-button:deep(.n-button--primary):hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(100, 255, 218, 0.5);
}

@media (max-width: 768px) {
  .main-navbar {
    padding: 16px 0;
    margin-bottom: 24px;
  }

  .navbar-content {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
    padding: 0 16px;
    justify-content: flex-start;
  }

  .title-text {
    font-size: 22px;
    margin-right: 4px;
  }

  .main-nav-button {
    min-width: 100px;
    height: 40px;
    font-size: 13px;
    padding: 0 12px;
  }
}

@media (max-width: 480px) {
  .navbar-content {
    gap: 8px;
  }

  .title-text {
    font-size: 20px;
    margin-right: 8px;
    margin-bottom: 4px;
    width: 100%;
  }

  .main-nav-button {
    min-width: 90px;
    height: 36px;
    font-size: 12px;
    padding: 0 8px;
  }
}
</style>
