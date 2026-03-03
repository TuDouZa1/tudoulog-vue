---
title: '记录写土豆博客学到的东西'
date: '2026-03-01'
tags: [ '编程', 'Vue', '前端' ]
excerpt: '记录写博客项目时学到的东西，包括markdown转vue组件，文章目录导航组件，组件过渡动画等等'
coverImage: 'jilu-tudoulog.jpg'
---

## 如何实现读取Markdown并动态生成文章列表

### 1. 安装并配置插件

#### 1.1 安装插件

```bash
pnpm add vite-plugin-vue-markdown -D
```

```bash
pnpm install markdown-it-shiki shiki
```

#### 1.2 配置插件

在 `vite.config.ts` 中引入插件：

```ts
import Markdown from 'vite-plugin-vue-markdown'
import Shiki from 'markdown-it-shiki'

export default defineConfig({
  base: '/tudoulog-vue/',
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/], // 让 Vue 处理 .md 文件
    }),
    vueDevTools(),
    Markdown({
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
      },
      markdownItUses: [
        [Shiki, { theme: 'one-dark-pro' }],
        // 自定义链接渲染器，使外部链接在新标签页中打开
        /* eslint-disable @typescript-eslint/no-explicit-any */
        (md: any) => {
          const defaultRender =
            md.renderer.rules.link_open ||
            ((tokens: any, idx: any, options: any, env: any, self: any) => {
              return self.renderToken(tokens, idx, options)
            })

          md.renderer.rules.link_open = (
            tokens: any,
            idx: any,
            options: any,
            env: any,
            self: any,
          ) => {
            const hrefIndex = tokens[idx].attrIndex('href')
            if (hrefIndex >= 0) {
              const href = tokens[idx].attrs[hrefIndex][1]
              // 判断是否为外部链接（以 http:// 或 https:// 开头）
              if (/^https?:\/\//.test(href)) {
                // 添加 target="_blank" 和 rel="noopener noreferrer"
                tokens[idx].attrSet('target', '_blank')
                tokens[idx].attrSet('rel', 'noopener noreferrer')
              }
            }
            return defaultRender(tokens, idx, options, env, self)
          }
        },
        /* eslint-enable @typescript-eslint/no-explicit-any */
      ],
      frontmatter: true,
      exportFrontmatter: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

引入 `markdown-it` 的 CSS 主题：

```ts
import 'github-markdown-css'
```

### 2. 新建md文档并配置ts动态读取

#### 2.1 新建md文档

可以在一个文件夹比如`articles`文件夹内新建任意名字的md文件并编写：

```md
---
title: Hello World
date: 2026-02-22
tags: [Vue, Markdown, 博客]
excerpt: 这是我的第一篇用 Markdown 写的文章。
---

# 欢迎

这是正文内容，可以直接写 Markdown。
```

其中`---`里是md的yaml配置`(frontmatter)`，定义了meta元数据属性，后续通过ts读取meta数据获取md信息

#### 2.2 articleList.ts

通过`import`导入的md文件 ，插件会处理`frontmatter`属性并生成一个默认导出的vue组件`default`  
同时`vite-plugin-vue-markdown`支持`frontmatter`分离，可以实现只获取md的meta元数据，按需加载组件

```ts
import type { Component } from 'vue'

const baseUrl = import.meta.env.BASE_URL

// 定义对应插件生成类，包含default组件用来显示markdown正文内容
interface MarkdownModule {
  default: Component
  title?: string
  date?: string
  tags?: string[]
  excerpt?: string
  coverImage?: string
}

// 通过import.meta.glob一次性导入所有md文件
// 每个导入的模块会包含所有frontmatter字段和默认导出的default组件
// 使用 eager 会在构建时立即执行
const modules: Record<string, MarkdownModule> = import.meta.glob('@/articles/*.md', { eager: true })

