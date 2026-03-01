export interface Heading {
  id: string
  title: string
  level: number
  children?: Heading[]
}

export interface Card {
  id: string
  title: string
  coverImage?: string
  excerpt?: string
  date?: string
  tags?: string[]
}
