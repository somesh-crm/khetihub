import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { Spinner } from '../components/Cards.jsx';

export default function Brands() {
  const { data, loading } = useFetch(api.brands, []);
  if (loading) return <Spinner />;
  return (
    <div className="container-x pt-6 pb-8">
      <h1 className="sec-title mb-4 md:mb-6">Tractor Brands</h1>
      <p className="text-sm text-gray-main">Explore all tractor brands and their models</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
        {data.map((b) => (
          <Link key={b.id} to={`/brand/${b.slug}`} className="flex items-center gap-3 p-4 rounded-xl border border-gray-light bg-white shadow-brand hover:border-secondary hover:bg-green-lighter transition-all duration-300 active:scale-[0.98]">
            <span className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0"
              style={{ backgroundColor: b.color }}>
              {b.name[0]}
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-ink text-sm truncate">{b.name}</h3>
              <span className="text-xs text-gray-main">{b.model_count} Models - {b.country}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
