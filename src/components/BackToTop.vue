<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

const visible = ref(false)
let scrollHandler: (() => void) | null = null

// 检查滚动位置
const checkScroll = () => {
  visible.value = window.scrollY > 300
}

// 平滑滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

// 节流函数，定时器版
// 定义一个泛型函数，T 是原函数类型，约束为接受任意参数且返回 void（常用于事件处理）
function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: number | undefined

  return function (this: unknown, ...args: Parameters<T>) {
    if (timer !== undefined) return

    timer = window.setTimeout(() => {
      fn.apply(this, args)
      timer = undefined
    }, delay)
  }
}

onMounted(() => {
  // 初始检查
  checkScroll()
  // 使用节流后的滚动监听，避免频繁计算
  scrollHandler = throttle(checkScroll, 100) as () => void
  window.addEventListener('scroll', scrollHandler, { passive: true })
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})
</script>

<template>
  <Transition name="fade">
    <div
      v-if="visible"
      aria-label="返回顶部"
      class="back-to-top"
      title="返回顶部"
      @click="scrollToTop"
    >
      <svg
        aria-hidden="true"
        class="arrow-icon"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
      <span class="btn-text">顶部</span>
    </div>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: 20px;
  bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: var(--off-white);
  backdrop-filter: blur(10px);
  color: var(--dark-gray);
  border: var(--border);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: var(--transition);
  z-index: 30;
}

.back-to-top:hover {
  background-color: var(--light-gray);
  transform: translateY(-2px);
}

.back-to-top:active {
  transform: translateY(0);
}

@media (max-width: 800px) {
  .back-to-top {
    right: 20px;
    bottom: 50px;
  }
}

.arrow-icon {
  width: 16px;
  height: 16px;
}

.btn-text {
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 2px;
}

.fade-enter-active,
.fade-leave-active {
  transition: var(--transition);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
