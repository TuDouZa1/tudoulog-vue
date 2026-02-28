import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Markdown from 'vite-plugin-vue-markdown'
import prism from 'markdown-it-prism'



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
        prism,
        // 自定义链接渲染器，使外部链接在新标签页中打开
        /* eslint-disable @typescript-eslint/no-explicit-any */
        (md: any) => {
          const defaultRender = md.renderer.rules.link_open || ((tokens: any, idx: any, options: any, env: any, self: any) => {
            return self.renderToken(tokens, idx, options)
          })

          md.renderer.rules.link_open = (tokens: any, idx: any, options: any, env: any, self: any) => {
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
        }
        /* eslint-enable @typescript-eslint/no-explicit-any */
      ],
      frontmatter: true,
      exportFrontmatter: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
