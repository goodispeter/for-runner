<template>
  <n-layout-footer bordered class="footer">
    <div class="footer-content">
      <n-space justify="center" align="center" :size="16">
        <n-text depth="3" class="footer-text"> © 讓每一步都更精準 </n-text>
        <n-divider vertical />
        <n-space :size="12">
          <n-icon size="16" color="#64ffda">
            <HeartIcon />
          </n-icon>
          <n-text depth="3" class="footer-text">為跑者而生</n-text>
        </n-space>
      </n-space>
    </div>
  </n-layout-footer>
</template>

<script setup lang="ts">
import { NLayoutFooter, NSpace, NText, NDivider, NIcon } from 'naive-ui'
import { Heart as HeartIcon } from '@vicons/ionicons5'
</script>

<style scoped>
.footer {
  height: auto;
  min-height: 56px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-top: 1px solid rgba(100, 255, 218, 0.2);
  display: flex;
  align-items: center;
  padding: 16px 24px;
  margin-top: 16px;
  flex-shrink: 0;
}

.footer-content {
  width: 100%;
}

.footer-text {
  color: #8892b0;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .footer {
    padding: 12px 16px;
    min-height: 48px;
    margin-top: 12px;
  }

  .footer-text {
    font-size: 14px;
  }
}
</style>
