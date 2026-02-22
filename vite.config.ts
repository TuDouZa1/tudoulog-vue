import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Markdown from 'vite-plugin-vue-markdown'
import prism from 'markdown-it-prism' // 改用 import 导入

export default defineConfig({
  base: '/TuDouLog/',
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
      frontmatter: true,
      exposeFrontmatter: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
