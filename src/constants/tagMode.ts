/** 模式：select=可选中，navigate=点击跳转，readonly=只读 */
export const TAG_MODE = ['select', 'navigate', 'readonly']
export type TagMode = (typeof TAG_MODE)[number]
export const TAG_MODE_DEFAULT = TAG_MODE[0]
