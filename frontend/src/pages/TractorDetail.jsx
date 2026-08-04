import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, formatPrice } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { TractorCard, Spinner } from '../components/Cards.jsx';
import { IconScale, IconShare, IconPhone, IconArrowRight } from '../components/Icons.jsx';
import { useCompareStore } from '../store/compareStore.js';

const SpecRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-900 text-right">{value || 'NA'}</span>
  </div>
);

export default function TractorDetail() {
  const { slug } = useParams();
  const { data, loading } = useFetch(() => api.tractor(slug), [slug]);
  const { tractors, toggle } = useCompareStore();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (loading) return <Spinner />;
  if (!data) return <div className="container-x pt-10 text-center text-gray-500">Tractor not found</div>;

  const inBasket = tractors.some((t) => t.id === data.id);
  const full = tractors.length >= 3;

  const spec = [
    ['Price', formatPrice(data.price)],
    ['Horsepower', `${data.hp} HP`],
    ['Cylinders', `${data.cylinders} Cylinder`],
    ['Lifting Capacity', data.lift_capacity],
    ['Engine', data.engine],
    ['Fuel', data.fuel],
    ['Drive', data.drive],
    ['Power Take-off', data.power_takeoff],
    ['Transmission', data.transmission],
    ['Fuel Tank', data.fuel_tank],
    ['Tyres', data.tyres],
    ['Weight', data.weight],
    ['Warranty', data.warranty]
  ];

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.submitLead({ ...form, page: `Tractor: ${data.name}` });
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-x pt-5 pb-8">
      <div className="card">
        <img src={data.image} alt={data.name} className="w-full h-52 md:h-80 object-cover" />
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <Link to={`/brand/${data.brand_slug}`} className="inline-flex pill bg-kheti-50 text-kheti-900">
            {data.brand_name}
          </Link>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mt-2 leading-tight">{data.name}</h1>
        </div>
        <button className="p-2 rounded-full border border-gray-200 text-gray-500 active:bg-gray-100" aria-label="Share">
          <IconShare className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-2xl font-black text-kheti-900">{formatPrice(data.price)}</span>
        <span className="text-xs text-gray-400">On Road Price (approx)</span>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <span className="pill text-sm"><b>{data.hp} HP</b></span>
        <span className="pill text-sm">{data.cylinders} Cylinder</span>
        <span className="pill text-sm">Lifting: {data.lift_capacity}</span>
        <span className="pill text-sm">{data.fuel}</span>
        <span className="pill text-sm">{data.drive}</span>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => toggle(data)}
          disabled={!inBasket && full}
          className={`flex-1 rounded-full py-3 font-bold text-sm flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-40 ${inBasket ? 'bg-accent-500 text-white' : 'bg-white border border-kheti-900 text-kheti-900'}`}
        >
          <IconScale className="h-4 w-4" /> {inBasket ? 'Added to Compare' : 'Add to Compare'}
        </button>
        <Link to="/compare" className="flex-1 rounded-full bg-kheti-900 text-white font-bold text-sm flex items-center justify-center gap-2 py-3 active:scale-[0.98]">
          Compare Now
        </Link>
      </div>

      <section className="mt-6">
        <h2 className="section-title mb-3">Key Specifications</h2>
        <div className="card p-4">
          {spec.map(([l, v]) => <SpecRow key={l} label={l} value={v} />)}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="section-title mb-3">Features</h2>
        <div className="card p-4">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-kheti-900 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="section-title mb-3">Tractor Enquiry</h2>
        <div className="card p-4">
          {submitted ? (
            <div className="text-center py-6">
              <div className="h-12 w-12 mx-auto rounded-full bg-kheti-100 flex items-center justify-center text-2xl text-kheti-900">✓</div>
              <p className="font-bold text-gray-900 mt-3">Thank You!</p>
              <p className="text-sm text-gray-500 mt-1">Our dealer will contact you soon for {data.name}.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your Name" className="w-full rounded-lg border border-gray-300 p-3 text-sm" />
              <input required type="tel" pattern="[0-9]{10}" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="10 Digit Mobile Number" className="w-full rounded-lg border border-gray-300 p-3 text-sm" />
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Message (optional)" rows="2" className="w-full rounded-lg border border-gray-300 p-3 text-sm" />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button type="submit" className="btn-accent w-full">Request Dealer Call</button>
            </form>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="section-title mb-3">Related {data.brand_name} Models</h2>
        <div className="hscroll">
          {data.related.map((t) => <TractorCard key={t.id} tractor={t} />)}
        </div>
      </section>

      <Link to="/tractors" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-kheti-900">
        View All Tractors <IconArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
