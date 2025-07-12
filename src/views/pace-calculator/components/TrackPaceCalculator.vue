<template>
  <div class="track-pace-calculator">
    <n-grid cols="1 s:1 m:2 l:2" responsive="screen" :x-gap="24" :y-gap="20">
      <!-- 輸入區域 -->
      <n-grid-item>
        <n-card embedded class="input-card">
          <n-form :model="formData" size="large">
            <n-form-item label="選擇跑道">
              <n-select
                v-model:value="selectedLane"
                :options="laneOptions"
                placeholder="選擇跑道"
                size="large"
              />
            </n-form-item>

            <n-form-item>
              <n-radio-group v-model:value="calculationMode" size="large">
                <n-space direction="vertical">
                  <n-radio value="lapTimeToPace">單圈時間 → 配速</n-radio>
                  <n-radio value="paceToLapTime">配速 → 單圈時間</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>

            <n-form-item v-if="calculationMode === 'lapTimeToPace'" label="單圈時間">
              <n-input-group>
                <n-input-number
                  v-model:value="lapTimeSeconds"
                  :min="1"
                  placeholder="輸入單圈秒數"
                  size="large"
                  class="input-number-field"
                  :show-button="false"
                />
                <n-input-group-label class="input-label">秒</n-input-group-label>
              </n-input-group>
            </n-form-item>

            <n-form-item v-if="calculationMode === 'paceToLapTime'" label="每公里配速">
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
            <div v-if="calculationMode === 'lapTimeToPace'" class="result-item">
              <n-text class="result-label">配速</n-text>
              <n-text class="result-value primary">
                {{ resultPace.minutes }}:{{ resultPace.seconds.toString().padStart(2, '0') }}
              </n-text>
              <n-text class="result-unit">/公里</n-text>
            </div>

            <div v-if="calculationMode === 'paceToLapTime'" class="result-item">
              <n-text class="result-label">單圈時間</n-text>
              <n-text class="result-value primary">{{ Math.round(resultLapTime) }}</n-text>
              <n-text class="result-unit">秒</n-text>
            </div>

            <div class="track-info">
              <n-text class="track-label">跑道距離</n-text>
              <n-text class="track-value">{{ trackDistance }}公尺</n-text>
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

const { calculateTrackDistance, calculatePaceFromLapTime, calculateLapTimeFromPace } =
  usePaceCalculator()

// 跑道選項
const laneOptions = [
  { label: '第1道 (400m)', value: 1 },
  { label: '第2道 (406m)', value: 2 },
  { label: '第3道 (412m)', value: 3 },
  { label: '第4道 (418m)', value: 4 },
  { label: '第5道 (424m)', value: 5 },
  { label: '第6道 (430m)', value: 6 },
]

// 響應式數據
const selectedLane = ref<number>(1)
const calculationMode = ref<'lapTimeToPace' | 'paceToLapTime'>('lapTimeToPace')
const lapTimeSeconds = ref<number>(90)
const paceMinutes = ref<number>(5)
const paceSeconds = ref<number>(0)

// 表單數據
const formData = reactive({
  selectedLane,
  calculationMode,
  lapTimeSeconds,
  paceMinutes,
  paceSeconds,
})

// 計算結果
const resultPace = ref<PaceTime>({ minutes: 0, seconds: 0 })
const resultLapTime = ref<number>(0)

// 計算跑道距離
const trackDistance = computed(() => calculateTrackDistance(selectedLane.value))

// 顯示結果
const showResult = computed(() => {
  if (calculationMode.value === 'lapTimeToPace') {
    return lapTimeSeconds.value > 0 && selectedLane.value > 0
  } else {
    return paceMinutes.value > 0 && selectedLane.value > 0
  }
})

// 監聽單圈時間變化並計算配速
watch(
  [lapTimeSeconds, selectedLane],
  () => {
    if (
      calculationMode.value === 'lapTimeToPace' &&
      lapTimeSeconds.value > 0 &&
      selectedLane.value
    ) {
      resultPace.value = calculatePaceFromLapTime(selectedLane.value, lapTimeSeconds.value)
    } else {
      resultPace.value = { minutes: 0, seconds: 0 }
    }
  },
  { immediate: true },
)

// 監聽配速變化並計算單圈時間
watch(
  [paceMinutes, paceSeconds, selectedLane],
  () => {
    if (calculationMode.value === 'paceToLapTime' && paceMinutes.value > 0 && selectedLane.value) {
      const pace: PaceTime = { minutes: paceMinutes.value, seconds: paceSeconds.value }
      resultLapTime.value = calculateLapTimeFromPace(selectedLane.value, pace)
    } else {
      resultLapTime.value = 0
    }
  },
  { immediate: true },
)

// 切換計算模式時重置值並重新計算
watch(calculationMode, (newMode) => {
  if (newMode === 'lapTimeToPace') {
    lapTimeSeconds.value = 90
    // 立即計算初始值
    if (lapTimeSeconds.value > 0 && selectedLane.value) {
      resultPace.value = calculatePaceFromLapTime(selectedLane.value, lapTimeSeconds.value)
    }
  } else {
    paceMinutes.value = 5
    paceSeconds.value = 0
    // 立即計算初始值
    const pace: PaceTime = { minutes: paceMinutes.value, seconds: paceSeconds.value }
    resultLapTime.value = calculateLapTimeFromPace(selectedLane.value, pace)
  }
})
</script>

<style scoped>
.track-pace-calculator {
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

.track-info {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  padding: 16px;
  background: rgba(100, 255, 218, 0.1);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 12px;
}

.track-label {
  color: #8892b0;
  font-size: 14px;
}

.track-value {
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
  .track-pace-calculator {
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
    min-width: 22px;
    font-size: 10px;
  }

  .input-number-field {
    min-width: 45px;
    flex: 1;
  }

  :deep(.n-input-number .n-input__input-el) {
    font-size: 14px;
    padding: 0 4px;
  }
}

@media (max-width: 480px) {
  .track-pace-calculator {
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
    min-width: 20px;
    font-size: 9px;
    padding: 0 2px;
  }

  .input-number-field {
    min-width: 40px;
  }

  :deep(.n-input-number .n-input__input-el) {
    font-size: 12px;
    padding: 0 2px;
  }

  :deep(.n-input-group) {
    gap: 1px;
  }
}
</style>
