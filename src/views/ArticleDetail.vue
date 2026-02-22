<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { type Article, articles } from '@/utils/articleList'

import 'github-markdown-css'
import 'prismjs/themes/prism-okaidia.css'

const route = useRoute()
const articleId = route.params.id as string
const article = computed(() => articles.find(a => a.id === articleId))

// 动态设置标题
onMounted(() => {
  const articleData = article.value as Article
  document.title = articleData.title + '-土豆博客'
})

// 动态加载文章内容组件
const articleComponent = computed(() => {
  const currentArticle = article.value
  if (!currentArticle) return null
  return defineAsyncComponent(() => import(`@/articles/${currentArticle.id}.md`))
})
</script>

<template>
  <div v-if="article" class="article-detail">
    <div class="article-card">
      <img v-if="article.coverImage" :src="article.coverImage" alt="文章封面图"
           class="article-cover" />
      <div class="article-content">
        <h1 class="article-title">{{ article.title }}</h1>
        <time class="article-time">{{ article.date }}</time>
        <div class="markdown-body">
          <component :is="articleComponent" v-if="articleComponent" />
        </div>
        <div class="tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>文章不存在</p>
  </div>
</template>

<style>
.article-detail {
  padding: 0 1rem;
}

.article-card {
  background: #0D1117;
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.article-cover {
  width: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 8px 8px 0 0;
}

.article-content {
  padding: 0 1.5rem 1.5rem 1.5rem;
}

.article-content img {
  width: 100%;
}

.article-title {
  font-size: 36px;
}

.article-time {
  color: var(--mid-gray);
  font-size: 14px;
  font-weight: 700;
}

.markdown-body {
  padding-top: 0.5rem;
  background: transparent;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  margin-top: 1rem;
  background: var(--off-white);
  border: 2px solid var(--light-gray);
  border-radius: 8px;
  color: var(--dark-gray);
  font-size: 12px;
  padding: 0.25rem 0.5rem;
  font-weight: bold;
  transition: var(--transition);
}

.tag:hover {
  background: var(--light-gray);
}
</style>
