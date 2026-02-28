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
