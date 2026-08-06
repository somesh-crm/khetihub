import { api } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { FeaturedNews, NewsRow, Spinner } from '../components/Cards.jsx';

export default function News() {
  const { data, loading } = useFetch(api.news, []);
  if (loading) return <Spinner />;
  const [featured, ...rest] = data || [];
  return (
    <div className="container-x pt-6 pb-8">
      <h1 className="sec-title mb-4 md:mb-6">Tractor News</h1>
      <p className="text-sm text-gray-main">Latest tractor industry news, launches and agriculture updates</p>

      {featured && (
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <FeaturedNews article={featured} index={1} />
          <div className="space-y-3">
            {rest.map((n, i) => <NewsRow key={n.id} article={n} index={i + 2} />)}
          </div>
        </div>
      )}

      {!featured && (
        <div className="space-y-3 mt-6">
          {rest.map((n, i) => <NewsRow key={n.id} article={n} index={i + 1} />)}
        </div>
      )}
    </div>
  );
}
