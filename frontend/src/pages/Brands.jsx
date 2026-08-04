import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { Spinner } from '../components/Cards.jsx';

export default function Brands() {
  const { data, loading } = useFetch(api.brands, []);
  if (loading) return <Spinner />;
  return (
    <div className="container-x pt-6">
      <h1 className="text-xl font-extrabold text-gray-900">Tractor Brands</h1>
      <p className="text-sm text-gray-500 mt-1">Explore all tractor brands and their models</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
        {data.map((b) => (
          <Link key={b.id} to={`/brand/${b.slug}`} className="card p-4 flex items-center gap-3 active:scale-[0.98] transition">
            <span className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0"
              style={{ backgroundColor: b.color }}>
              {b.name[0]}
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-sm truncate">{b.name}</h3>
              <span className="text-xs text-gray-500">{b.model_count} Models - {b.country}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
