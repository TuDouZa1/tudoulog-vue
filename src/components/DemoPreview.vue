<script lang="ts" setup></script>
<template>
  <figure class="demo-block">
    <div class="demo-title">效果预览</div>
    <slot name="preview" />
  </figure>
</template>

<style scoped>
.demo-block {
  margin: var(--spacing-lg) 0;
  border: var(--border);
  border-radius: 6px;
  overflow: hidden;
  background: var(--off-white);
}

.demo-title {
  font-size: 0.875rem;
  font-weight: 600;
  padding: var(--spacing-sm) var(--spacing);
  background: var(--off-white);
  color: var(--dark-gray);
  border-bottom: var(--border);
}
</style>
