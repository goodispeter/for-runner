<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { NConfigProvider, NGlobalStyle, NLayout, NLayoutContent } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import AppFooter from './components/AppFooter.vue'
import MainNavbar from './components/MainNavbar.vue'

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

<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
    <n-global-style />
    <n-layout class="app-layout">
      <n-layout-content class="main-content">
        <!-- 主要導航 -->
        <MainNavbar />
        <!-- 路由內容 -->
        <router-view />
      </n-layout-content>
      <AppFooter />
    </n-layout>
  </n-config-provider>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  height: 100vh;
  overflow: hidden;
}

.app-layout {
  height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 16px 24px 16px 24px;
  overflow: auto;
  min-height: 0;
}

@media (max-width: 768px) {
  .main-content {
    padding: 12px 16px 12px 16px;
  }
}
</style>
