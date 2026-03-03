<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { articles } from '@/utils/articleList'
import CardComponent from '@/components/CardComponent.vue'
import TagComponent from '@/components/TagComponent.vue'
import '@/styles/article-common.css'
import '@/styles/tag-common.css'
import { useRoute } from 'vue-router'

const route = useRoute()

// 搜索
const searchQuery = ref('')

const clearSearch = () => {
  searchQuery.value = ''
  nextTick(() => {
    document.getElementById('search-input')?.focus()
  })
}

// 标签筛选
const selectedTags = ref<string[]>([])
onMounted(() => {
  const tagsQuery = route.query.tags
  if (tagsQuery) {
    if (typeof tagsQuery === 'string') {
      selectedTags.value = tagsQuery.split(',').filter((tag) => tag.trim().length > 0)
    }
  }
})
const removeTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index !== -1) {
    selectedTags.value.splice(index, 1)
  }
}
const clearTags = () => {
  selectedTags.value = []
}

// 筛选文章列表
const filteredArticles = computed(() => {
  return articles.filter((a) => {
    const matchTags =
      selectedTags.value.length === 0 ||
      (a.tags && selectedTags.value.every((tag) => a.tags.includes(tag)))

    const query = searchQuery.value.trim().toLowerCase()
    const matchSearch =
      query === '' ||
      a.title.toLowerCase().includes(query) ||
      a.excerpt?.toLowerCase().includes(query) ||
      a.tags?.some((tag) => tag.toLowerCase().includes(query))

    return matchTags && matchSearch
  })
})

// 分页
const currentPage = ref(1)
// 一页最多显示几个
const pageSize = ref(5)
// 总共几页
const totalPages = computed(() => Math.ceil(filteredArticles.value.length / pageSize.value))
// 当前页显示的文章
const showArticles = computed(() => {
  const startArticle = (currentPage.value - 1) * pageSize.value
  const endArticle = startArticle + pageSize.value
  return filteredArticles.value.slice(startArticle, endArticle)
})
// 当筛选或搜索导致过滤的文章列表变化时，重置当前页为第一页
watch(filteredArticles, () => (currentPage.value = 1))
// 页面输入跳转
const inputPageNum = ref('')
const changePage = () => {
  const pageNum = Number(inputPageNum.value)
  if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages.value) {
    currentPage.value = pageNum
  }
  inputPageNum.value = ''
}
// 分页按钮显示逻辑
const showPageBtn = computed<number[]>(() => {
  const total = totalPages.value
  const current = currentPage.value
  const range = [] // 符合条件的页码
  // // 包括省略号在内最多8个元素：1，最后一页，index，index+1，index-1，两个省略号，输入框
  // for (let index = 1; index <= total; index++) {
  //   if (
  //     index === 1 ||
  //     index === total ||
  //     // index和index左右两边的数字
  //     (index - current < 2 && index + 1 >= current) ||
  //     // 最后几位页码特殊处理
  //     (total - current < 4 && total - index < 2)
  //   ) {
  //     range.push(index)
  //   }
  // }
  // const result: (number | string)[] = [] // 结果
  // let pre = 0
  // for (const i of range) {
  //   // 判断省略号位置
  //   if (i - pre > 1) {
  //     result.push('...')
  //   }
  //   result.push(i)
  //   pre = i
  // }
  // console.log('result:', result)
  // return result

  // 再次精简
  // 为了不让页码按钮过多，包括省略号在内最多4个元素：1，最后一页，index，输入框
  for (let index = 1; index <= total; index++) {
    if (index === 1 || index === total || index === current) {
      range.push(index)
    }
  }
  return range
})
// 切换页码后页面回到最顶端
watch(currentPage, () => {
  nextTick(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }) // 平滑滚动
  })
})
</script>

