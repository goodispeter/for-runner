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
import { useRouter, useRoute } from 'vue-router'
import { NSpace, NButton, NIcon } from 'naive-ui'
import { mainNavOptions } from '@/constants/nav'

const router = useRouter()
const route = useRoute()

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
  router.push('/')
}
</script>

<style scoped>
.main-navbar {
  padding: 8px 0;
  margin-bottom: 0;
  background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-content {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  height: 56px; /* 控制 navbar 高度 */
}

.title-text {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #64ffda;
  background: none;
  -webkit-text-fill-color: initial;
  text-shadow: none;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.title-text:hover {
  color: #00e6d0;
}

.main-nav-button {
  min-width: unset;
  padding: 0 12px;
  height: 36px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 18px;
  background: transparent;
  color: #cfd8dc;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
}

.main-nav-button:hover {
  background-color: rgba(100, 255, 218, 0.1);
  color: #64ffda;
}

.main-nav-button.active,
.main-nav-button:deep(.n-button--primary) {
  background: #64ffda;
  color: #0f172a;
  font-weight: 600;
  transform: none;
  box-shadow: none;
}
</style>
