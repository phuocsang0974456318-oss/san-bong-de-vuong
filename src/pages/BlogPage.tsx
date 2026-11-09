import { ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { BlogPost } from '../lib/blog';
import { getSupabaseSetupMessage, supabase } from '../lib/supabase';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(new Date(value));
}

export default function BlogPage() {
  const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setPost(null);

    if (!supabase) {
      setError(getSupabaseSetupMessage());
      setLoading(false);
      return () => { active = false; };
    }
    const client = supabase;

    const loadPosts = async () => {
      if (id) {
        const { data, error: loadError } = await client
          .from('blog_posts')
          .select('id, title, excerpt, content, created_at')
          .eq('id', id)
          .maybeSingle();

        if (!active) return;
        if (loadError) setError(`Không tải được bài viết: ${loadError.message}`);
        else if (data) setPost(data as BlogPost);
      } else {
        const { data, error: loadError } = await client
          .from('blog_posts')
          .select('id, title, excerpt, content, created_at')
          .order('created_at', { ascending: false });

        if (!active) return;
        if (loadError) setError(`Không tải được danh sách bài viết: ${loadError.message}`);
        else setPosts((data ?? []) as BlogPost[]);
      }

      if (active) setLoading(false);
    };

    void loadPosts();
    return () => { active = false; };
  }, [id]);

  return (
    <section className="blog-page">
      {id ? (
        <div className="blog-article">
          <Link className="blog-back-link" to="/blog"><ArrowLeft size={17} aria-hidden="true" /> Tất cả bài viết</Link>
          {loading && <p className="blog-state">Đang tải bài viết...</p>}
          {error && <p className="blog-state blog-state--error" role="alert">{error}</p>}
          {!loading && !error && !post && <p className="blog-state">Không tìm thấy bài viết này.</p>}
          {post && (
            <article>
              <span className="section-heading__eyebrow">BLOG Sân bóng Đế Vương</span>
              <h1>{post.title}</h1>
              <p className="blog-article__date"><CalendarDays size={16} aria-hidden="true" /> {formatDate(post.created_at)}</p>
              <p className="blog-article__excerpt">{post.excerpt}</p>
              <div className="blog-article__content">{post.content}</div>
            </article>
          )}
        </div>
      ) : (
        <div className="blog-list">
          <div className="section-heading">
            <span className="section-heading__eyebrow">BLOG Sân bóng Đế Vương</span>
            <h1>Bài viết mới nhất</h1>
            <p>Cập nhật tin tức, mẹo chơi bóng và những câu chuyện quanh sân cỏ.</p>
          </div>
          {loading && <p className="blog-state">Đang tải bài viết...</p>}
          {error && <p className="blog-state blog-state--error" role="alert">{error}</p>}
          {!loading && !error && !posts.length && <p className="blog-state">Chưa có bài viết. Nội dung mới sẽ được cập nhật sớm.</p>}
          {!!posts.length && (
            <div className="blog-grid">
              {posts.map((item) => (
                <article className="blog-card" key={item.id}>
                  <span className="blog-card__date"><CalendarDays size={15} aria-hidden="true" /> {formatDate(item.created_at)}</span>
                  <h2>{item.title}</h2>
                  <p>{item.excerpt}</p>
                  <Link to={`/blog/${item.id}`}>Đọc bài viết <ArrowRight size={16} aria-hidden="true" /></Link>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
