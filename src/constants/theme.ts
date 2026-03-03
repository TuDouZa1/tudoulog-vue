export const THEMES = ['teal', 'pink', 'purple'] as const
export type Theme = (typeof THEMES)[number]
export const DEFAULT_THEME: Theme = THEMES[0]
