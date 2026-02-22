<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { type Article, articles } from '@/utils/articleList'

import 'github-markdown-css'
import 'prismjs/themes/prism-okaidia.css'
import '@/styles/article-common.css'

const route = useRoute()
const articleId = route.params.id as string
const article = computed(() => articles.find(a => a.id === articleId)) as any

// 动态设置标题
onMounted(() => {
  if (article.value) {
    const articleData = article.value as Article
    document.title = articleData.title + '-土豆博客'
  }
})

// 动态加载文章内容组件
const articleComponent = computed(() => {
  const currentArticle = article.value
  if (!currentArticle) return
  return defineAsyncComponent(() => import(`@/articles/${currentArticle.id}.md`))
})
</script>

<template>
  <div class="article-page">
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
</template>

<style scoped>
.article-card {
  background: var(--md-background);
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

.markdown-body {
  padding: 0.5rem 0;
  background: transparent;
}
</style>
