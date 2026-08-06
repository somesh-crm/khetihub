import { useParams, Link } from 'react-router-dom';
import { api, formatDate } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { NewsRow, Spinner } from '../components/Cards.jsx';

export default function NewsDetail() {
  const { slug } = useParams();
  const { data, loading } = useFetch(() => api.article(slug), [slug]);
  if (loading) return <Spinner />;
  if (!data) return <div className="container-x pt-10 text-center text-gray-main">Article not found</div>;
  return (
    <div className="container-x pt-6 pb-8">
      <img src={data.image} alt={data.title} className="w-full h-48 md:h-80 object-cover rounded-xl shadow-card" />
      <h1 className="text-xl md:text-2xl font-bold text-ink mt-4 leading-tight">{data.title}</h1>
      <div className="text-xs text-gray-main mt-2 font-semibold uppercase">{formatDate(data.date)}</div>
      <div className="prose-sm mt-4 text-gray-main leading-relaxed space-y-3">
        {data.body.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
      </div>

      <div className="mt-8">
        <h2 className="sec-title mb-3">More News</h2>
        <div className="space-y-3">
          {(data.more || []).map((n, i) => <NewsRow key={n.id} article={n} index={i + 1} />)}
        </div>
      </div>

      <Link to="/news" className="mt-6 inline-flex items-center gap-2 text-primary font-semibold hover:text-secondary">Back to All News</Link>
    </div>
  );
}
