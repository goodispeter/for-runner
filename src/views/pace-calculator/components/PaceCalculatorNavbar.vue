<template>
  <n-card class="nav-card" embedded>
    <n-space justify="center" :size="24">
      <n-button
        v-for="option in options"
        :key="option.key"
        :type="currentRoute === option.key ? 'primary' : 'tertiary'"
        :ghost="currentRoute !== option.key"
        size="large"
        class="nav-button"
        @click="handleNavSelect(option.key)"
      >
        <template #icon>
          <n-icon>
            <component :is="option.icon" />
          </n-icon>
        </template>
        {{ option.label }}
      </n-button>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NCard, NSpace, NButton, NIcon } from 'naive-ui'
import type { Component } from 'vue'

interface NavOption {
  label: string
  key: string
  icon: Component
  route: string
}

interface Props {
  options: NavOption[]
}

const props = defineProps<Props>()
const router = useRouter()
const route = useRoute()

// 當前路由
const currentRoute = computed(() => route.name as string)

// 處理導航選擇
const handleNavSelect = (key: string) => {
  const option = props.options.find((opt) => opt.key === key)
  if (option) {
    router.push(option.route)
  }
}
</script>

<style scoped>
.nav-card {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.nav-button {
  min-width: 140px;
  height: 48px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.nav-button:not(.n-button--primary) {
  color: #64ffda;
  border-color: rgba(100, 255, 218, 0.3);
}

.nav-button:not(.n-button--primary):hover {
  border-color: #64ffda;
  box-shadow: 0 0 20px rgba(100, 255, 218, 0.2);
  transform: translateY(-2px);
}

.nav-button.n-button--primary {
  background: linear-gradient(135deg, #64ffda 0%, #00bcd4 100%);
  border: none;
  color: #0f172a;
  box-shadow: 0 4px 20px rgba(100, 255, 218, 0.3);
}

@media (max-width: 768px) {
  .nav-button {
    min-width: 120px;
    height: 44px;
    font-size: 14px;
  }
}
</style>
