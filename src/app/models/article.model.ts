/**
 * 📝 Article Models for RealWorld API
 */

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
}

export interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

export interface SingleArticleResponse {
  article: Article;
}

export interface FeedParams {
  limit?: number;
  offset?: number;
  tag?: string;
  author?: string;
  favorited?: string;
}

export interface CreateArticleRequest {
  article: {
    title: string;
    description: string;
    body: string;
    tagList?: string[];
  };
}

export interface UpdateArticleRequest {
  article: {
    title?: string;
    description?: string;
    body?: string;
    tagList?: string[];
  };
}

export interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
}

export interface CommentsResponse {
  comments: Comment[];
}

export interface CommentResponse {
  comment: Comment;
}

export interface CreateCommentRequest {
  comment: {
    body: string;
  };
}
