import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { NewsCard, Spinner } from '../components/Cards.jsx';

export default function News() {
  const { data, loading } = useFetch(api.news, []);
  if (loading) return <Spinner />;
  const [featured, ...rest] = data || [];
  return (
    <div className="container-x pt-6 pb-8">
      <h1 className="text-xl font-extrabold text-gray-900">Tractor News</h1>
      <p className="text-sm text-gray-500 mt-1">Latest tractor industry news, launches and agriculture updates</p>

      {featured && (
        <Link to={`/news/${featured.slug}`} className="card mt-5 block">
          <img src={featured.image} alt={featured.title} className="w-full h-44 object-cover" />
          <div className="p-4">
            <span className="text-[10px] font-semibold text-gray-400 uppercase">{featured.date}</span>
            <h2 className="text-lg font-extrabold text-gray-900 mt-1 leading-snug line-clamp-2">{featured.title}</h2>
            <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{featured.excerpt}</p>
          </div>
        </Link>
      )}

      <div className="space-y-3 mt-4">
        {rest.map((n) => <NewsCard key={n.id} article={n} horizontal />)}
      </div>
    </div>
  );
}
