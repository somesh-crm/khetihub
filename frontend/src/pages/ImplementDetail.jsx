import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, formatPrice } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { Spinner } from '../components/Cards.jsx';

function SimilarCard({ implement }) {
  return (
    <Link to={`/implements/${implement.slug}`} className="flex flex-col rounded-2xl border border-gray-light bg-white shadow-card transition-all duration-300 hover:border-secondary hover:bg-green-lighter hover:scale-[1.02]">
      <img src={implement.image} alt={implement.name} loading="lazy" className="h-32 w-full object-contain md:h-40" />
      <div className="flex flex-1 flex-col p-3">
        <span className="self-start bg-green-lighter text-primary rounded-full px-2 py-0.5 text-xs font-bold">{implement.category}</span>
        <h3 className="mt-2 text-sm font-bold text-ink line-clamp-2 leading-snug">{implement.name}</h3>
        <p className="mt-1 text-primary font-bold text-sm">{formatPrice(implement.price)}</p>
      </div>
    </Link>
  );
}

export default function ImplementDetail() {
  const { slug } = useParams();
  const { data, loading } = useFetch(() => api.implement(slug), [slug]);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  if (loading) return <Spinner />;
  if (!data) return <div className="container-x pt-10 text-center text-gray-main">Implement not found</div>;

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.submitLead({ ...form, page: `Implement: ${data.name}` });
      setSubmitted(true);
    } catch { /* noop */ }
  };

  return (
    <div className="container-x pt-6 pb-8">
      <div className="overflow-hidden rounded-2xl border border-gray-light bg-white shadow-card">
        <img src={data.image} alt={data.name} className="w-full h-48 md:h-72 object-cover" />
      </div>

      <div className="mt-4">
        <Link to={`/implements?category=${encodeURIComponent(data.category)}`} className="inline-block bg-green-lighter text-primary rounded-full px-2 py-0.5 text-xs font-bold hover:text-secondary">
          {data.category}
        </Link>
        <h1 className="sec-title mt-3 mb-2">{data.name}</h1>
        <p className="text-sm text-gray-main mt-3 leading-relaxed">{data.description}</p>
        <div className="mt-3 text-2xl font-black text-primary">{formatPrice(data.price)}</div>
        <p className="text-[11px] text-gray-main mt-1">Approximate price, may vary by brand and dealer.</p>
      </div>

      <div className="mt-5 rounded-2xl bg-green-lighter p-5">
        <h2 className="sec-title mb-3">Get Implement Price</h2>
        {submitted ? (
          <p className="text-center font-bold text-ink py-6">Thank You! Dealer will contact you soon.</p>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your Name" className="w-full rounded-lg border border-gray-light bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-green-main" />
            <input required type="tel" pattern="[0-9]{10}" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="10 Digit Mobile Number" className="w-full rounded-lg border border-gray-light bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-green-main" />
            <button type="submit" className="btn-green w-full !mx-0">Get Best Price</button>
          </form>
        )}
      </div>

      {data.similar?.length > 0 && (
        <section className="mt-8">
          <h2 className="sec-title mb-3">Similar {data.category}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.similar.map((i) => <SimilarCard key={i.id} implement={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
