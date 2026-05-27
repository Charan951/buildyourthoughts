import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";

interface Post {
  _id: string; title: string; excerpt: string; content: string; tag: string;
  author: string; readTime: string; image: string; createdAt: string;
}

const tagColorMap: Record<string, string> = {
  AI: "bg-primary/10 text-primary", Cloud: "bg-secondary/10 text-secondary",
  Security: "bg-accent/10 text-accent", Technology: "bg-primary/10 text-primary",
  General: "bg-muted text-muted-foreground",
};

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/${id}`)
      .then(r => r.json())
      .then(data => { setPost(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <Layout><div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div></Layout>
  );

  if (!post) return (
    <Layout><div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="text-6xl">📝</div>
      <h2 className="text-2xl font-heading font-bold">Post not found</h2>
      <button onClick={() => navigate("/blog")} className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold">
        <ArrowLeft size={18} /> Back to Blog
      </button>
    </div></Layout>
  );

  return (
    <Layout>
      <div className="container py-10 max-w-3xl">
        <Link to="/blog" className="flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-border text-muted-foreground font-bold text-sm hover:text-foreground hover:border-primary/30 transition-all mb-8 w-fit">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {post.image && (
          <div className="rounded-3xl overflow-hidden mb-8 shadow-2xl">
            <img src={post.image} alt={post.title} loading="lazy" decoding="async" className="w-full h-64 object-cover" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${tagColorMap[post.tag] || "bg-muted text-muted-foreground"}`}>
            <Tag size={10} className="inline mr-1" />{post.tag}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-heading font-black text-foreground leading-tight mb-6">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
          <span className="flex items-center gap-2"><User size={14} className="text-primary" /> {post.author}</span>
          <span className="flex items-center gap-2"><Calendar size={14} className="text-secondary" /> {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          <span className="flex items-center gap-2"><Clock size={14} className="text-accent" /> {post.readTime} read</span>
        </div>

        <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-light italic">{post.excerpt}</p>

        {post.content && (
          <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        )}
      </div>
    </Layout>
  );
}
