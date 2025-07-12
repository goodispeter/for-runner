<template>
  <n-input-group>
    <n-input-number
      :model-value="minutes"
      :min="1"
      size="large"
      class="input-number-field"
      :show-button="false"
      placeholder="0"
      @focus="handleFocus"
      @update:value="(val) => handleValueUpdate(val, 'minutes')"
    />
    <n-input-group-label class="input-label">分</n-input-group-label>
    <n-input-number
      :model-value="seconds"
      :min="0"
      :max="59"
      size="large"
      class="input-number-field"
      :show-button="false"
      placeholder="0"
      @focus="handleFocus"
      @update:value="(val) => handleValueUpdate(val, 'seconds')"
    />
    <n-input-group-label class="input-label">秒</n-input-group-label>
  </n-input-group>
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
/* 輸入欄位統一樣式 */
.input-number-field {
  flex: 1;
  min-width: 50px;
  max-width: none;
}

:deep(.input-label) {
  min-width: 28px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: #8892b0;
  background: rgba(100, 255, 218, 0.1);
  border: 1px solid rgba(100, 255, 218, 0.2);
  flex-shrink: 0;
}

:deep(.n-input-group) {
  display: flex;
  align-items: stretch;
  width: 100%;
  gap: 1px;
}

:deep(.n-input-number) {
  height: 40px;
  flex: 1;
  min-width: 0;
}

:deep(.n-input-number .n-input__input-el) {
  height: 40px;
  line-height: 40px;
  text-align: center;
  padding: 0 4px;
}

@media (max-width: 768px) {
  :deep(.input-label) {
    min-width: 26px;
    font-size: 11px;
    padding: 0 4px;
  }

  .input-number-field {
    min-width: 60px;
    flex: 1;
  }

  :deep(.n-input-number .n-input__input-el) {
    font-size: 14px;
    padding: 0 6px;
  }

  :deep(.n-input-group) {
    flex-wrap: nowrap;
    overflow-x: auto;
    min-width: 0;
  }
}

@media (max-width: 480px) {
  :deep(.input-label) {
    min-width: 22px;
    width: 22px;
    font-size: 11px;
    padding: 0 1px;
    flex-shrink: 0;
  }

  .input-number-field {
    min-width: 55px;
    flex: 1;
    max-width: calc((100% - 44px) / 2);
  }

  :deep(.n-input-number .n-input__input-el) {
    font-size: 13px;
    padding: 0 3px;
    color: #ccd6f6 !important;
    background-color: transparent !important;
  }

  :deep(.n-input-group) {
    gap: 0px;
    flex-wrap: nowrap;
    overflow: visible;
    width: 100%;
    max-width: 100%;
  }
}
</style>
