const baseUrl = import.meta.env.BASE_URL

export interface Article {
  id: string // 文件名
  title: string
  date: string
  tags?: string[]
  excerpt?: string // 摘要
  coverImage?: string // 封面图
}

const modules = import.meta.glob('@/articles/*.md', { eager: true })

export const articles = Object.entries(modules)
  .map(([path, mod]) => {
    const id = path.split('/').pop()!.replace('.md', '')
    const imgPath = baseUrl + 'img/'
    const article = mod as Article
    console.log('mod:', mod)
    return {
      id,
      title: article.title || id,
      date: article.date || '未知日期',
      tags: article.tags || [],
      excerpt: article.excerpt || '',
      coverImage: article.coverImage ? imgPath + article.coverImage : '',
      component: (mod as any).default, // 插件转换的vue组件属性
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))
