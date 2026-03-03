<script lang="ts" setup>
import { computed } from 'vue'
import '@/styles/tag-common.css'
import { TAG_MODE, TAG_MODE_DEFAULT, type TagMode } from '@/constants/tagMode.ts'

// withDefaults 为可选 prop 设置默认值
const props = withDefaults(
  defineProps<{ tags: string[]; modelValue?: string[]; mode?: TagMode }>(),
  {
    mode: TAG_MODE_DEFAULT,
    modelValue: () => [],
  },
)
const emit = defineEmits<{
  (e: 'update:modelValue', tags: string[]): void
  (e: 'clickTag', tags: string): void
}>()

const isSelectMode = computed(() => props.mode === TAG_MODE[0])
const isNavigateMode = computed(() => props.mode === TAG_MODE[1])
const isReadonlyMode = computed(() => props.mode === TAG_MODE[2])

const isSelected = (tag: string) => props.modelValue?.includes(tag)

const handleTagClick = (tag: string) => {
  if (isReadonlyMode.value) return
  if (isSelectMode.value) {
    const currentTags = props.modelValue ? [...props.modelValue] : []
    const index = currentTags.indexOf(tag)
    if (index === -1) {
      currentTags.push(tag)
    } else {
      currentTags.splice(index, 1)
    }
    emit('update:modelValue', currentTags)
  } else if (isNavigateMode.value) {
    emit('clickTag', tag)
  }
}
</script>

<template>
  <div aria-label="标签列表" class="tags" role="list">
    <button
      v-for="tag in tags"
      :key="tag"
      :aria-checked="isSelectMode ? isSelected(tag) : undefined"
      :class="[
        'tag',
        { 'tag-active': isSelectMode && isSelected(tag) },
        { 'tag-readonly': isReadonlyMode },
      ]"
      :role="isSelectMode ? 'checkbox' : 'button'"
      type="button"
      @click.stop.prevent="handleTagClick(tag)"
    >
      {{ tag }}
    </button>
  </div>
</template>

<style scoped></style>
