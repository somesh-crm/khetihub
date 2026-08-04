import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { TractorCard, Spinner } from '../components/Cards.jsx';

export default function BrandDetail() {
  const { slug } = useParams();
  const { data, loading } = useFetch(() => api.brand(slug), [slug]);
  if (loading) return <Spinner />;
  if (!data) return <div className="container-x pt-10 text-center text-gray-500">Brand not found</div>;
  return (
    <div className="container-x pt-6">
      <div className="bg-kheti-900 rounded-2xl p-5 text-white flex items-center gap-4">
        <span className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl font-black shrink-0"
          style={{ backgroundColor: data.color }}>
          {data.name[0]}
        </span>
        <div>
          <h1 className="text-xl font-extrabold">{data.name}</h1>
          <p className="text-xs text-white/70 mt-0.5">{data.country} - {data.tractors.length} Models</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-4 leading-relaxed">{data.description}</p>
      <h2 className="section-title mt-6 mb-3">All Models of {data.name}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {data.tractors.map((t) => (
          <Link key={t.id} to={`/tractor/${t.slug}`} className="card flex flex-col active:scale-[0.98] transition">
            <img src={t.image} alt={t.name} loading="lazy" className="w-full h-28 object-cover" />
            <div className="p-3">
              <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug min-h-[36px]">{t.name}</h3>
              <div className="mt-1 text-xs text-gray-500">{t.hp} HP - {t.fuel}</div>
              <div className="mt-2 text-kheti-900 font-extrabold text-sm">₹ {t.price.toLocaleString('en-IN')}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <Link to="/brands" className="btn-outline">All Brands</Link>
      </div>
    </div>
  );
}
