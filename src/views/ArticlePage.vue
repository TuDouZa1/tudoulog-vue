<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { articles } from '@/utils/articleList'
import CardComponent from '@/components/CardComponent.vue'
import TagComponent from '@/components/TagComponent.vue'
import '@/styles/article-common.css'
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
      <input
        id="search-input"
        v-model="searchQuery"
        class="search-input"
        placeholder="搜索文章..."
        type="text"
      />
      <button v-if="searchQuery" aria-label="清空搜索" class="clear-btn" @click="clearSearch">
        ✕
      </button>
    </div>
    <!--  标签筛选  -->
    <transition name="tag-bar-transition">
      <div v-if="selectedTags.length > 0" class="tag-bar">
        <div class="selected-tag-container">
          <span v-for="tag in selectedTags" :key="tag">
            <button aria-label="移除标签" class="selected-tag" @click.stop="removeTag(tag)">
              {{ tag }}
            </button>
          </span>
        </div>
        <button aria-label="清除筛选" class="close-tag-bar" @click="clearTags">✕</button>
      </div>
    </transition>

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
    <div v-if="filteredArticles.length > 0 && totalPages > 1" class="page">
      <button
        :class="currentPage === 1 ? 'page-btn-disabled' : 'page-btn'"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        上一页
      </button>
      <button
        v-for="(item, index) in showPageBtn"
        :key="index"
        :class="item === currentPage ? 'page-btn-active' : 'page-btn'"
        class="page-btn"
        @click="currentPage = item"
      >
        {{ item }}
      </button>
      <button
        :class="currentPage === totalPages ? 'page-btn-disabled' : 'page-btn'"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        下一页
      </button>
      <!--   页面输入回车跳转   -->
      <input
        v-if="totalPages > 3"
        v-model="inputPageNum"
        class="page-input"
        inputmode="numeric"
        placeholder="Go"
        type="text"
        @keyup.enter="changePage"
      />
    </div>
  </div>
</template>

<style scoped>
.article-list {
  column-count: 1;
  column-gap: 0.5rem;
  width: 100%;
}
@media (min-width: 576px) {
  .article-list {
    column-count: 2;
  }
}
.article-list a {
  display: block;
  text-decoration: none;
}

.tag-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 12px;
  background-color: var(--off-white);
  box-shadow: var(--shadow);
  border: 1px solid var(--light-gray);
  transition: var(--transition);
}
.tag-bar-transition-enter-active,
.tag-bar-transition-leave-active {
  transition: var(--transition);
}
.tag-bar-transition-enter-from,
.tag-bar-transition-leave-to {
  opacity: 0;
  transform: translateX(-20%);
}

.selected-tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selected-tag {
  height: 32px;
  background: var(--light-gray);
  border: 2px solid var(--light-gray);
  border-radius: 8px;
  color: var(--dark-gray);
  font-size: 12px;
  padding: 0.25rem 0.5rem;
  font-weight: bold;
  transition: var(--transition);
}

.selected-tag:hover {
  background: var(--mid-gray);
  cursor: pointer;
  color: var(--light-gray);
}

.close-tag-bar {
  background: none;
  border: none;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  color: var(--mid-gray);
  padding: 0 0.2rem;
  transition: var(--transition);
}

.close-tag-bar:hover,
.clear-btn:hover {
  color: var(--dark-gray);
}

.search {
  position: relative;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  background: var(--off-white);
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow);
  border: 1px solid var(--light-gray);
  transition: var(--transition);
}

.search-input {
  border: none;
  outline: none;
  flex: 1;
  background: var(--white);
  border-radius: 8px;
  padding: 0.5rem 2rem 0.5rem 0.5rem;
  color: var(--dark-gray);
}

.search-input:focus {
  border: none;
  outline: none;
}

.clear-btn {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  line-height: 1;
  cursor: pointer;
  color: var(--mid-gray);
  padding: 0.2rem 0.5rem;
  transition: var(--transition);
}

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
  background: var(--teal);
  box-shadow: var(--shadow-teal);
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
</style>
