<script lang="ts" setup>
import { onMounted, provide, ref } from 'vue'
import { DEFAULT_THEME, type Theme, THEMES } from '@/constants/theme.ts'

const activeTheme = ref<Theme>(DEFAULT_THEME)

// 应用主题的函数
const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  root.style.setProperty('--main', `var(--${theme})`)
  root.style.setProperty('--main-light', `var(--${theme}-light)`)
  localStorage.setItem('theme', theme)
  activeTheme.value = theme
}

// 提供给子组件
provide('theme', {
  activeTheme,
  setTheme: applyTheme,
})

// 初始化
onMounted(() => {
  const saved = localStorage.getItem('theme') as Theme | null
  if (saved && THEMES.includes(saved)) {
    applyTheme(saved)
  } else {
    applyTheme(DEFAULT_THEME) // 默认并存入 localStorage
  }
})
</script>
<template>
  <div class="app">
    <router-view />
  </div>
</template>
