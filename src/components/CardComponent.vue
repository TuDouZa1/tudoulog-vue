<script lang="ts" setup>
import type { Card } from '@/types'

defineProps<{ card: Card }>()
</script>

<template>
  <article class="article-card">
    <div v-if="card.coverImage" class="cover-wrapper">
      <img :alt="card.title" :src="card.coverImage" class="article-cover" loading="lazy" />
    </div>
    <div class="card-content">
      <h2 class="article-title">{{ card.title }}</h2>
      <p v-if="card.excerpt" class="article-excerpt">{{ card.excerpt }}</p>
      <footer class="card-footer">
        <time v-if="card.date" :datetime="card.date" class="article-time">{{ card.date }}</time>
        <slot name="tags" />
      </footer>
    </div>
  </article>
</template>

<style scoped>
.article-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  border-radius: var(--border-radius);
  background-color: var(--off-white);
  box-shadow: var(--shadow);
  border: 1px solid var(--light-gray);
  overflow: hidden;
  transition: var(--transition);
}

.article-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

.cover-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--light-gray);
}

.article-cover {
  position: relative;
  display: block;
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  object-position: center;
  transition: var(--transition-slow);
}

.card-content {
  padding: var(--spacing);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex: 1;
}

.article-title {
  color: var(--dark-gray);
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-excerpt {
  color: var(--mid-gray);
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: auto;
}

.article-time {
  color: var(--mid-gray);
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
