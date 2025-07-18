<template>
  <div class="w-full flex justify-center px-2 sm:px-4 lg:px-6">
    <n-input-group class="flex items-center max-w-xs sm:max-w-sm lg:max-w-md gap-0.5 sm:gap-1">
      <n-input-number
        :model-value="minutes"
        :min="1"
        size="large"
        class="flex-1 min-w-16 sm:min-w-20 lg:min-w-24"
        :show-button="false"
        :input-props="{ inputmode: 'numeric', pattern: '[0-9]*' }"
        placeholder="0"
        @focus="handleFocus"
        @update:value="(val) => handleValueUpdate(val, 'minutes')"
      />
      <n-input-group-label
        class="text-xs sm:text-sm lg:text-base px-2 sm:px-3 lg:px-4 min-w-7 sm:min-w-8 lg:min-w-9 flex items-center justify-center text-gray-600 font-medium"
        >分</n-input-group-label
      >
      <n-input-number
        :model-value="seconds"
        :min="0"
        :max="59"
        size="large"
        class="flex-1 min-w-16 sm:min-w-20 lg:min-w-24"
        :show-button="false"
        :input-props="{ inputmode: 'numeric', pattern: '[0-9]*' }"
        placeholder="0"
        @focus="handleFocus"
        @update:value="(val) => handleValueUpdate(val, 'seconds')"
      />
      <n-input-group-label
        class="text-xs sm:text-sm lg:text-base px-2 sm:px-3 lg:px-4 min-w-7 sm:min-w-8 lg:min-w-9 flex items-center justify-center text-gray-600 font-medium"
        >秒</n-input-group-label
      >
    </n-input-group>
  </div>
</template>

<script setup lang="ts">
import { NInputNumber, NInputGroup, NInputGroupLabel } from 'naive-ui'

interface Props {
  minutes: number
  seconds: number
}

interface Emits {
  (e: 'update:minutes', value: number): void
  (e: 'update:seconds', value: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 處理輸入框焦點事件，確保選取全部文字
const handleFocus = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement
  if (target) {
    setTimeout(() => {
      target.select()
    }, 0)
  }
}

// 處理輸入值變更，確保空值為0，分秒不超過59
const handleValueUpdate = (value: number | null, type: 'minutes' | 'seconds') => {
  // 處理空值，設為0
  if (value === null || value === undefined) {
    value = 0
  }

  // 處理分、秒最大值限制
  if (type === 'seconds' && value > 59) {
    value = 59
  }

  // 確保不為負數
  if (value < 0) {
    value = 0
  }

  // 配速分鐘最小值為1
  if (type === 'minutes' && value < 1) {
    value = 1
  }

  // 發送更新事件
  if (type === 'minutes') {
    emit('update:minutes', value)
  } else {
    emit('update:seconds', value)
  }
}
</script>

<style scoped>
/* 用 Tailwind 大大簡化了 CSS！ */
:deep(.n-input-number .n-input__input-el) {
  font-weight: 500;
}

:deep(.n-input-group-label) {
  background: transparent !important;
  border: none !important;
  color: #6b7280 !important;
  font-weight: 500;
}
</style>
