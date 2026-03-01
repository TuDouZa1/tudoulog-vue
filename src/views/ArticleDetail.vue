<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, nextTick, onMounted, ref } from 'vue'
import { articles } from '@/utils/articleList'
import type { Heading } from '@/types'

import 'github-markdown-css'
import '@/styles/article-common.css'
import TocComponent from '@/components/TocComponent.vue'
import BackToTop from '@/components/BackToTop.vue'
import TagComponent from '@/components/TagComponent.vue'

const route = useRoute()
const router = useRouter()
const goToListWithTag = (tags: string) => {
  router.push({
    path: '/article',
    query: { tags },
  })
}

const articleId = route.params.id as string
const article = computed(() => articles.find((a) => a.id === articleId))

const contentRef = ref<HTMLElement | null>(null)
const headings = ref<Heading[]>([])

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-') // 空格替换为'-'
    .replace(/[^\w\u4e00-\u9fa5-]/g, '') // 保留中文，字母，数字，连字符
}

onMounted(async () => {
  if (article.value) {
    // 设置标题为文章标题
    document.title = article.value.title + '-土豆博客'
  }

  // 等待 DOM 更新，确保文章已渲染完毕
  await nextTick()

  if (!contentRef.value) return

  // 获取所有h2 h3元素
  const elements = contentRef.value.querySelectorAll('h2, h3')
  // 导航集合
  const items: Heading[] = []

  // 遍历所有h2 h3元素，设置id，title，level属性放入items中
  elements.forEach((element) => {
    const level = element.tagName === 'H2' ? 2 : 3

    let id = element.id
    if (!id) {
      id = slugify(element.textContent || 'heading')
      element.id = id
    }
    items.push({
      id,
      title: element.textContent || '',
      level,
    })
  })

  // 设置不同标题的继承关系
  // h3是最近的h2的子集
  const tree: Heading[] = []
  // 最新的h2
  let lastH2: Heading | null = null

  items.forEach((item) => {
    if (item.level === 2) {
      lastH2 = { ...item, children: [] }
      tree.push(lastH2)
    } else if (item.level === 3 && lastH2 !== null) {
      lastH2.children!.push({ ...item, children: [] })
    } else {
      tree.push({ ...item, children: [] })
    }
  })
  headings.value = tree
  console.log('articleDetail headings:', headings.value)
})
</script>

<template>
  <div class="article-page">
    <div v-if="article" class="article-card">
      <div
        v-if="article.coverImage"
        :style="`background-image: url(${article.coverImage})`"
        class="cover-wrapper"
      >
        <img :src="article.coverImage" alt="文章封面图" class="article-cover" />
        <div class="tags-position">
          <TagComponent :tags="article.tags || []" mode="navigate" @click-tag="goToListWithTag" />
        </div>
        <div class="article-meta">
          <h1 class="article-title">{{ article.title }}</h1>
          <time class="article-time">{{ article.date }}</time>
        </div>
      </div>
      <div class="article-content">
        <div ref="contentRef" class="markdown-body">
          <component :is="article.component" v-if="article.component" />
        </div>
        <TocComponent :headings="headings" />
      </div>
    </div>
    <BackToTop />
  </div>
</template>

<style scoped>
.article-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.5rem;
  max-width: 1200px;
  width: 100%;
}

.article-card {
  width: 100%;
  background: var(--md-background);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.cover-wrapper {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.cover-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: inherit; /* 继承父元素的背景图 */
  background-size: cover;
  background-position: center;
  filter: blur(8px); /* 只模糊背景层 */
  z-index: 0;
}

.cover-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%);
  z-index: 2;
}

.article-cover {
  position: relative;
  display: block;
  width: 100%;
  max-height: 60vh;
  object-fit: scale-down;
  object-position: center;
  border-radius: inherit;
  z-index: 1;
}

.tags-position {
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  width: 100%;
  z-index: 3;
}

.article-meta {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 1rem 1rem;
  z-index: 3;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.article-title {
  color: #fff;
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}

.article-time {
  color: #fff;
}

.article-content {
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;
  box-sizing: border-box;
}

.article-content img {
  width: 100%;
}

.markdown-body {
  min-width: 0;
  width: 100%;
  overflow-x: auto; /* 可选：如果子元素仍溢出，让整个内容区滚动 */
}
</style>
