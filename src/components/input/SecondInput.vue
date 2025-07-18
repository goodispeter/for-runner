<template>
  <div class="w-full flex justify-center px-2 sm:px-4 lg:px-6">
    <n-input-group class="flex items-center max-w-48 sm:max-w-56 lg:max-w-64 gap-0.5 sm:gap-1">
      <n-input-number
        :model-value="value"
        :min="min"
        :max="max"
        size="large"
        class="flex-1 min-w-20 sm:min-w-24 lg:min-w-28"
        :input-props="{ inputmode: 'numeric', pattern: '[0-9]*' }"
        :show-button="false"
        placeholder="0"
        @focus="handleFocus"
        @update:value="handleValueUpdate"
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
  value: number
  min?: number
  max?: number
}

interface Emits {
  (e: 'update:value', value: number): void
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: undefined,
})

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

// 處理輸入值變更
const handleValueUpdate = (value: number | null) => {
  // 處理空值，設為最小值或0
  if (value === null || value === undefined) {
    value = props.min || 0
  }

  // 處理最大值限制
  if (props.max !== undefined && value > props.max) {
    value = props.max
  }

  // 確保不小於最小值
  if (value < props.min) {
    value = props.min
  }

  emit('update:value', value)
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
