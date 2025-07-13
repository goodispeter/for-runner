<template>
  <div class="w-full flex justify-center px-1 sm:px-4 lg:px-6 overflow-x-auto">
    <n-input-group
      class="flex flex-nowrap items-center gap-0.5 sm:gap-1.5 max-w-sm sm:max-w-lg lg:max-w-xl"
    >
      <!-- 小時 -->
      <n-input-number
        :model-value="hours"
        :min="0"
        size="large"
        class="flex-1 min-w-16 sm:min-w-20 lg:min-w-24"
        :show-button="false"
        placeholder="0"
        input-class="text-center"
        @focus="handleFocus"
        @update:value="(val) => handleValueUpdate(val, 'hours')"
      />
      <n-input-group-label
        class="text-xs sm:text-sm lg:text-base px-1.5 sm:px-2 lg:px-3 min-w-6 flex items-center justify-center text-gray-600 font-medium"
        >時</n-input-group-label
      >

      <!-- 分鐘 -->
      <n-input-number
        :model-value="minutes"
        :min="0"
        :max="59"
        size="large"
        class="flex-1 min-w-16 sm:min-w-20 lg:min-w-24"
        :show-button="false"
        placeholder="0"
        input-class="text-center"
        @focus="handleFocus"
        @update:value="(val) => handleValueUpdate(val, 'minutes')"
      />
      <n-input-group-label
        class="text-xs sm:text-sm lg:text-base px-1.5 sm:px-2 lg:px-3 min-w-6 flex items-center justify-center text-gray-600 font-medium"
        >分</n-input-group-label
      >

      <!-- 秒數 -->
      <n-input-number
        :model-value="seconds"
        :min="0"
        :max="59"
        size="large"
        class="flex-1 min-w-16 sm:min-w-20 lg:min-w-24"
        :show-button="false"
        placeholder="0"
        input-class="text-center"
        @focus="handleFocus"
        @update:value="(val) => handleValueUpdate(val, 'seconds')"
      />
      <n-input-group-label
        class="text-xs sm:text-sm lg:text-base px-1.5 sm:px-2 lg:px-3 min-w-6 flex items-center justify-center text-gray-600 font-medium"
        >秒</n-input-group-label
      >
    </n-input-group>
  </div>
</template>

<script setup lang="ts">
import { NInputNumber, NInputGroup, NInputGroupLabel } from 'naive-ui'

interface Props {
  hours: number
  minutes: number
  seconds: number
}

interface Emits {
  (e: 'update:hours', value: number): void
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
const handleValueUpdate = (value: number | null, type: 'hours' | 'minutes' | 'seconds') => {
  // 處理空值，設為0
  if (value === null || value === undefined) {
    value = 0
  }

  // 處理分、秒最大值限制
  if ((type === 'minutes' || type === 'seconds') && value > 59) {
    value = 59
  }

  // 確保不為負數
  if (value < 0) {
    value = 0
  }

  // 發送更新事件
  if (type === 'hours') {
    emit('update:hours', value)
  } else if (type === 'minutes') {
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

/* 手機模式下的空間優化 */
@media (max-width: 480px) {
  :deep(.n-input-number .n-input__input-el) {
    padding-left: 4px;
    padding-right: 4px;
  }

  :deep(.n-input-group-label) {
    padding-left: 4px;
    padding-right: 4px;
    font-size: 12px;
  }
}
</style>
