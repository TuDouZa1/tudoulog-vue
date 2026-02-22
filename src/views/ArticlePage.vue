<script lang="ts" setup>
import { articles } from '@/utils/articleList'
import { computed, nextTick, ref } from 'vue'

const searchQuery = ref('')

const clearSearch = () => {
  searchQuery.value = ''
  nextTick(() => {
    document.getElementById('search-input')?.focus()
  })
}

// 标签筛选
const selectedTags = ref<string[]>([])
const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}
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
    const matchTags = selectedTags.value.length === 0 ||
      (a.tags && selectedTags.value.every(tag => a.tags.includes(tag)))

    const query = searchQuery.value.trim().toLowerCase()
    const matchSearch = query === '' ||
      a.title.toLowerCase().includes(query) ||
      a.excerpt?.toLowerCase().includes(query) ||
      a.tags?.some(tag => tag.toLowerCase().includes(query))

    return matchTags && matchSearch
  })
})
</script>

<template>
  <div class="article-page">
    <div class="search">
      <input
        id="search-input"
        v-model="searchQuery"
        class="search-input"
        placeholder="搜索文章..."
        type="text"
      />
      <button
        v-if="searchQuery"
        aria-label="清空搜索"
        class="clear-btn"
        @click="clearSearch"
      >
        ✕
      </button>
    </div>
    <div v-if="selectedTags.length > 0" class="tag-bar">
      <div class="selected-tag-container">
      <span v-for="tag in selectedTags" :key="tag">
        <button aria-label="移除标签" class="selected-tag" @click.stop="removeTag(tag)">
        {{ tag }}
        </button>
      </span>
      </div>
      <button aria-label="清除筛选" class="close-tag-bar"
              @click="clearTags">✕
      </button>
    </div>

    <div v-if="filteredArticles.length > 0" class="article-list">
      <router-link v-for="article in filteredArticles" :key="article.id"
                   :to="`/article/${article.id}`" class="article-card">
        <img :src="article.coverImage" alt="文章封面图" class="article-cover" />
        <div class="article-title">{{ article.title }}</div>
        <div class="article-excerpt">{{ article.excerpt }}</div>
        <time class="article-time">{{ article.date }}</time>
        <div class="tags">
          <span v-for="tag in article.tags"
                :key="tag"
                :class="{'tag-active': selectedTags.includes(tag)}"
                class="tag"
                @click.stop.prevent="toggleTag(tag)"
          >
            {{ tag }}
          </span>
        </div>
      </router-link>
    </div>
    <div v-else class="article-empty">
      <h1>暂无文章</h1>
    </div>
  </div>
</template>

<style scoped>
.article-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1rem;
}

.article-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
}

.article-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--dark-gray);
  padding: 2rem;
}

.article-empty h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: var(--dark-gray);
}

.article-card {
  text-decoration: none;
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  background-color: var(--off-white);
  box-shadow: var(--shadow);
  border: 1px solid var(--light-gray);
  overflow: hidden;
  transition: var(--transition);
}

.article-card:hover, .tag-bar:hover, .search:hover {
  box-shadow: var(--hover-shadow);
}

.article-cover {
  width: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
}

.article-title {
  color: var(--dark-gray);
  font-size: 28px;
  font-weight: 700;
}

.article-excerpt {
  color: var(--dark-gray);
  font-size: 18px;
}

.article-time {
  color: var(--mid-gray);
  font-size: 12px;
  font-weight: 800;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background: var(--off-white);
  border: 2px solid var(--light-gray);
  border-radius: 8px;
  color: var(--dark-gray);
  font-size: 12px;
  padding: 0.25rem 0.5rem;
  font-weight: bold;
  transition: var(--transition);
}

.tag:hover, .tag-active {
  background: var(--light-gray);
}

.tag-active:hover, .selected-tag:hover {
  background: var(--mid-gray);
  cursor: pointer;
  color: var(--light-gray);
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

.selected-tag-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.selected-tag {
  height: 32px;
  background: var(--light-gray);
  border: 2px solid var(--light-gray);
  border-radius: 8px;
  color: var(--dark-gray);
  font-size: 14px;
  padding: 0.25rem 0.5rem;
  font-weight: bold;
  transition: var(--transition);
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

.close-tag-bar:hover {
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
  background: #fff;
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

.clear-btn:hover {
  color: var(--dark-gray);
}
</style>
