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
              <SecondInput
                :value="lapTimeSeconds"
                :min="1"
                @update:value="(val: number) => (lapTimeSeconds = val)"
              />
            </n-form-item>

            <n-form-item v-if="calculationMode === 'paceToLapTime'" label="每公里配速">
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
              v-if="calculationMode === 'lapTimeToPace'"
              :minutes="resultPace.minutes"
              :seconds="resultPace.seconds"
            />

            <TimeResultDisplay
              v-if="calculationMode === 'paceToLapTime'"
              label="單圈時間"
              :value="resultLapTime"
              unit="秒"
              format="number"
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
import SecondInput from '../../../components/input/SecondInput.vue'
import PaceInputGroup from '../../../components/input/PaceInputGroup.vue'
import PaceResultDisplay from '../../../components/result-display/PaceResultDisplay.vue'
import TimeResultDisplay from '../../../components/result-display/TimeResultDisplay.vue'

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
const lapTimeSeconds = ref<number>(0)
const paceMinutes = ref<number>(0)
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
    const hasValidPace = paceMinutes.value > 0 || paceSeconds.value > 0
    return hasValidPace && selectedLane.value > 0
  }
})

// 監聽單圈時間變化並計算配速
watch(
  [lapTimeSeconds, selectedLane, calculationMode],
  () => {
    if (calculationMode.value === 'lapTimeToPace') {
      if (lapTimeSeconds.value > 0 && selectedLane.value) {
        resultPace.value = calculatePaceFromLapTime(selectedLane.value, lapTimeSeconds.value)
      } else {
        resultPace.value = { minutes: 0, seconds: 0 }
      }
    }
  },
  { immediate: true },
)

// 監聽配速變化並計算單圈時間
watch(
  [paceMinutes, paceSeconds, selectedLane, calculationMode],
  () => {
    if (calculationMode.value === 'paceToLapTime') {
      const hasValidPace = paceMinutes.value > 0 || paceSeconds.value > 0
      if (hasValidPace && selectedLane.value) {
        const pace: PaceTime = { minutes: paceMinutes.value, seconds: paceSeconds.value }
        resultLapTime.value = calculateLapTimeFromPace(selectedLane.value, pace)
      } else {
        resultLapTime.value = 0
      }
    }
  },
  { immediate: true },
)

// 切換計算模式時重置值
watch(calculationMode, (newMode) => {
  if (newMode === 'lapTimeToPace') {
    lapTimeSeconds.value = 0
  } else {
    paceMinutes.value = 0
    paceSeconds.value = 0
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

@media (max-width: 768px) {
  .track-pace-calculator {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .track-pace-calculator {
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
  .track-pace-calculator {
    padding: 4px;
  }

  :deep(.n-card .n-card__content) {
    padding: 12px !important;
  }
}
</style>
