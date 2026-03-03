---
title: '记录写土豆博客学到的东西TS篇'
date: '2026-03-03'
tags: [ '编程', 'Vue', '前端', 'TypeScript' ]
excerpt: '写博客的时候是边问ai边写的，所以打算记录一下写博客项目时学到的东西，包括markdown转vue组件，文章目录导航组件，组件过渡动画等等'
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
<aside
  v-if="headings.length"
  v-show="shouldShowToc"
  id="toc-panel"
  aria-label="文章目录"
  class="toc"
>
  <div class="toc-header">
    <h3 class="toc-title">目录导航</h3>
  </div>
  <nav class="toc-nav">
    <ul class="toc-list">
      <TocItem
        v-for="heading in headings"
        :key="heading.id"
        :active-id="activeId"
        :heading="heading"
        @click="handleClick"
      />
    </ul>
  </nav>
</aside>
```

#### 扩展：实现窄屏宽屏下目录导航的响应式显示样式

在宽屏下默认显示目录导航栏  
在窄屏下显示目录按钮并默认隐藏目录导航栏，通过按钮点击切换显示

```ts
// 手动切换状态（窄屏下有效）
const isTocVisible = ref(false)

// 监听屏幕宽度变化
const mediaQuery = window.matchMedia('(min-width: 768px)')
// 当前是否为宽屏（>=768px）
const isWideScreen = ref(mediaQuery.matches)
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
```

```html
<!-- 窄屏按钮 -->
<button
  v-if="headings.length"
  :aria-expanded="isTocVisible"
  aria-controls="toc-panel"
  class="show-toc-btn"
  type="button"
  @click="toggleToc"
>
  <span class="btn-text">{{ isTocVisible ? '收起' : '目录' }}</span>
</button>

<!-- 目录导航 -->

<!-- 遮罩层（窄屏） -->
<transition name="toc-slide">
  <div
    v-if="!isWideScreen && isTocVisible"
    class="toc-overlay"
    @click="isTocVisible = !isTocVisible"
  />
</transition>
```

## 标签组件

### 1. 定义标签常量

文章列表页的标签可选中用于过滤筛选，文章详情页的标签点击跳转

```ts
/** 模式：select=可选中(默认)，navigate=点击跳转，readonly=只读 */
export const TAG_MODE = ['select', 'navigate', 'readonly']
export type TagMode = (typeof TAG_MODE)[number]
export const TAG_MODE_DEFAULT = TAG_MODE[0]
```

### 2. 编写标签组件

#### ts

```ts
// 接收标签数组，标签模式和选中的标签数组
// withDefaults 为可选 prop 设置默认值
const props = withDefaults(
  defineProps<{ tags: string[]; modelValue?: string[]; mode?: TagMode }>(),
  {
    mode: TAG_MODE_DEFAULT,
    modelValue: () => [],
  },
)
// 发送更新后的选中标签数组，发送被点击的标签用于跳转
const emit = defineEmits<{
  (e: 'update:modelValue', tags: string[]): void
  (e: 'clickTag', tags: string): void
}>()

const isSelectMode = computed(() => props.mode === TAG_MODE[0])
const isNavigateMode = computed(() => props.mode === TAG_MODE[1])
const isReadonlyMode = computed(() => props.mode === TAG_MODE[2])

const isSelected = (tag: string) => props.modelValue?.includes(tag)

// 标签点击
const handleTagClick = (tag: string) => {
  if (isReadonlyMode.value) return
  if (isSelectMode.value) {
    // 当前选中标签数组
    const currentTags = props.modelValue ? [...props.modelValue] : []
    const index = currentTags.indexOf(tag)
    if (index === -1) {
      currentTags.push(tag)
    } else {
      currentTags.splice(index, 1)
    }
    emit('update:modelValue', currentTags)
  } else if (isNavigateMode.value) {
    emit('clickTag', tag)
  }
}
```

#### vue

```html
<div aria-label="标签列表" class="tags" role="list">
  <button
    v-for="tag in tags"
    :key="tag"
    :aria-checked="isSelectMode ? isSelected(tag) : undefined"
    :class="[
        'tag',
        { 'tag-active': isSelectMode && isSelected(tag) },
        { 'tag-readonly': isReadonlyMode },
      ]"
    :role="isSelectMode ? 'checkbox' : 'button'"
    type="button"
    @click.stop.prevent="handleTagClick(tag)"
  >
    {{ tag }}
  </button>
</div>
```

### 3. 使用示例

选中模式

```html
<TagComponent v-model="selectedTags" :tags="article.tags || []" />
```

跳转模式

```html
<TagComponent
  :mode="TAG_MODE[1]"
  :tags="article.tags || []"
  @click-tag="goToListWithTag"
/>
```

## 修改CSS主题色

就像首页那样

### 1. 编写CSS主题色变量

```css
/* 主色 - 感知均匀的高亮度五色板 */
--teal: oklch(75% 0.18 170);
--pink: oklch(75% 0.17 20);
--purple: oklch(70% 0.16 290);

/* 浅色 - 用于 hover 等状态 */
--teal-light: oklch(85% 0.12 170);
--pink-light: oklch(85% 0.11 20);
--purple-light: oklch(80% 0.10 290);

/* 主色 */
--main: var(--teal);
--main-light: var(--teal-light);
```

### 2. 定义主题色常量

```ts
export const THEMES = ['teal', 'pink', 'purple'] as const
export type Theme = (typeof THEMES)[number]
export const DEFAULT_THEME: Theme = THEMES[0]
```

### 3. 在App.vue中添加主题色修改逻辑

因为`App.vue`是整个vue的根组件，是必须加载的，所以不会因为页面切换后再刷新导致主题色失效

```ts
import { onMounted, provide, ref } from 'vue'
import { DEFAULT_THEME, type Theme, THEMES } from '@/constants/theme.ts'

// 当前使用的主题色
const activeTheme = ref<Theme>(DEFAULT_THEME)

// 应用主题色
const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  root.style.setProperty('--main', `var(--${theme})`)
  root.style.setProperty('--main-light', `var(--${theme}-light)`)
  // 存储在localStorage
  localStorage.setItem('theme', theme)
  activeTheme.value = theme
}

// 通过provide发送给子组件当前使用的主题色以及应用主题色函数
provide('theme', {
  activeTheme,
  setTheme: applyTheme,
})

// 初始化
onMounted(() => {
  const saved = localStorage.getItem('theme') as Theme | null
  if (saved && THEMES.includes(saved)) {
    applyTheme(saved)
  } else {
    applyTheme(DEFAULT_THEME) // 默认并存入 localStorage
  }
})
```

### 4. 修改颜色组件

```ts
import { inject, type Ref } from 'vue'
import { type Theme, THEMES } from '@/constants/theme.ts'

// 通过inject获取当前主题色以及应用主题色函数
const { activeTheme, setTheme } = inject('theme') as {
  activeTheme: Ref<Theme>
  setTheme: (theme: Theme) => void
}
```

```html
<span
  v-for="theme in THEMES"
  :class="[theme, { active: activeTheme === theme }]"
  class="color-dot"
  @click="setTheme(theme)"
/>
```

### 5. 扩展：provide / inject 和defineProps / defineEmits之间的区别

* 前者可以跨越任意层级，无需逐层传递，后者仅限父子组件
* provide / inject对传递的值没有类型限制，所以也可以传递函数

所以总结一下就是父子组件用defineProps，不是父子组件就用provide，有pinia也可以用pinia，需求简单且少的时候可以先用provide