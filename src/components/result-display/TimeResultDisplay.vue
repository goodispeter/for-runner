<template>
  <div class="result-item">
    <n-text class="result-label">{{ label }}</n-text>
    <n-text class="result-value primary">{{ formattedValue }}</n-text>
    <n-text class="result-unit">{{ unit }}</n-text>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NText } from 'naive-ui'

interface Props {
  label: string
  value: number | string
  unit: string
  format?: 'time' | 'number'
}

const props = withDefaults(defineProps<Props>(), {
  format: 'number',
})

const formattedValue = computed(() => {
  if (props.format === 'time' && typeof props.value === 'string') {
    return props.value
  }

  if (props.format === 'number' && typeof props.value === 'number') {
    return Math.round(props.value).toString()
  }

  return props.value.toString()
})
</script>

<style scoped>
.result-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 0;
  justify-content: center;
  flex-wrap: nowrap;
}

.result-label {
  color: #8892b0;
  font-size: 16px;
  min-width: 80px;
  flex-shrink: 0;
}

.result-value {
  font-size: 32px;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(100, 255, 218, 0.3);
  white-space: nowrap;
  flex-shrink: 0;
}

.result-value.primary {
  color: #64ffda;
}

.result-unit {
  color: #8892b0;
  font-size: 16px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .result-item {
    flex-direction: column;
    gap: 8px;
    text-align: center;
    padding: 16px 0;
  }

  .result-label {
    min-width: auto;
    font-size: 14px;
  }

  .result-value {
    font-size: 28px;
    order: 2;
  }

  .result-unit {
    font-size: 14px;
    order: 3;
  }
}

@media (max-width: 480px) {
  .result-item {
    padding: 12px 0;
    gap: 6px;
  }

  .result-value {
    font-size: 24px;
  }
}
</style>
