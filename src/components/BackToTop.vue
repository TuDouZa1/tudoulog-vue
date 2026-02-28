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
    <div v-if="visible" class="back-to-top" title="返回顶部" @click="scrollToTop">
      <span class="arrow">^<br />顶部</span>
    </div>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: 20px;
  bottom: 60px;
  width: 48px;
  height: 48px;
  background-color: var(--off-white);
  backdrop-filter: blur(10px);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: var(--transition);
  z-index: 30;
}

.back-to-top:hover {
  background-color: var(--light-gray);
}

.back-to-top:active {
  transform: translateY(6px);
}

@media (max-width: 800px) {
  .back-to-top {
    right: 20px;
    bottom: 60px; /* 放在目录按钮上方 */
  }
}

.arrow {
  color: var(--dark-gray);
  font-size: 14px;
  font-weight: bold;
  line-height: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
