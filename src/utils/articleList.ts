import type { Component } from 'vue'

const baseUrl = import.meta.env.BASE_URL

export interface Article {
  id: string // 文件名
  title: string
  date: string
  tags?: string[]
  excerpt?: string // 摘要
  coverImage?: string // 封面图
}

interface MarkdownModule {
  default: Component
  title?: string
  date?: string
  tags?: string[]
  excerpt?: string
  coverImage?: string
}

const modules: Record<string, MarkdownModule> = import.meta.glob('@/articles/*.md', { eager: true })

export const articles = Object.entries(modules)
  .map(([path, mod]) => {
    const id = path.split('/').pop()!.replace('.md', '')
    const imgPath = baseUrl + 'img/'
    console.log('mod:', mod)
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
