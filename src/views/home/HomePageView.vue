<template>
  <div class="home-page-view">
    <n-card class="welcome-card" embedded>
      <template #header>
        <div class="card-header">
          <n-text class="welcome-title">歡迎使用 For Runner</n-text>
        </div>
      </template>

      <n-space vertical :size="32" class="welcome-content">
        <!-- 歡迎文字 -->
        <div class="welcome-text">
          <n-text class="subtitle">專為跑者設計的配速計算工具</n-text>
          <n-text class="description">
            無論您是路跑愛好者還是操場訓練者，我們提供精確的配速計算，讓您的訓練更有效率。
          </n-text>
        </div>

        <!-- 功能介紹 -->
        <div class="features-grid">
          <n-card class="feature-card" hoverable>
            <div class="feature-content">
              <n-icon size="32" color="#64ffda">
                <TimerIcon />
              </n-icon>
              <h3>路跑配速計算</h3>
              <p>支援 5K、10K、21K、42K 距離</p>
              <p>輸入目標時間，立即獲得配速建議</p>
            </div>
          </n-card>

          <n-card class="feature-card" hoverable>
            <div class="feature-content">
              <n-icon size="32" color="#64ffda">
                <LocationIcon />
              </n-icon>
              <h3>操場配速計算</h3>
              <p>支援標準 400m 操場六道設計</p>
              <p>精確計算各道別的配速差異</p>
            </div>
          </n-card>
        </div>

        <!-- 開始使用按鈕 -->
        <div class="start-button-container">
          <n-button type="primary" size="large" class="start-button" @click="goToPaceCalculator">
            <template #icon>
              <n-icon>
                <PlayIcon />
              </n-icon>
            </template>
            開始使用配速計算
          </n-button>
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NCard, NSpace, NButton, NIcon, NText } from 'naive-ui'
import {
  Timer as TimerIcon,
  LocationOutline as LocationIcon,
  Play as PlayIcon,
} from '@vicons/ionicons5'

const router = useRouter()

const goToPaceCalculator = () => {
  router.push('/for-runner/pace-calculator')
}
</script>

<style scoped>
.home-page-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.welcome-card {
  background: rgba(22, 33, 62, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-title {
  font-size: 32px;
  font-weight: 800;
  color: #ffffff;
  background: linear-gradient(135deg, #64ffda 0%, #00bcd4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 8px rgba(100, 255, 218, 0.3);
}

.welcome-content {
  padding: 20px;
}

.welcome-text {
  text-align: center;
}

.subtitle {
  font-size: 20px;
  font-weight: 600;
  color: #64ffda;
  display: block;
  margin-bottom: 16px;
}

.description {
  font-size: 16px;
  color: #cfd8dc;
  line-height: 1.6;
  display: block;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin: 32px 0;
}

.feature-card {
  background: rgba(26, 26, 46, 0.6);
  border: 1px solid rgba(100, 255, 218, 0.15);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-card:hover {
  border-color: rgba(100, 255, 218, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(100, 255, 218, 0.2);
}

.feature-content {
  text-align: center;
  padding: 24px;
}

.feature-content h3 {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 16px 0 12px 0;
}

.feature-content p {
  font-size: 14px;
  color: #8892b0;
  margin: 8px 0;
  line-height: 1.5;
}

.start-button-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.start-button {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 25px;
  min-width: 240px;
  height: 56px;
  background: linear-gradient(135deg, #64ffda 0%, #00bcd4 100%);
  border: none;
  color: #0a0e27;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.start-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(100, 255, 218, 0.4);
}

@media (max-width: 768px) {
  .home-page-view {
    padding: 0 16px;
  }

  .welcome-title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 18px;
  }

  .description {
    font-size: 15px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .feature-content {
    padding: 20px;
  }

  .start-button {
    min-width: 200px;
    font-size: 15px;
  }
}
</style>
