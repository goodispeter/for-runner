<template>
  <n-layout-header bordered class="header">
    <div class="header-content">
      <div class="header-left">
        <n-icon size="28" color="#64ffda" class="header-icon">
          <Icon />
        </n-icon>
        <n-text class="header-title">配速計算機</n-text>
      </div>
      <div class="header-right">
        <n-space :size="24">
          <n-text class="header-subtitle" depth="3">專業跑者必備工具</n-text>
        </n-space>
      </div>
    </div>
  </n-layout-header>
</template>

<script setup lang="ts">
import { NLayoutHeader, NIcon, NText, NSpace } from 'naive-ui'
import { Timer as Icon } from '@vicons/ionicons5'
</script>

<style scoped>
.header {
  height: 64px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-bottom: 1px solid #64ffda;
  padding: 0 24px;
  display: flex;
  align-items: center;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  filter: drop-shadow(0 0 8px rgba(100, 255, 218, 0.3));
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(100, 255, 218, 0.3);
}

.header-right {
  display: flex;
  align-items: center;
}

.header-subtitle {
  color: #64ffda;
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .header {
    padding: 0 16px;
  }

  .header-title {
    font-size: 18px;
  }

  .header-subtitle {
    display: none;
  }
}
</style>
