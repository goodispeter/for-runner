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
              <TimeInputGroup
                :hours="targetHours"
                :minutes="targetMinutes"
                :seconds="targetSeconds"
                @update:hours="(val: number) => (targetHours = val)"
                @update:minutes="(val: number) => (targetMinutes = val)"
                @update:seconds="(val: number) => (targetSeconds = val)"
              />
            </n-form-item>

            <n-form-item v-if="calculationMode === 'paceToTime'" label="每公里配速">
              <PaceInputGroup
                :minutes="paceMinutes"
                :seconds="paceSeconds"
                @update:minutes="(val: number) => (paceMinutes = val)"
                @update:seconds="(val: number) => (paceSeconds = val)"
              />
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
            <PaceResultDisplay
              v-if="calculationMode === 'timeToPace'"
              :minutes="resultPace.minutes"
              :seconds="resultPace.seconds"
            />

            <TimeResultDisplay
              v-if="calculationMode === 'paceToTime'"
              label="完賽時間"
              :value="resultTimeFormatted"
              unit=""
              format="time"
            />
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
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import {
  NCard,
  NForm,
  NFormItem,
  NSelect,
  NRadioGroup,
  NRadio,
  NText,
  NIcon,
  NSpace,
  NEmpty,
  NGrid,
  NGridItem,
} from 'naive-ui'
import { Calculator as CalculatorIcon } from '@vicons/ionicons5'
import { usePaceCalculator, type PaceTime } from '../../../composables/usePaceCalculator'
import TimeInputGroup from '../../../components/input/TimeInputGroup.vue'
import PaceInputGroup from '../../../components/input/PaceInputGroup.vue'
import PaceResultDisplay from '../../../components/result-display/PaceResultDisplay.vue'
import TimeResultDisplay from '../../../components/result-display/TimeResultDisplay.vue'

// 啟用 duration 插件
dayjs.extend(duration)

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
const targetMinutes = ref<number>(0)
const targetSeconds = ref<number>(0)
const paceMinutes = ref<number>(0)
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
    const hasValidTime = targetHours.value > 0 || targetMinutes.value > 0 || targetSeconds.value > 0
    return hasValidTime && selectedDistance.value > 0
  } else {
    const hasValidPace = paceMinutes.value > 0 || paceSeconds.value > 0
    return hasValidPace && selectedDistance.value > 0
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
  [targetHours, targetMinutes, targetSeconds, selectedDistance, calculationMode],
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
  [paceMinutes, paceSeconds, selectedDistance, calculationMode],
  () => {
    if (calculationMode.value === 'paceToTime') {
      const hasValidPace = paceMinutes.value > 0 || paceSeconds.value > 0
      if (hasValidPace && selectedDistance.value > 0) {
        const pace: PaceTime = { minutes: paceMinutes.value, seconds: paceSeconds.value }
        const totalSeconds = calculateTimeFromPace(selectedDistance.value, pace)
        resultTime.value = formatTime(totalSeconds)
      } else {
        resultTime.value = { hours: 0, minutes: 0, seconds: 0 }
      }
    }
  },
  { immediate: true },
)

// 切換計算模式時重置值
watch(calculationMode, (newMode) => {
  if (newMode === 'timeToPace') {
    targetHours.value = 0
    targetMinutes.value = 0
    targetSeconds.value = 0
  } else {
    paceMinutes.value = 0
    paceSeconds.value = 0
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

@media (max-width: 768px) {
  .running-pace-calculator {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .running-pace-calculator {
    padding: 8px;
  }

  /* 針對手機模式減少 card 的內邊距 */
  :deep(.n-card .n-card__content) {
    padding: 16px !important;
  }

  /* 針對手機模式減少 form 的間距 */
  :deep(.n-form .n-form-item) {
    margin-bottom: 16px;
  }
}

@media (max-width: 360px) {
  .running-pace-calculator {
    padding: 4px;
  }

  :deep(.n-card .n-card__content) {
    padding: 12px !important;
  }
}
</style>
