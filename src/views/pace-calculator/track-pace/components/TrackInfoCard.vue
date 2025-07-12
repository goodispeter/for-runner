<template>
  <n-card embedded class="track-info-card">
    <template #header>
      <div class="info-header" @click="toggleExpanded">
        <n-icon size="20" color="#64ffda">
          <InfoIcon />
        </n-icon>
        <n-text class="info-title">跑道說明</n-text>
        <n-icon size="16" color="#8892b0" class="expand-icon" :class="{ expanded: isExpanded }">
          <ChevronDownIcon />
        </n-icon>
      </div>
    </template>

    <n-collapse-transition :show="isExpanded">
      <div class="info-content">
        <n-space vertical size="medium">
          <n-text class="info-description"> 標準 400m 操場，每道增加約 6m 距離 </n-text>

          <n-grid cols="1 s:2 m:3" responsive="screen" :x-gap="16" :y-gap="12">
            <n-grid-item v-for="lane in laneInfo" :key="lane.number">
              <div class="lane-item">
                <n-text class="lane-number">第{{ lane.number }}道</n-text>
                <n-text class="lane-distance">{{ lane.distance }}m</n-text>
              </div>
            </n-grid-item>
          </n-grid>

          <n-divider style="margin: 16px 0" />

          <n-space size="small" align="center">
            <n-icon size="16" color="#00e676">
              <CheckmarkIcon />
            </n-icon>
            <n-text depth="3" size="small"> 計算基於標準田徑場規格，適用於大部分 400m 操場 </n-text>
          </n-space>
        </n-space>
      </div>
    </n-collapse-transition>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  NCard,
  NText,
  NIcon,
  NSpace,
  NDivider,
  NGrid,
  NGridItem,
  NCollapseTransition,
} from 'naive-ui'
import {
  InformationCircleOutline as InfoIcon,
  ChevronDown as ChevronDownIcon,
  Checkmark as CheckmarkIcon,
} from '@vicons/ionicons5'

// 展開狀態
const isExpanded = ref(false)

// 跑道資訊
const laneInfo = [
  { number: 1, distance: 400 },
  { number: 2, distance: 406 },
  { number: 3, distance: 412 },
  { number: 4, distance: 418 },
  { number: 5, distance: 424 },
  { number: 6, distance: 430 },
]

// 切換展開狀態
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.track-info-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(100, 255, 218, 0.15);
  border-radius: 12px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.info-header:hover {
  color: #64ffda;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: #64ffda;
  flex: 1;
}

.expand-icon {
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.info-content {
  padding-top: 16px;
}

.info-description {
  color: #cfd8dc;
  font-size: 14px;
  line-height: 1.5;
}

.lane-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(100, 255, 218, 0.05);
  border: 1px solid rgba(100, 255, 218, 0.1);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.lane-item:hover {
  background: rgba(100, 255, 218, 0.1);
  border-color: rgba(100, 255, 218, 0.2);
}

.lane-number {
  color: #8892b0;
  font-size: 13px;
  font-weight: 500;
}

.lane-distance {
  color: #64ffda;
  font-size: 14px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .info-title {
    font-size: 14px;
  }

  .info-description {
    font-size: 13px;
  }

  .lane-number,
  .lane-distance {
    font-size: 12px;
  }
}
</style>
