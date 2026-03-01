<template>
  <div class="demo-block">
    <div class="demo-title">效果预览</div>
    <slot name="preview"></slot>
  </div>
</template>

<style scoped>
.demo-block {
  border: 1px solid #eaeefb;
  margin: 20px 0;
}
.demo-title {
  font-size: 18px;
  padding: 10px;
  background-color: var(--off-white);
}
</style>
