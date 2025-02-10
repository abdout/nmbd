export interface ArticleItem {
  title: string;
  description: string;
  link: string;
  image: string;
  date: string;
  author: string;
}

export type author = {
  value: string
  label: string
  image?: string
}