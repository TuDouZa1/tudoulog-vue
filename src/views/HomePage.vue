<script lang="ts" setup>
import { inject, type Ref } from 'vue'
import { type Theme, THEMES } from '@/constants/theme.ts'

const baseUrl = import.meta.env.BASE_URL

// 注入主题
const { activeTheme, setTheme } = inject('theme') as {
  activeTheme: Ref<Theme>
  setTheme: (theme: Theme) => void
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <transition-group appear class="hero-content" name="list" tag="div">
        <h1 key="1" class="hero-title">土豆仔</h1>
        <p key="2" class="hero-subtitle">这是一个纯静态个人博客</p>
        <div key="3" class="hero-image-wrapper">
          <img :src="`${baseUrl}img/tudou.png`" alt="土豆仔" class="hero-image" loading="eager" />
        </div>

        <div key="4" class="theme-picker">
          <span
            v-for="theme in THEMES"
            :key="theme"
            :class="[theme, { active: activeTheme === theme }]"
            class="color-dot"
            @click="setTheme(theme)"
          />
        </div>
      </transition-group>
    </section>
  </div>
</template>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--mid-gray);
  margin: 0;
}

.hero-image-wrapper {
  position: relative;
}

.hero-image {
  margin-top: 1rem;
  width: 320px;
  height: 320px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  transition: var(--transition);
}

@media screen and (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-image {
    width: 250px;
    height: 250px;
  }
}

.theme-picker {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: var(--spacing);
}

.color-dot {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow);
  border: 2px solid transparent;
}

.color-dot.pink {
  background-color: var(--pink);
}
.color-dot.teal {
  background-color: var(--teal);
}
.color-dot.purple {
  background-color: var(--purple);
}
.color-dot:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
}

.color-dot.active {
  border-color: var(--dark-gray);
  transform: scale(1.1);
  box-shadow: var(--shadow-hover);
}

@media screen and (max-width: 768px) {
  .color-dot {
    width: 36px;
    height: 36px;
  }
}

.list-enter-active:nth-child(1) {
  transition-delay: 0s;
}

.list-enter-active:nth-child(2) {
  transition-delay: 0.1s;
}

.list-enter-active:nth-child(3) {
  transition-delay: 0.2s;
}

.list-enter-active:nth-child(4) {
  transition-delay: 0.3s;
}
</style>
