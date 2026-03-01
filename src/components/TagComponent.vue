<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ tags: string[]; modelValue?: string[]; mode?: 'select' | 'navigate' }>(),
  {
    mode: 'select',
    modelValue: () => [],
  },
)
const emit = defineEmits<{
  (e: 'update:modelValue', tags: string[]): void
  (e: 'clickTag', tags: string): void
}>()
const isSelectMode = computed(() => props.mode === 'select')

const handleTagClick = (tag: string) => {
  if (isSelectMode.value) {
    const currentSelectedTags = props.modelValue ? [...props.modelValue] : []
    const index = currentSelectedTags.indexOf(tag)
    if (index === -1) {
      currentSelectedTags.push(tag)
    } else {
      currentSelectedTags.splice(index, 1)
    }
    emit('update:modelValue', currentSelectedTags)
  } else {
    emit('clickTag', tag)
  }
}
</script>

<template>
  <div class="tags">
    <span
      v-for="tag in tags"
      :key="tag"
      :class="{ 'tag-active': modelValue?.includes(tag) }"
      class="tag"
      @click.stop.prevent="handleTagClick(tag)"
    >
      {{ tag }}
    </span>
  </div>
</template>

<style scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag {
  cursor: pointer;
  background: var(--off-white);
  border: 2px solid var(--light-gray);
  border-radius: 8px;
  color: var(--dark-gray);
  font-size: 12px;
  padding: 0.25rem 0.5rem;
  font-weight: bold;
  transition: var(--transition);
  backdrop-filter: blur(20px);
}

.tag:hover,
.tag-active {
  background: var(--light-gray);
}

.tag-active:hover {
  background: var(--mid-gray);
  cursor: pointer;
  color: var(--light-gray);
}

.selected-tag {
  height: 32px;
  background: var(--light-gray);
  border: 2px solid var(--light-gray);
  border-radius: 8px;
  color: var(--dark-gray);
  font-size: 12px;
  padding: 0.25rem 0.5rem;
  font-weight: bold;
  transition: var(--transition);
}

.selected-tag:hover {
  background: var(--mid-gray);
  cursor: pointer;
  color: var(--light-gray);
}
</style>
