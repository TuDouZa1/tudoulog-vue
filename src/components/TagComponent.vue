<script lang="ts" setup>
import { computed } from 'vue'
import '@/styles/tag-common.css'

/** 模式：select=可选中，navigate=点击跳转，readonly=只读 */
type TagMode = 'select' | 'navigate' | 'readonly'

const props = withDefaults(
  defineProps<{ tags: string[]; modelValue?: string[]; mode?: TagMode }>(),
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
const isNavigateMode = computed(() => props.mode === 'navigate')
const isReadonlyMode = computed(() => props.mode === 'readonly')

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
