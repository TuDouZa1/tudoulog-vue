<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const route = useRoute()
// 首页不显示底部
const isHome = computed(() => route.path === '/')
</script>

<template>
  <div class="layout">
    <AppHeader></AppHeader>
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition appear mode="out-in" name="page">
          <component :is="Component" :key="$route.fullPath" />
        </transition>
      </router-view>
    </main>
    <AppFooter v-if="!isHome"></AppFooter>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}

.main-content {
  width: 100%;
  max-width: 700px;
  flex: 1;
}
</style>
