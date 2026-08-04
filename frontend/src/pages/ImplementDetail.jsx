import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, formatPrice } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { ImplementCard, Spinner } from '../components/Cards.jsx';

export default function ImplementDetail() {
  const { slug } = useParams();
  const { data, loading } = useFetch(() => api.implement(slug), [slug]);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  if (loading) return <Spinner />;
  if (!data) return <div className="container-x pt-10 text-center text-gray-500">Implement not found</div>;

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.submitLead({ ...form, page: `Implement: ${data.name}` });
      setSubmitted(true);
    } catch { /* noop */ }
  };

  return (
    <div className="container-x pt-6 pb-8">
      <div className="card">
        <img src={data.image} alt={data.name} className="w-full h-48 md:h-72 object-cover" />
      </div>

      <div className="mt-4">
        <Link to={`/implements?category=${encodeURIComponent(data.category)}`} className="inline-flex pill bg-accent-50 text-accent-500">
          {data.category}
        </Link>
        <h1 className="text-xl font-extrabold text-gray-900 mt-2 leading-tight">{data.name}</h1>
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">{data.description}</p>
        <div className="mt-3 text-2xl font-black text-kheti-900">{formatPrice(data.price)}</div>
        <p className="text-[11px] text-gray-400 mt-1">Approximate price, may vary by brand and dealer.</p>
      </div>

      <div className="card p-4 mt-5">
        <h2 className="font-bold text-gray-900 mb-3">Get Implement Price</h2>
        {submitted ? (
          <p className="text-center font-bold text-gray-900 py-6">Thank You! Dealer will contact you soon.</p>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your Name" className="w-full rounded-lg border border-gray-300 p-3 text-sm" />
            <input required type="tel" pattern="[0-9]{10}" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="10 Digit Mobile Number" className="w-full rounded-lg border border-gray-300 p-3 text-sm" />
            <button type="submit" className="btn-accent w-full">Get Best Price</button>
          </form>
        )}
      </div>

      {data.similar?.length > 0 && (
        <section className="mt-8">
          <h2 className="section-title mb-3">Similar {data.category}</h2>
          <div className="hscroll">
            {data.similar.map((i) => <ImplementCard key={i.id} implement={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
