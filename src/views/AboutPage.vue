<script lang="ts" setup>
interface SoftwareItem {
  name: string
  description: string
  link?: string
}

interface SoftwareCategory {
  title: string
  items: SoftwareItem[]
}

const toolSoftware: SoftwareCategory = {
  title: '工具软件',
  items: [
    { name: 'OBS Studio', description: '录屏直播的开源软件，大家都在用' },
    {
      name: 'SteamCommunity302',
      description: '不需要加速器，修改host访问Steam和被墙网站的工具',
      link: 'https://www.dogfight360.com/blog/18682/',
    },
    { name: '傲梅分区助手', description: '管理磁盘简单好用' },
    { name: 'Motrix', description: '下载工具（Electron框架，内存占用较大）' },
    { name: 'Everything', description: '本地文件搜索索引神器，找文件速度很快' },
    { name: 'WizTree', description: '可视化磁盘占用分析，清理垃圾用' },
    { name: 'PDFgear', description: 'PDF转各种格式' },
    { name: '图吧工具箱', description: '工具合集' },
    { name: 'HiBit Uninstall', description: '卸载工具，能清理卸载残留文件注册表' },
    {
      name: 'Mpv.Net',
      description: '本地播放器，开箱即用',
      link: 'https://www.lckp.top/thing/mpvnet_cm/',
    },
    { name: 'PixPin', description: '截图软件' },
    { name: 'UU远程', description: '开箱即用免费远程控制软件' },
  ],
}

const devSoftware: SoftwareCategory = {
  title: '开发软件',
  items: [
    {
      name: 'glogg',
      description: '看大型日志加载搜索速度快',
      link: 'https://glogg.bonnefon.org/',
    },
    { name: 'Tiny RDM', description: '可视化Redis管理工具' },
    { name: 'WinSCP', description: 'Windows的远程服务器文件传输管理工具' },
    { name: 'IShellPro', description: '专注于SSH的终端工具，多平台原生性能好' },
    { name: 'IDEA', description: 'JetBrains旗舰IDE，无需多言' },
    { name: 'WebStorm', description: '前端开发IDE，功能强大' },
    { name: 'VS Code', description: '轻量级IDE，需要各种插件实现功能' },
    { name: 'Sublime Text', description: '高级记事本，编辑配置文件用，内存占用非常低' },
  ],
}

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/TuDouZa1',
    icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
  },
  {
    name: 'Gitee',
    url: 'https://gitee.com/tudouza1',
    icon: 'M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.593.593v1.778a.593.593 0 0 1-.593.593H9.778a.593.593 0 0 1-.593-.593V5.926c0-.327.266-.593.593-.593h8.296zm0 4.444c.328 0 .593.266.593.593v1.778a.593.593 0 0 1-.593.593H9.778a.593.593 0 0 1-.593-.593V10.37c0-.327.266-.593.593-.593h8.296zm-4.148 4.445c.328 0 .593.266.593.593v1.777a.593.593 0 0 1-.593.593H5.63a.593.593 0 0 1-.593-.593v-1.777c0-.328.266-.594.593-.594h8.296z',
  },
]
</script>

<template>
  <transition-group appear class="about-page" name="list" tag="div">
    <!-- 关于博客 -->
    <section key="1" aria-labelledby="about-title" class="about-card">
      <h2 id="about-title" class="about-title">
        <span class="cool-title">关于土豆博客</span>
      </h2>
      <div class="about-content">
        <p class="intro">一个使用 Vue 3 + TypeScript + Vite 构建的纯静态个人博客项目</p>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">项目地址</span>
            <a
              class="info-link"
              href="https://github.com/TuDouZa1/tudoulog-vue"
              rel="noopener noreferrer"
              target="_blank"
            >
              github.com/TuDouZa1/tudoulog-vue
            </a>
          </div>
          <div class="info-item">
            <span class="info-label">联系方式</span>
            <span class="info-value">QQ: 1715593110</span>
          </div>
        </div>

        <div class="social-links">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :aria-label="link.name"
            :href="link.url"
            class="social-link"
            rel="noopener noreferrer"
            target="_blank"
          >
            <svg class="social-icon" fill="currentColor" viewBox="0 0 24 24">
              <path :d="link.icon" />
            </svg>
            {{ link.name }}
          </a>
        </div>
      </div>
    </section>

    <!-- 软件列表 -->
    <section key="2" aria-labelledby="software-title" class="about-card">
      <h2 id="software-title" class="about-title">
        <span class="cool-title">软件列表</span>
      </h2>
      <p class="section-desc">记录一些好用的软件列表</p>
      <div class="software-sections">
        <div
          v-for="category in [toolSoftware, devSoftware]"
          :key="category.title"
          class="software-category"
        >
          <h3 class="category-title">{{ category.title }}</h3>
          <ul class="software-list">
            <li v-for="item in category.items" :key="item.name" class="software-item">
              <span class="software-name">
                <a
                  v-if="item.link"
                  :href="item.link"
                  class="software-link"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {{ item.name }}
                </a>
                <template v-else>{{ item.name }}</template>
              </span>
              <span class="software-desc">{{ item.description }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </transition-group>
</template>

<style scoped>
.about-page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-width: 800px;
  margin: 0 auto;
}

.about-card {
  background: var(--off-white);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  border: var(--border);
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.about-card:hover {
  box-shadow: var(--shadow-hover);
}

.about-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 var(--spacing) 0;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing);
}

.intro {
  font-size: 1rem;
  color: var(--dark-gray);
  margin: 0;
}

.info-grid {
  display: grid;
  gap: var(--spacing-sm);
}

.info-item {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  align-items: center;
}

.info-label {
  font-weight: 600;
  color: var(--dark-gray);
  min-width: 80px;
}

.info-link {
  color: var(--main);
  word-break: break-all;
}

.info-link:hover {
  text-decoration: underline;
}

.info-value {
  color: var(--mid-gray);
}

.social-links {
  display: flex;
  gap: var(--spacing-sm);
}

.social-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 0.5rem 1rem;
  background: var(--white);
  border: var(--border);
  border-radius: var(--border-radius-sm);
  color: var(--dark-gray);
  font-weight: 500;
  transition: var(--transition-fast);
}

.social-link:hover {
  background: var(--main);
  color: #fff;
  border-color: var(--main);
}

.social-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.section-desc {
  color: var(--mid-gray);
  margin: calc(-1 * var(--spacing-sm)) 0 var(--spacing) 0;
}

.software-sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.category-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--dark-gray);
  margin: 0 0 var(--spacing-sm) 0;
  padding-bottom: var(--spacing-xs);
  border-bottom: 2px solid var(--main);
  display: inline-block;
}

.software-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.software-item {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs) var(--spacing-sm);
  align-items: baseline;
}

.software-name {
  font-weight: 600;
  color: var(--dark-gray);
}

.software-link {
  color: var(--main);
}

.software-link:hover {
  text-decoration: underline;
}

.software-desc {
  color: var(--mid-gray);
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .about-card {
    padding: var(--spacing);
  }

  .software-item {
    flex-direction: column;
    gap: 0;
  }
}

.list-enter-active:nth-child(1) {
  transition-delay: 0s;
}

.list-enter-active:nth-child(2) {
  transition-delay: 0.1s;
}
</style>
