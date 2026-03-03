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
import { TAG_MODE } from '@/constants/tagMode.ts'

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
  // 记录每个基础 slug 的出现次数，用来处理标题名相同的情况
  const slugCount = new Map<string, number>()

  // 遍历所有h2 h3元素，设置id，title，level属性放入items中
  elements.forEach((element) => {
    const level = element.tagName === 'H2' ? 2 : 3

    let id = element.id
    if (!id) {
      const rawText = element.textContent || 'heading'
      let baseSlug = slugify(rawText)
      // 如果 baseSlug 为空（例如只有特殊字符），赋值为默认值
      if (!baseSlug) baseSlug = 'heading'
      const count = slugCount.get(baseSlug) || 0
      if (count === 0) {
        id = baseSlug
      } else {
        id = `${baseSlug}-${count}`
      }
      // 更新计数器
      slugCount.set(baseSlug, count + 1)
      // 将生成的 id 赋给元素
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
  <article class="article-page">
    <div v-if="article" class="article-card">
      <!-- 封面区域 -->
      <header
        v-if="article.coverImage"
        :style="`background-image: url(${article.coverImage})`"
        class="cover-wrapper"
      >
        <img :alt="article.title" :src="article.coverImage" class="article-cover" loading="eager" />
        <div class="tags-position">
          <TagComponent
            :mode="TAG_MODE[1]"
            :tags="article.tags || []"
            @click-tag="goToListWithTag"
          />
        </div>
        <div class="article-meta">
          <h1 class="article-title">{{ article.title }}</h1>
          <time :datetime="article.date" class="article-time">{{ article.date }}</time>
        </div>
      </header>

      <div v-if="article.excerpt" class="article-excerpt">{{ article.excerpt }}</div>

      <!-- 文章内容 -->
      <section class="article-content">
        <div ref="contentRef" class="markdown-body">
          <component :is="article.component" v-if="article.component" />
        </div>
        <TocComponent :headings="headings" />
      </section>
    </div>
    <BackToTop />
  </article>
</template>

<style scoped>
.article-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  max-width: 1200px;
  width: 100%;
}

.article-card {
  width: 100%;
  background: var(--md-background);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.cover-wrapper {
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}

.cover-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: inherit; /* 继承父元素的背景图 */
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  z-index: 0;
}

.cover-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
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
  z-index: 1;
}

.tags-position {
  position: absolute;
  top: var(--spacing);
  left: var(--spacing);
  right: var(--spacing);
  z-index: 3;
}

.article-meta {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: var(--spacing-lg) var(--spacing);
  z-index: 3;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.article-title {
  color: #fff;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 var(--spacing-xs);
  line-height: 1.3;
}

.article-time {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.article-excerpt {
  width: 100%;
  padding: var(--spacing-lg);
  background: var(--off-white);
  color: var(--dark-gray);
}
.article-content {
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-lg);
  gap: var(--spacing-lg);
}

.article-content img {
  width: 100%;
}

@media (max-width: 768px) {
  .article-content {
    flex-direction: column;
    padding: var(--spacing);
  }
  .article-title {
    font-size: 1.25rem;
  }
}

.markdown-body {
  background: none;
  width: 100%;
  min-width: 0;
  flex-shrink: 1;
}
</style>
