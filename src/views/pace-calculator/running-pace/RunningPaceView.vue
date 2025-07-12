<template>
  <div class="running-pace-view">
    <n-card class="calculator-card" embedded>
      <template #header>
        <div class="card-header">
          <n-icon size="24" color="#64ffda">
            <TimerIcon />
          </n-icon>
          <n-text class="card-title">路跑配速計算機</n-text>
        </div>
      </template>

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
                    <n-radio value="timeToPace">目標時間 → 配速</n-radio>
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
                <n-text class="result-label">需要配速</n-text>
                <n-text class="result-value primary">
                  {{ resultPace.minutes }}:{{ resultPace.seconds.toString().padStart(2, '0') }}
                </n-text>
                <n-text class="result-unit">/公里</n-text>
              </div>

              <div v-if="calculationMode === 'paceToTime'" class="result-item">
                <n-text class="result-label">預估完賽時間</n-text>
                <n-text class="result-value primary">{{ resultTime }}</n-text>
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
    </n-card>
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
import { Timer as TimerIcon, Calculator as CalculatorIcon } from '@vicons/ionicons5'
import { usePaceCalculator, type PaceTime } from '../../../composables/usePaceCalculator'

const { calculatePaceFromTime, calculateTimeFromPace } = usePaceCalculator()

// 距離選項
const distanceOptions = [
  { label: '5K', value: 5 },
  { label: '10K', value: 10 },
  { label: '21K (半馬)', value: 21.0975 },
  { label: '42K (全馬)', value: 42.195 },
]

// 響應式數據
const selectedDistance = ref<number>(5)
const calculationMode = ref<'timeToPace' | 'paceToTime'>('timeToPace')

// 目標時間輸入（時分秒）
const targetHours = ref<number>(0)
const targetMinutes = ref<number>(25)
const targetSeconds = ref<number>(0)

// 配速輸入（分秒）
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
const resultTime = ref<string>('')

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

// 將時分秒轉換為秒數
const getTargetTimeInSeconds = () => {
  return (
    (targetHours.value || 0) * 3600 + (targetMinutes.value || 0) * 60 + (targetSeconds.value || 0)
  )
}

// 將秒數轉換為時間字串
const secondsToTimeString = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}

// 監聽目標時間輸入變化並計算配速
watch([targetHours, targetMinutes, targetSeconds, selectedDistance], () => {
  if (calculationMode.value === 'timeToPace' && selectedDistance.value) {
    const timeSeconds = getTargetTimeInSeconds()
    if (timeSeconds > 0) {
      resultPace.value = calculatePaceFromTime(selectedDistance.value, timeSeconds)
    }
  }
})

// 監聽配速輸入變化並計算完賽時間
watch([paceMinutes, paceSeconds, selectedDistance], () => {
  if (calculationMode.value === 'paceToTime' && paceMinutes.value > 0 && selectedDistance.value) {
    const pace: PaceTime = { minutes: paceMinutes.value, seconds: paceSeconds.value }
    const timeSeconds = calculateTimeFromPace(selectedDistance.value, pace)
    resultTime.value = secondsToTimeString(timeSeconds)
  }
})

// 切換計算模式時清空結果
watch(calculationMode, () => {
  targetHours.value = 0
  targetMinutes.value = 25
  targetSeconds.value = 0
  paceMinutes.value = 5
  paceSeconds.value = 0
})
</script>

<style scoped>
.running-pace-view {
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.calculator-card {
  background: rgba(22, 33, 62, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
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
  gap: 12px;
  padding: 12px 0;
}

.result-label {
  color: #8892b0;
  font-size: 14px;
  min-width: 100px;
}

.result-value {
  font-size: 28px;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(100, 255, 218, 0.3);
}

.result-value.primary {
  color: #64ffda;
}

.result-unit {
  color: #8892b0;
  font-size: 14px;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

/* 輸入欄位統一樣式 */
.input-number-field {
  flex: 1;
  min-width: 0;
}

:deep(.input-label) {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  color: #8892b0;
  background: rgba(100, 255, 218, 0.1);
  border: 1px solid rgba(100, 255, 218, 0.2);
}

:deep(.n-input-group) {
  display: flex;
  align-items: stretch;
}

:deep(.n-input-number) {
  height: 40px;
}

:deep(.n-input-number .n-input__input-el) {
  height: 40px;
  line-height: 40px;
}

@media (max-width: 768px) {
  .running-pace-view {
    padding: 0;
  }

  .result-value {
    font-size: 24px;
  }

  .card-title {
    font-size: 18px;
  }
}
</style>
