import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { TractorCard, Spinner } from '../components/Cards.jsx';

export default function BrandDetail() {
  const { slug } = useParams();
  const { data, loading } = useFetch(() => api.brand(slug), [slug]);
  if (loading) return <Spinner />;
  if (!data) return <div className="container-x pt-10 text-center text-gray-main">Brand not found</div>;
  return (
    <div className="container-x pt-6 pb-8">
      <div className="rounded-2xl border border-gray-light bg-white shadow-card p-5 flex items-center gap-4">
        <span className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl font-black shrink-0 text-white"
          style={{ backgroundColor: data.color }}>
          {data.name[0]}
        </span>
        <div>
          <h1 className="text-xl font-extrabold text-ink">{data.name}</h1>
          <p className="text-xs text-gray-main mt-0.5">{data.country} - {data.tractors.length} Models</p>
        </div>
      </div>
      <p className="text-sm text-gray-main mt-4 leading-relaxed">{data.description}</p>
      <h2 className="sec-title mb-3 mt-6">All Models of {data.name}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {data.tractors.map((t) => (
          <TractorCard key={t.id} tractor={t} fluid />
        ))}
      </div>
      <div className="mt-8">
        <Link to="/brands" className="btn-green">All Brands</Link>
      </div>
    </div>
  );
}
