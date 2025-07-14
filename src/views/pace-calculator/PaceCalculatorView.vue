<template>
  <div class="pace-calculator-view">
    <n-card class="main-calculator-card" embedded>
      <n-space vertical :size="24">
        <!-- 計算器類型選擇 -->
        <div class="calculator-type-selector">
          <n-radio-group v-model:value="calculatorType" size="large">
            <n-space :size="20">
              <n-radio value="running">
                <div class="radio-option">
                  <n-icon size="20" color="#64ffda">
                    <TimerIcon />
                  </n-icon>
                  <span>路跑配速</span>
                </div>
              </n-radio>
              <n-radio value="track">
                <div class="radio-option">
                  <n-icon size="20" color="#64ffda">
                    <LocationIcon />
                  </n-icon>
                  <span>操場配速</span>
                </div>
              </n-radio>
            </n-space>
          </n-radio-group>
        </div>

        <!-- 動態顯示對應的計算器組件 - 使用 v-show 保持狀態 -->
        <div class="calculator-content">
          <div v-show="calculatorType === 'running'">
            <RunningPaceCalculator />
          </div>
          <div v-show="calculatorType === 'track'">
            <TrackPaceCalculator />
          </div>
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NSpace, NRadioGroup, NRadio, NIcon, NText } from 'naive-ui'
import { Timer as TimerIcon, LocationOutline as LocationIcon } from '@vicons/ionicons5'
import RunningPaceCalculator from './components/RunningPaceCalculator.vue'
import TrackPaceCalculator from './components/TrackPaceCalculator.vue'

// 計算器類型
const calculatorType = ref<'running' | 'track'>('running')
</script>

<style scoped>
.main-calculator-card {
  background: rgba(22, 33, 62, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  padding: 24px;
}

.calculator-type-selector {
  padding: 24px;
  background: rgba(26, 26, 46, 0.4);
  border: 1px solid rgba(100, 255, 218, 0.15);
  border-radius: 16px;
  margin-bottom: 8px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.calculator-content {
  min-height: 420px; /* 減少高度以適應無滾動條的佈局 */
}

/* 自訂 radio 樣式 */
:deep(.n-radio .n-radio__label) {
  font-weight: 600;
  color: #cfd8dc;
}

:deep(.n-radio.n-radio--checked .n-radio__label) {
  color: #64ffda;
}

:deep(.n-radio .n-radio__dot) {
  border-color: rgba(100, 255, 218, 0.4);
}

:deep(.n-radio.n-radio--checked .n-radio__dot) {
  border-color: #64ffda;
  background-color: #64ffda;
}

@media (max-width: 768px) {
  .main-calculator-card {
    padding: 20px;
  }

  .calculator-type-selector {
    padding: 20px;
    margin-bottom: 6px;
  }

  .radio-option {
    font-size: 15px;
  }
}
</style>
