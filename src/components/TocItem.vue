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
  padding: 0.2rem 0.5rem;
  color: var(--dark-gray);
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: var(--transition);
}
a:hover {
  background: var(--light-gray);
}
a.active {
  background: var(--teal);
  color: white;
  font-weight: 500;
}
.toc-sublist {
  padding-left: 1rem;
  list-style: none;
}
</style>
