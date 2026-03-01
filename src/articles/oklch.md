---
title: 'OKLCH色彩'
date: '2026-03-01'
tags: [ '编程', '前端', 'UI' ]
excerpt: 'oklch() 基于 Oklab 色彩空间，是 CSS 颜色表示的重大进步，它让颜色的亮度、色度、色相在感知上解耦，极大简化了动态配色、渐变生成和暗色主题的实现。'
coverImage: 'oklch_cover.png'
---

## 资源推荐

[OKLCH 颜色选择器](https://oklch.net/zh-CN#0.7,0.1,180,100)

## 为什么选择OKLCH色彩

oklch 是 CSS 颜色表示的重大进步，它让颜色的亮度、色度、色相在感知上解耦，极大简化了动态配色、渐变生成和暗色主题的实现。  
总之很先进用解决了以前配色的各种问题，就完事了，不用担心兼容性问题，有简单的解决方法。  
这里主要讲用法

## `oklch()` 语法

```text
oklch(L C H [ / A])
```

L（亮度）：取值范围 0% ~ 100%，或数值 0 ~ 1。0% 为纯黑，100% 为纯白。

C（色度）：无单位数值，理论无上限，但实际显示器色域内通常不超过 0.4（约 0.37 为 sRGB 色域边界）。数值越大颜色越鲜艳。

H（色相）：角度值 0deg ~ 360deg，0deg 对应红色，90deg 对应黄色，180deg 对应绿色，270deg 对应蓝色。

A（透明度）：可选，0 ~ 1 或百分比，默认为 1。

### 演示

```css
.color-example {
    background-color: oklch(50% 0.2 200deg); /* 带角度的蓝绿色 */
    color: oklch(80% 0.15 30deg / 0.8); /* 半透明暖橙 */
}
```

<DemoPreview>
<template #preview>
<div style="background-color: oklch(50% 0.2 200deg);color: oklch(80% 0.15 30deg / 0.8);">
你好
</div>
</template>
</DemoPreview>