<template>
  <div class="article-page">
    <!--  搜索  -->
    <div class="search">
      <svg
        aria-hidden="true"
        class="search-icon"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        id="search-input"
        v-model="searchQuery"
        aria-label="搜索文章"
        class="search-input"
        placeholder="搜索文章..."
        type="text"
      />
      <button v-if="searchQuery" aria-label="清空搜索" class="clear-btn" @click="clearSearch">
        ✕
      </button>
    </div>
    <!--  标签筛选  -->
    <div class="tag-bar">
      <div class="selected-tag-container">
        <span class="tag-bar-info">
          {{ selectedTags.length > 0 ? '标签：' : '点击文章标签进行筛选' }}
        </span>
        <TransitionGroup class="selected-tags" name="tag" tag="span">
          <button
            v-for="tag in selectedTags"
            :key="tag"
            :aria-label="tag"
            class="selected-tag"
            type="button"
            @click.stop="removeTag(tag)"
          >
            {{ tag }}
          </button>
        </TransitionGroup>
      </div>
      <button
        v-show="selectedTags.length > 0"
        aria-label="清除筛选"
        class="clear-all-btn"
        type="button"
        @click="clearTags"
      >
        清除全部
      </button>
    </div>

    <!--  文章列表  -->
    <transition-group
      v-if="showArticles.length > 0"
      appear
      class="article-list"
      name="list"
      tag="div"
    >
      <router-link
        v-for="(article, index) in showArticles"
        :key="article.id"
        :style="{ '--delay': index * 0.1 + 's' }"
        :to="`/article/${article.id}`"
      >
        <CardComponent :card="article">
          <template #tags>
            <TagComponent v-model="selectedTags" :tags="article.tags || []" />
          </template>
        </CardComponent>
      </router-link>
    </transition-group>
    <div v-else class="article-empty">
      <h1>暂无文章</h1>
    </div>
    <!--  分页  -->
    <nav v-if="filteredArticles.length > 0 && totalPages > 1" aria-label="分页导航" class="page">
      <button
        :class="currentPage === 1 ? 'page-btn-disabled' : 'page-btn'"
        :disabled="currentPage === 1"
        aria-label="上一页"
        type="button"
        @click="currentPage--"
      >
        上一页
      </button>
      <button
        v-for="(item, index) in showPageBtn"
        :key="index"
        :class="item === currentPage ? 'page-btn-active' : 'page-btn'"
        class="page-btn"
        type="button"
        @click="currentPage = item"
      >
        {{ item }}
      </button>
      <button
        :class="currentPage === totalPages ? 'page-btn-disabled' : 'page-btn'"
        :disabled="currentPage === totalPages"
        aria-label="下一页"
        type="button"
        @click="currentPage++"
      >
        下一页
      </button>
      <!--   页面输入回车跳转   -->
      <input
        v-if="totalPages > 3"
        v-model="inputPageNum"
        aria-label="输入页码"
        class="page-input"
        inputmode="numeric"
        placeholder="Go"
        type="text"
        @keyup.enter="changePage"
      />
    </nav>

    <div v-if="filteredArticles.length > 0" class="result-stats">
      共 {{ filteredArticles.length }} 篇文章
      <span v-if="totalPages > 1">，第 {{ currentPage }} / {{ totalPages }} 页</span>
    </div>
  </div>
</template>

<style scoped>
/* 搜索 */
.search {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  background: var(--off-white);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  border: var(--border);
  transition: var(--transition);
}

.search:focus-within {
  box-shadow: var(--shadow-hover);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: var(--mid-gray);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--dark-gray);
  font-size: 1rem;
  padding: 0.25rem;
}

.search-input::placeholder {
  color: var(--mid-gray);
}

.clear-btn {
  background: none;
  border: none;
  color: var(--mid-gray);
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1rem;
  line-height: 1;
  transition: var(--transition-fast);
}

.clear-btn:hover {
  color: var(--dark-gray);
}

/* 标签栏 */
.tag-bar {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  background-color: var(--off-white);
  box-shadow: var(--shadow);
  border: var(--border);
  transition: var(--transition);
}

.tag-bar:hover {
  box-shadow: var(--shadow-hover);
}

.tag-bar-info {
  padding-left: 0.5rem;
  color: var(--mid-gray);
}

.selected-tag-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.clear-all-btn {
  height: 32px;
  padding-right: 0.5rem;
  background: none;
  border: none;
  color: var(--mid-gray);
  cursor: pointer;
  transition: var(--transition);
}

.clear-all-btn:hover {
  color: var(--dark-gray);
}

/* 文章列表 */
.article-list {
  column-count: 1;
  column-gap: var(--spacing-sm);
  width: 100%;
}
@media (min-width: 768px) {
  .article-list {
    column-count: 2;
  }
}

.article-list a {
  display: block;
  text-decoration: none;
  break-inside: avoid;
  margin-bottom: var(--spacing-sm);
}

/* 分页 */
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  background-color: var(--off-white);
  box-shadow: var(--shadow);
  gap: 0.5rem;
}

.page-btn,
.page-btn-disabled,
.page-btn-active,
.page-input {
  height: 36px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: var(--dark-gray);
  background: var(--white);
  font-size: 14px;
  transition: var(--transition);
}

.page-btn-disabled {
  opacity: 0.5;
}

.page-btn-active,
.page-btn:hover {
  background: var(--main);
  box-shadow: var(--shadow-main);
  color: #fff;
}

.page-btn:hover {
  cursor: pointer;
}

.page-input {
  outline: none;
  padding: 0.5rem;
  width: 40px;
  text-align: center;
}

/* 结果统计 */
.result-stats {
  text-align: center;
  font-size: 0.875rem;
  color: var(--mid-gray);
}
</style>