// 生成文章数组
export const articles = Object.entries(modules)
  .map(([path, mod]) => {
    const id = path.split('/').pop()!.replace('.md', '')
    const imgPath = baseUrl + 'img/'
    return {
      id,
      title: mod.title || id,
      date: mod.date || '未知日期',
      tags: mod.tags || [],
      excerpt: mod.excerpt || '',
      coverImage: mod.coverImage ? imgPath + mod.coverImage : '',
      component: mod.default, // 插件转换的vue组件属性
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))
```

#### 2.3 articlePage.vue

现在就可以通过引入articleList获取文章列表信息了

```ts
import { articles } from '@/utils/articleList'
```

#### 2.4 articleDetail.vue

显示markdown正文内容

```ts
import { useRoute } from 'vue-router'
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { type Article, articles } from '@/utils/articleList'

import 'github-markdown-css'

const route = useRoute()
const articleId = route.params.id as string
const article = computed(() => articles.find((a) => a.id === articleId))
```

```vue

<div class="markdown-body">
  <component :is="article.component" v-if="article.component" />
</div>
```

## 如何实现组件的过渡动画

### 1. transition

`transition`为包裹的内容添加进入、离开和列表移动的过渡效果。<br/>
当 `<transition name="xx">` 包裹的内容发生变化时，Vue 会在不同阶段添加/移除以下类名：<br/>
| 类名 | 触发时机 | 作用 |
| :---------------- | :----------------------------------- | :--------------------------------------- |
| `xx-enter-from`   | 元素插入前添加，下一帧移除 | 定义进入的**起始状态**                   |
| `xx-enter-active` | 元素插入前添加，过渡结束后移除 | 定义进入过渡的**持续过程**（时长、曲线） |
| `xx-enter-to`     | 元素插入后下一帧添加，过渡结束后移除 | 定义进入的**结束状态**                   |
| `xx-leave-from`   | 离开触发时添加，下一帧移除 | 定义离开的**起始状态**                   |
| `xx-leave-active` | 离开触发时添加，过渡结束后移除 | 定义离开过渡的**持续过程**               |
| `xx-leave-to`     | 离开触发后下一帧添加，过渡结束后移除 | 定义离开的**结束状态**                   |

### 2. transition-group

`transition-group`用于 v-for 渲染的列表，它会渲染一个真实的容器（通过 tag 指定），并为每个子项添加过渡类名。

* 每个子项必须有唯一的 `key`。
* 可使用 `name` 定义类名前缀。

通过 CSS 实现依次出现（stagger）的两种方式：

* CSS `nth-child`：如 `.list-enter-active:nth-child(1) { transition-delay: 0s; }`，适合静态或数量固定的列表。
* CSS 变量 + 内联 style：`:style="{ '--delay': index * 0.1 + 's' }"`，再在 CSS 中使用 `transition-delay: var(--delay)`
  ，适合动态列表。
* JavaScript 钩子：更灵活，可精确控制每个项的延迟。

### 3. 示例

```html

<router-view v-slot="{ Component }">
  <transition appear mode="out-in" name="page">
    <!--  :key="$route.fullPath" 强制同一组件不同参数时也触发过渡（因为组件被复用）  -->
    <component :is="Component" :key="$route.fullPath" />
  </transition>
</router-view>
```

```css
.page-enter-active, .page-leave-active {
    transition: all 0.3s ease-in-out;
}

.page-enter-from, .page-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
```

**过渡模式`mode`**

`mode="out-in"`：先执行离开动画，完成后执行进入动画（最常用，避免重叠）。

`mode="in-out"`：先执行进入动画，完成后执行离开动画（适用于滑动进入再离开的场景）。

默认：进入和离开同时进行，可能导致布局抖动。

**初始渲染动画`appear`**

默认首次加载不会触发动画。若需要，添加 `appear` 属性  
它会复用 enter 相关的类名，也可单独指定 `appear-class` / `appear-active-class` / `appear-to-class`

## 如何实现页面目录导航

### 1. 定义目录类

```ts
export interface Heading {
  id: string
  title: string
  level: number
  children?: Heading[]
}
```

### 2. 修改文章详情页

给文章正文内容用`ref="contentRef"`包裹，用于获取内部标题标签  
收集文章正文的标题标签并处理到集合中用来目录显示使用  
约定`h2`是每一节的标题`h3`是分段标题，也可以自己修改

```ts
import { computed, nextTick, onMounted, ref } from 'vue'
import type { Heading } from '@/types'
import TocComponent from '@/components/TocComponent.vue'

// 文章内容
const contentRef = ref<HTMLElement | null>(null)
const headings = ref<Heading[]>([])

// 简单的字符串格式化去掉特殊字符
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-') // 空格替换为'-'
    .replace(/[^\w\u4e00-\u9fa5-]/g, '') // 保留中文，字母，数字，连字符
}

onMounted(async () => {
  // 等待 DOM 更新，确保文章已渲染完毕
  await nextTick()

  if (!contentRef.value) return

  // 获取所有h2 h3标签
  const elements = contentRef.value.querySelectorAll('h2, h3')
  // 标题数组
  const items: Heading[] = []

  // 遍历所有h2 h3标签，设置id，title，level属性放入items中
  elements.forEach((element) => {
    const level = element.tagName === 'H2' ? 2 : 3

    // 设置id方便后续根据id页面跳转
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
  // 最近的h2
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
})
```

### 3. TocItem.vue

单个`h2`目录项组件

```ts
import type { Heading } from '@/types'

// 获取目录树和当前激活的id值
defineProps<{
  heading: Heading
  activeId: string
}>()

defineEmits<{
  (e: 'click', id: string): void
}>()
```

```html

<li>
  <!-- h2目录导航链接 -->
  <a
    :class="{ active: activeId === heading.id }"
    :href="'#' + heading.id"
    @click.prevent="$emit('click', heading.id)"
  >
    {{ heading.title }}
  </a>
  <!--  递归渲染h3子节点  -->
  <ul v-if="heading.children && heading.children.length" class="toc-sublist">
    <TocItem
      v-for="h3 in heading.children"
      :key="h3.id"
      :active-id="activeId"
      :heading="h3"
      @click="$emit('click', h3.id)"
    >
    </TocItem>
  </ul>
</li>
```

### 4. Toc.vue

```ts
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
```

```html

<aside v-if="headings.length" class="toc">
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
```

#### 扩展：实现窄屏宽屏下目录导航的响应式显示样式

在宽屏下默认显示目录导航栏  
在窄屏下显示目录按钮并默认隐藏目录导航栏，通过按钮点击切换显示

```ts
// 手动按钮切换状态（窄屏下有效）
const isTocVisible = ref(false)
// 当前是否为宽屏（>=1250px）
const mediaQuery = window.matchMedia('(min-width: 1250px)')
const isWideScreen = ref(mediaQuery.matches)

// 监听屏幕宽度变化
const handleMediaChange = (e: MediaQueryListEvent) => {
  isWideScreen.value = e.matches
}

onMounted(() => {
  mediaQuery.addEventListener('change', handleMediaChange)
})
onUnmounted(() => {
  mediaQuery.removeEventListener('change', handleMediaChange)
})

// 最终显示状态：宽屏始终显示，窄屏由手动按钮切换
const shouldShowToc = computed(() => {
  return isWideScreen.value || isTocVisible.value
})

// 点击按钮切换
const toggleToc = () => {
  isTocVisible.value = !isTocVisible.value
}
```

```html

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
```