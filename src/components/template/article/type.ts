export interface ArticleItem {
  title: string;
  description: string;
  link: string;
  image: string;
  date: string;
  author: string;
  videoId?: string;
}

export type author = {
  value: string
  label: string
  image?: string
}

export interface Article {
  _id?: string;
  title: string;
  desc: string;
  body: string;
  image: string;
  author: string;
  slug: string;
  catSlug: string;
  updatedAt: string;
}

export interface ArticleContextProps {
  article: Article | null;
  articles: Article[];
  fetchArticle: (slug: string) => void;
  fetchArticles: () => void;
  refreshArticles: () => void;
  recentArticles: () => void;
  deleteArticle: (id: string) => void;

}