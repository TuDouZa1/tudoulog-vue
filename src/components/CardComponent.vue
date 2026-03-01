<script lang="ts" setup>
import type { Card } from '@/types'

defineProps<{ card: Card }>()
</script>

<template>
  <div class="article-card">
    <img v-if="card.coverImage" :src="card.coverImage" alt="文章封面图" class="article-cover" />
    <div class="article-title">{{ card.title }}</div>
    <div v-if="card.excerpt" class="article-excerpt">{{ card.excerpt }}</div>
    <time v-if="card.date" class="article-time">{{ card.date }}</time>
    <slot name="tags"></slot>
  </div>
</template>

<style scoped>
.article-card {
  break-inside: avoid;
  display: block;
  margin-bottom: 0.5rem;
  text-decoration: none;
  padding: 1rem;
  border-radius: 12px;
  background-color: var(--off-white);
  box-shadow: var(--shadow);
  border: 1px solid var(--light-gray);
  overflow: hidden;
  transition: box-shadow 0.3s ease-in-out;
}

.article-card:hover {
  box-shadow: var(--shadow-hover);
}

.article-cover {
  width: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
}

.article-title {
  color: var(--dark-gray);
  font-size: 1.25rem;
  font-weight: 700;
}

.article-excerpt {
  color: var(--dark-gray);
  font-size: 16px;
  line-height: 1.5;
}

.article-time {
  margin-bottom: 0.5rem;
}
</style>
