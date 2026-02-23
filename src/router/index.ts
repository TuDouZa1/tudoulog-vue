import { createRouter, createWebHistory } from 'vue-router'
import { articles } from '@/utils/articleList.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'AppLayout',
      component: () => import('@/components/layout/AppLayout.vue'),
      children: [
        {
          path: '',
          name: 'HomePage',
          component: () => import('@/views/HomePage.vue'),
          meta: { title: '首页-土豆博客' },
        },
        {
          path: 'article',
          name: 'ArticlePage',
          component: () => import('@/views/ArticlePage.vue'),
          meta: { title: '文章列表-土豆博客' },
        },
        {
          path: 'article/:id',
          name: 'ArticleDetail',
          component: () => import('@/views/ArticleDetail.vue'),
          beforeEnter: (to) => {
            if (!articles.find((a) => a.id === to.params.id)) {
              return { name: 'NotFound' }
            }
          },
        },
        {
          path: 'about',
          name: 'AboutPage',
          component: () => import('@/views/AboutPage.vue'),
          meta: { title: '关于-土豆博客' },
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'NotFound',
          component: () => import('@/views/NotFoundPage.vue'),
        },
      ],
    },
  ],
})

// 全局后置守卫：路由切换完成后修改标题
router.afterEach((to) => {
  // 如果路由元信息中有 title，则设置；否则使用默认标题
  document.title = (to.meta.title as string) || '土豆博客'
})

export default router
