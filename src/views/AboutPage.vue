<script lang="ts" setup>

</script>

<template>
  <div class="about-page">
    <div class="about-card">
      <span class="about-title">关于土豆博客</span>
      <div class="about-description">
        项目介绍：一个Vue纯静态个人博客项目
        <br>
        项目地址：
        <a href="https://github.com/TuDouZa1/tudoulog-vue">
          https://github.com/TuDouZa1/tudoulog-vue
        </a>
        <br>
        GitHub：
        <a href="https://github.com/TuDouZa1">https://github.com/TuDouZa1</a>
        <br>
        Gitee：
        <a href="https://gitee.com/tudouza1">https://gitee.com/tudouza1</a>
        <br>
        QQ：1715593110
      </div>
    </div>

    <div class="about-card">
      <span class="about-title">一些软件</span>
      <div class="about-description">
        记录一些好用的软件列表
        <h3>工具软件</h3>
        OBS Studio：录屏直播的开源软件，大家都在用
        <br>
        <a href="https://www.dogfight360.com/blog/18682/">SteamCommunity302</a>
        ：访问被墙网站的工具
        <br>
        傲梅分区助手：管理磁盘简单好用
        <br>
        Motrix：下载工具，但是总感觉Electron框架的工具软件内存占用太大，很少用
        <br>
        Everything：本地文件搜索索引神器，找文件速度很快，内存占用低
        <br>
        WizTree：可视化磁盘占用分析，清理垃圾用
        <br>
        PDFgear：PDF转各种格式
        <br>
        图吧工具箱：工具合集
        <br>
        HiBit Uninstall：卸载工具，能清理卸载残留文件注册表
        <br>
        <a href="https://www.lckp.top/thing/mpvnet_cm/">Mpv.Net</a>
        ：本地播放器，开箱即用，比PotPlayer省事
        <br>
        PixPin：截图软件
        <br>
        UU远程：开箱即用免费远程控制软件
        <h3>开发软件</h3>
        Giant Log Viewer：看大型日志加载搜索速度快
        <br>
        Tiny RDM：可视化Redis管理工具
        <br>
        Win SCP：Windows的远程服务器文件传输管理工具，上传下载很稳定
        <br>
        IShellPro：SSH终端，有一些终端工具，还算可以
        <br>
        IDEA：无需多言
        <br>
        WebStorm：原本只是尝试用一下，感觉比VS Code好用
        <br>
        VS Code：轻量级IDE，需要各种插件实现功能
        <br>
        Sublime Text：高级记事本，编辑配置文件用，内存占用非常低
      </div>
    </div>

    <div class="about-card">
      <span class="about-title">一些废话</span>
      <div class="about-description">
        还没写
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.about-card {
  width: 100%;
  background: var(--off-white);
  color: var(--dark-gray);
  border-radius: 12px;
  padding: 1rem;
  border: var(--border);
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.about-card:hover {
  box-shadow: var(--hover-shadow);
}

.about-card h3 {
  margin: 0;
}

.about-title {
  color: transparent;
  -webkit-text-fill-color: transparent;
  background: linear-gradient(
    135deg,
    var(--pink),
    var(--teal),
    var(--pink)
  );
  background-size: 200% 100%;
  background-repeat: repeat;
  background-clip: text;
  -webkit-background-clip: text;
  animation: subtleFlow 5s linear infinite;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  will-change: background-position;
}

@keyframes subtleFlow {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 100%; /* 移动一个完整周期 */
  }
}
</style>
