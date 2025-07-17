<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
    <n-global-style />
    <div class="app-layout">
      <div class="main-content">
        <!-- 主要導航：依螢幕寬度切換 -->
        <MainNavbar v-if="!isMobile" />
        <SmNavbar v-else />
        <!-- 路由內容容器 -->
        <div class="route-container">
          <router-view />
        </div>
      </div>
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { NConfigProvider, NGlobalStyle } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import MainNavbar from './components/MainNavbar.vue'
import SmNavbar from './components/SmNavbar.vue'
import { ref, onMounted, onUnmounted } from 'vue'

// 響應式判斷是否為小螢幕
const isMobile = ref(false)
function handleResize() {
  isMobile.value = window.innerWidth <= 768
}
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 自定義主題配色
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#64ffda',
    primaryColorHover: '#4fd1c7',
    primaryColorPressed: '#00acc1',
    infoColor: '#64ffda',
    successColor: '#00e676',
    warningColor: '#ffab00',
    errorColor: '#ff5252',
    textColorBase: '#ffffff',
    textColor1: '#ffffff',
    textColor2: '#cfd8dc',
    textColor3: '#8892b0',
    bodyColor: '#0a0e27',
    popoverColor: '#1a1a2e',
    cardColor: '#16213e',
    modalColor: '#1a1a2e',
    borderColor: 'rgba(100, 255, 218, 0.2)',
    dividerColor: 'rgba(100, 255, 218, 0.1)',
  },
  Card: {
    borderColor: 'rgba(100, 255, 218, 0.2)',
    color: 'rgba(22, 33, 62, 0.8)',
    colorEmbedded: 'rgba(26, 26, 46, 0.6)',
  },
  Button: {
    textColorPrimary: '#0a0e27',
    colorPrimary: 'linear-gradient(135deg, #64ffda 0%, #00bcd4 100%)',
  },
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  overflow-x: hidden;
  overflow-y: auto;
  background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
}

.app-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  overflow: auto;
}

.route-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 12px;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 80px;
  }
}
</style>
