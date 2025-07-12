<template>
  <div class="running-pace-calculator">
    <n-grid cols="1 s:1 m:2 l:2" responsive="screen" :x-gap="24" :y-gap="20">
      <!-- 輸入區域 -->
      <n-grid-item>
        <n-card embedded class="input-card">
          <n-form :model="formData" size="large">
            <n-form-item label="選擇距離">
              <n-select
                v-model:value="selectedDistance"
                :options="distanceOptions"
                placeholder="選擇跑步距離"
                size="large"
              />
            </n-form-item>

            <n-form-item>
              <n-radio-group v-model:value="calculationMode" size="large">
                <n-space direction="vertical">
                  <n-radio value="timeToPace">完賽時間 → 配速</n-radio>
                  <n-radio value="paceToTime">配速 → 完賽時間</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>

            <n-form-item v-if="calculationMode === 'timeToPace'" label="目標完賽時間">
              <n-input-group>
                <n-input-number
                  v-model:value="targetHours"
                  :min="0"
                  placeholder="時"
                  size="large"
                  class="input-number-field"
                  :show-button="false"
                />
                <n-input-group-label class="input-label">時</n-input-group-label>
                <n-input-number
                  v-model:value="targetMinutes"
                  :min="0"
                  placeholder="分"
                  size="large"
                  class="input-number-field"
                  :show-button="false"
                />
                <n-input-group-label class="input-label">分</n-input-group-label>
                <n-input-number
                  v-model:value="targetSeconds"
                  :min="0"
                  placeholder="秒"
                  size="large"
                  class="input-number-field"
                  :show-button="false"
                />
                <n-input-group-label class="input-label">秒</n-input-group-label>
              </n-input-group>
            </n-form-item>

            <n-form-item v-if="calculationMode === 'paceToTime'" label="每公里配速">
              <n-input-group>
                <n-input-number
                  v-model:value="paceMinutes"
                  :min="1"
                  placeholder="分"
                  size="large"
                  class="input-number-field"
                  :show-button="false"
                />
                <n-input-group-label class="input-label">分</n-input-group-label>
                <n-input-number
                  v-model:value="paceSeconds"
                  :min="0"
                  placeholder="秒"
                  size="large"
                  class="input-number-field"
                  :show-button="false"
                />
                <n-input-group-label class="input-label">秒</n-input-group-label>
              </n-input-group>
            </n-form-item>
          </n-form>
        </n-card>
      </n-grid-item>

      <!-- 結果區域 -->
      <n-grid-item>
        <n-card v-if="showResult" embedded class="result-card">
          <template #header>
            <n-text class="result-title">計算結果</n-text>
          </template>

          <n-space vertical size="large">
            <div v-if="calculationMode === 'timeToPace'" class="result-item">
              <n-text class="result-label">配速</n-text>
              <n-text class="result-value primary">
                {{ resultPace.minutes }}:{{ resultPace.seconds.toString().padStart(2, '0') }}
              </n-text>
              <n-text class="result-unit">/公里</n-text>
            </div>

            <div v-if="calculationMode === 'paceToTime'" class="result-item">
              <n-text class="result-label">完賽時間</n-text>
              <n-text class="result-value primary">{{ resultTimeFormatted }}</n-text>
            </div>

            <div class="distance-info">
              <n-text class="distance-label">總距離</n-text>
              <n-text class="distance-value">{{ selectedDistance }}公里</n-text>
            </div>
          </n-space>
        </n-card>

        <!-- 空狀態 -->
        <n-empty v-else description="請填寫完整資訊以計算結果" class="empty-state">
          <template #icon>
            <n-icon size="48" color="#64ffda">
              <CalculatorIcon />
            </n-icon>
          </template>
        </n-empty>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import {
  NCard,
  NForm,
  NFormItem,
  NSelect,
  NRadioGroup,
  NRadio,
  NInputNumber,
  NInputGroup,
  NInputGroupLabel,
  NText,
  NIcon,
  NSpace,
  NEmpty,
  NGrid,
  NGridItem,
} from 'naive-ui'
import { Calculator as CalculatorIcon } from '@vicons/ionicons5'
import { usePaceCalculator, type PaceTime } from '../../../composables/usePaceCalculator'

const { calculatePaceFromTime, calculateTimeFromPace, formatTime } = usePaceCalculator()

// 距離選項
const distanceOptions = [
  { label: '5公里', value: 5 },
  { label: '10公里', value: 10 },
  { label: '半程馬拉松 (21.1公里)', value: 21.1 },
  { label: '全程馬拉松 (42.2公里)', value: 42.2 },
]

// 響應式數據
const selectedDistance = ref<number>(5)
const calculationMode = ref<'timeToPace' | 'paceToTime'>('timeToPace')
const targetHours = ref<number>(0)
const targetMinutes = ref<number>(25)
const targetSeconds = ref<number>(0)
const paceMinutes = ref<number>(5)
const paceSeconds = ref<number>(0)

