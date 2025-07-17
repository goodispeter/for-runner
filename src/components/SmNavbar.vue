<template>
  <div class="sm-navbar">
    <div class="sm-navbar-content">
      <h1 class="sm-title-text" @click="handleTitleClick">For Runner</h1>
      <n-button quaternary class="menu-btn" @click="toggleMenu">
        <template #icon>
          <n-icon size="28" color="#64ffda">
            <MenuOutline />
          </n-icon>
        </template>
      </n-button>
    </div>
    <transition name="slide-down-menu">
      <div v-show="menuOpen" class="menu-dropdown">
        <div class="menu-list">
          <router-link
            v-for="item in mainNavOptions"
            :key="item.key"
            :to="item.route"
            class="menu-link"
            @click="closeMenu"
          >
            <n-icon class="menu-icon" size="20">
              <component :is="item.icon" />
            </n-icon>
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NIcon } from 'naive-ui'
import { MenuOutline } from '@vicons/ionicons5'
import { mainNavOptions } from '@/constants/nav'

const menuOpen = ref(false)
const router = useRouter()

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
function closeMenu() {
  menuOpen.value = false
}
function handleTitleClick() {
  router.push('/')
}
</script>

<style scoped>
.sm-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 2000;
  background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
  box-shadow: 0 2px 12px rgba(100, 255, 218, 0.08);
}

.sm-navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  min-height: 56px;
}

.sm-title-text {
  font-size: 20px;
  font-weight: 800;
  margin: 0;
  cursor: pointer;
  background: linear-gradient(135deg, #64ffda 0%, #00bcd4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 8px rgba(100, 255, 218, 0.3);
  transition: transform 0.3s ease;
}

.sm-title-text:hover {
  transform: scale(1.05);
}

.menu-btn {
  background: rgba(26, 26, 46, 0.6);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
}

.menu-dropdown {
  position: absolute;
  top: 56px;
  right: 20px;
  background: rgba(26, 26, 46, 0.98);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(100, 255, 218, 0.12);
  padding: 8px 12px;
  width: fit-content;
  max-width: calc(100vw - 40px);
  z-index: 2100;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 12px;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64ffda;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.menu-link:hover {
  color: #00bcd4;
}

.slide-down-menu-enter-active,
.slide-down-menu-leave-active {
  transition: all 0.3s ease;
}
.slide-down-menu-enter-from,
.slide-down-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-down-menu-enter-to,
.slide-down-menu-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
