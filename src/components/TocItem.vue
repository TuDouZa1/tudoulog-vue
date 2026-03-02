<script lang="ts" setup>
import type { Heading } from '@/types'

defineProps<{
  heading: Heading
  activeId: string
}>()

defineEmits<{
  (e: 'click', id: string): void
}>()
</script>

<template>
  <li>
    <a
      :class="{ active: activeId === heading.id }"
      :href="'#' + heading.id"
      @click.prevent="$emit('click', heading.id)"
    >
      {{ heading.title }}
    </a>
    <!--  递归渲染h3子节点  -->
    <ul v-if="heading.children && heading.children.length" class="toc-sublist">
      <TocItem
        v-for="h3 in heading.children"
        :key="h3.id"
        :active-id="activeId"
        :heading="h3"
        @click="$emit('click', h3.id)"
      >
      </TocItem>
    </ul>
  </li>
</template>

<style scoped>
li {
  margin: 0.25rem 0;
}
a {
  display: block;
  padding: 0.375rem 0.5rem;
  color: var(--dark-gray);
  border-radius: var(--border-radius-sm);
  text-decoration: none;
  font-size: 0.875rem;
  line-height: 1.4;
  transition: var(--transition-fast);
  border-left: 4px solid transparent;
}
a:hover {
  background: var(--off-white);
  border-left-color: var(--light-gray);
}
a.active {
  background: var(--main) !important;
  color: #fff !important;
  font-weight: 500;
  border-left-color: var(--main-light) !important;
}
.toc-sublist {
  padding-left: 0.75rem;
  list-style: none;
  margin: 0;
}

.toc-sublist a {
  font-size: 0.8125rem;
  padding: 0.25rem 0.5rem;
}
</style>