// 表單數據
const formData = reactive({
  selectedDistance,
  calculationMode,
  targetHours,
  targetMinutes,
  targetSeconds,
  paceMinutes,
  paceSeconds,
})

// 計算結果
const resultPace = ref<PaceTime>({ minutes: 0, seconds: 0 })
const resultTime = ref<{ hours: number; minutes: number; seconds: number }>({
  hours: 0,
  minutes: 0,
  seconds: 0,
})

// 顯示結果
const showResult = computed(() => {
  if (calculationMode.value === 'timeToPace') {
    return (
      (targetHours.value > 0 || targetMinutes.value > 0 || targetSeconds.value > 0) &&
      selectedDistance.value > 0
    )
  } else {
    return paceMinutes.value > 0 && selectedDistance.value > 0
  }
})

// 格式化完賽時間
const resultTimeFormatted = computed(() => {
  const { hours, minutes, seconds } = resultTime.value
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
})

// 監聽完賽時間變化並計算配速
watch(
  [targetHours, targetMinutes, targetSeconds, selectedDistance],
  () => {
    if (calculationMode.value === 'timeToPace') {
      const totalSeconds = targetHours.value * 3600 + targetMinutes.value * 60 + targetSeconds.value
      if (totalSeconds > 0 && selectedDistance.value > 0) {
        resultPace.value = calculatePaceFromTime(selectedDistance.value, totalSeconds)
      } else {
        resultPace.value = { minutes: 0, seconds: 0 }
      }
    }
  },
  { immediate: true },
)

// 監聽配速變化並計算完賽時間
watch(
  [paceMinutes, paceSeconds, selectedDistance],
  () => {
    if (
      calculationMode.value === 'paceToTime' &&
      paceMinutes.value > 0 &&
      selectedDistance.value > 0
    ) {
      const pace: PaceTime = { minutes: paceMinutes.value, seconds: paceSeconds.value }
      const totalSeconds = calculateTimeFromPace(selectedDistance.value, pace)
      resultTime.value = formatTime(totalSeconds)
    } else {
      resultTime.value = { hours: 0, minutes: 0, seconds: 0 }
    }
  },
  { immediate: true },
)

// 切換計算模式時重置值並重新計算
watch(calculationMode, (newMode) => {
  if (newMode === 'timeToPace') {
    targetHours.value = 0
    targetMinutes.value = 25
    targetSeconds.value = 0
    // 立即計算初始值
    const totalSeconds = targetHours.value * 3600 + targetMinutes.value * 60 + targetSeconds.value
    if (totalSeconds > 0 && selectedDistance.value > 0) {
      resultPace.value = calculatePaceFromTime(selectedDistance.value, totalSeconds)
    }
  } else {
    paceMinutes.value = 5
    paceSeconds.value = 0
    // 立即計算初始值
    const pace: PaceTime = { minutes: paceMinutes.value, seconds: paceSeconds.value }
    const totalSeconds = calculateTimeFromPace(selectedDistance.value, pace)
    resultTime.value = formatTime(totalSeconds)
  }
})
</script>

<style scoped>
.running-pace-calculator {
  padding: 20px;
}

.input-card {
  background: rgba(26, 26, 46, 0.6);
  border: 1px solid rgba(100, 255, 218, 0.1);
}

.result-card {
  background: rgba(26, 26, 46, 0.6);
  border: 1px solid rgba(100, 255, 218, 0.1);
}

.result-title {
  font-size: 18px;
  font-weight: 600;
  color: #64ffda;
}

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

.distance-info {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  padding: 16px;
  background: rgba(100, 255, 218, 0.1);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 12px;
}

.distance-label {
  color: #8892b0;
  font-size: 14px;
}

.distance-value {
  color: #64ffda;
  font-size: 16px;
  font-weight: 600;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

/* 輸入欄位統一樣式 */
.input-number-field {
  flex: 1;
  min-width: 70px;
  max-width: none;
}

:deep(.input-label) {
  min-width: 32px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
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
}

:deep(.n-input-number) {
  height: 40px;
  flex: 1;
}

:deep(.n-input-number .n-input__input-el) {
  height: 40px;
  line-height: 40px;
  text-align: center;
}

@media (max-width: 768px) {
  .running-pace-calculator {
    padding: 16px;
  }

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

  :deep(.input-label) {
    min-width: 28px;
    font-size: 12px;
  }

  .input-number-field {
    min-width: 60px;
    flex: 1;
  }

  :deep(.n-input-number .n-input__input-el) {
    font-size: 14px;
    padding: 0 8px;
  }
}

@media (max-width: 480px) {
  .running-pace-calculator {
    padding: 12px;
  }

  .result-item {
    padding: 12px 0;
    gap: 6px;
  }

  .result-value {
    font-size: 24px;
  }

  :deep(.input-label) {
    min-width: 24px;
    font-size: 11px;
    padding: 0 4px;
  }

  .input-number-field {
    min-width: 55px;
  }

  :deep(.n-input-number .n-input__input-el) {
    font-size: 13px;
    padding: 0 6px;
  }

  :deep(.n-input-group) {
    gap: 2px;
  }
}
</style>
