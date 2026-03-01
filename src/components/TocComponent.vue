<script lang="ts" setup>
import type { Heading } from '@/types'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import TocItem from '@/components/TocItem.vue'

const props = defineProps<{ headings: Heading[] }>()

const activeId = ref('')
// 缓存标题的 offsetTop，也就是和最顶部元素的距离
const headingOffsets = ref<{ id: string; top: number }[]>([])

// 屏幕大小变化后，更新缓存（需要确保 DOM 已渲染）
const updateOffsets = () => {
  const offsets: { id: string; top: number }[] = []
  props.headings.forEach((h) => {
    const el = document.getElementById(h.id)
    if (el) offsets.push({ id: h.id, top: el.offsetTop })
    h.children?.forEach((child) => {
      const childEl = document.getElementById(child.id)
      if (childEl) offsets.push({ id: child.id, top: childEl.offsetTop })
    })
  })
  // 按 top 值排序（确保顺序正确）
  offsets.sort((a, b) => a.top - b.top)
  console.log('offsets', offsets)
  headingOffsets.value = offsets
}

// 页面滚动后计算激活的id值
const handleScroll = () => {
  const scrollY = window.scrollY + 80 // 偏移量 80px，让高亮提前一点
  const offsets = headingOffsets.value
  if (!offsets.length) return

  // 从后往前找最后一个 top <= scrollY 的标题
  let active = offsets[0]!.id
  for (let i = offsets.length - 1; i >= 0; i--) {
    if (offsets[i]!.top <= scrollY) {
      active = offsets[i]!.id
      break
    }
  }
  activeId.value = active
}

// 监听滚动
let scrollHandler: (() => void) | null = null

onMounted(() => {
  // 等待 DOM 更新后首次计算偏移量
  nextTick(() => {
    updateOffsets()
    handleScroll() // 初始化高亮
  })

  scrollHandler = () => handleScroll()
  window.addEventListener('scroll', scrollHandler, { passive: true })
  window.addEventListener('resize', updateOffsets) // 窗口大小改变时重新计算
})

onUnmounted(() => {
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
  window.removeEventListener('resize', updateOffsets)
})

// 如果 headings 发生变化（比如切换文章），重新计算
watch(
  () => props.headings,
  () => {
    nextTick(() => {
      updateOffsets()
      handleScroll()
    })
  },
)

// 定义点击处理函数
const handleClick = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    if (!isWideScreen.value) {
      toggleToc()
    }
  }
}

// 目录和按钮显示
// 手动切换状态（窄屏下有效）
const isTocVisible = ref(false)
// 当前是否为宽屏（>=1250px）
const isWideScreen = ref(window.matchMedia('(min-width: 1250px)').matches)

// 监听屏幕宽度变化
const mediaQuery = window.matchMedia('(min-width: 1250px)')
const handleMediaChange = (e: MediaQueryListEvent) => {
  isWideScreen.value = e.matches
}

onMounted(() => {
  mediaQuery.addEventListener('change', handleMediaChange)
})
onUnmounted(() => {
  mediaQuery.removeEventListener('change', handleMediaChange)
})

// 最终显示状态：宽屏始终显示，窄屏由手动切换决定
const shouldShowToc = computed(() => {
  return isWideScreen.value || isTocVisible.value
})

// 点击按钮切换
const toggleToc = () => {
  isTocVisible.value = !isTocVisible.value
}
</script>

<template>
  <div class="show-toc-btn" @click="toggleToc">{{ isTocVisible ? '收起' : '目录' }}</div>
  <transition name="fade">
    <aside v-if="headings.length" v-show="shouldShowToc" class="toc">
      <div class="toc-title">目录导航</div>
      <ul class="toc-list">
        <TocItem
          v-for="heading in headings"
          :key="heading.id"
          :active-id="activeId"
          :heading="heading"
          @click="handleClick"
        />
      </ul>
    </aside>
  </transition>
</template>

<style scoped>
.show-toc-btn {
  position: fixed;
  right: 20px;
  bottom: 0;
  background: var(--teal);
  color: #fff;
  padding: 0.5rem;
  font-weight: bold;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: var(--transition);
  z-index: 20;
}
.show-toc-btn:hover {
  cursor: pointer;
  background: var(--teal);
  box-shadow: var(--shadow-teal);
}
.show-toc-btn:active {
  transform: translateY(10px);
}

.toc {
  position: sticky;
  top: 10px;
  max-height: calc(100vh - 120px);
  width: 300px;
  align-self: flex-start;
  background: var(--md-background);
  padding: 1rem;
  overflow-y: auto;
  z-index: 10;
}

.toc-title {
  padding: 0 0.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--teal);
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

@media (min-width: 1250px) {
  .show-toc-btn {
    display: none;
  }
}

@media (width < 800px) {
  .toc {
    width: 100%;
    max-height: 50%;
    height: 50%;
    position: fixed;
    left: 0;
    top: auto;
    bottom: 0;
    box-shadow: var(--shadow-lg);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: var(--transition);
  }

  .fade-enter-from,
  .fade-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }
}
</style>
