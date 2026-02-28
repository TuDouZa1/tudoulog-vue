---
title: '记录写土豆博客学到的东西'
date: '2026-02-25'
tags: [ '编程', 'Vue', '前端' ]
excerpt: ''
coverImage: 'jilu-tudoulog.jpg'
---

## 如何实现读取Markdown并动态生成文章列表

### 1. 安装并配置插件

#### 1.1 安装插件

```bash
pnpm add vite-plugin-vue-markdown -D
```

```bash
pnpm add markdown-it-prism prismjs
```

#### 1.2 配置插件

在 `vite.config.ts` 中引入插件：

```ts
import Markdown from 'vite-plugin-vue-markdown'
import prism from 'markdown-it-prism'

export default defineConfig({
  base: '/tudoulog-vue/',
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/] // 让 Vue 处理 .md 文件
    }),
    vueDevTools(),
    Markdown({
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true
      },
      markdownItUses: [prism],
      frontmatter: true, // 解析 frontmatter
      exposeFrontmatter: true // 将 frontmatter 作为具名导出
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

引入 Markdown 和 Prism 的 CSS 主题：

```ts
import 'github-markdown-css'
import 'prismjs/themes/prism-okaidia.css'
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

通过`import`导入的md文件 ，插件会处理`frontmatter`属性并生成一个默认导出的vue组件`default`<br>
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
import 'prismjs/themes/prism-okaidia.css'
import '@/styles/article-common.css'

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

```vue

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