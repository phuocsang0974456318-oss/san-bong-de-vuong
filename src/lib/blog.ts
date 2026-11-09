export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  created_at: string;
};

export type BlogPostDraft = Pick<BlogPost, 'title' | 'excerpt' | 'content'>;
