import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, formatPrice } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { TractorCard, Spinner } from '../components/Cards.jsx';
import { IconScale, IconShare, IconChevronRight, IconArrowRight } from '../components/Icons.jsx';
import { useCompareStore } from '../store/compareStore.js';

const SpecRow = ({ label, value, highlight = false }) => (
  <div className={`flex items-center justify-between py-2.5 px-3 border-b border-gray-light last:border-0 ${highlight ? 'bg-green-mint' : ''}`}>
    <span className="text-sm text-gray-main">{label}</span>
    <span className="text-sm font-semibold text-ink text-right">{value || 'NA'}</span>
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
  if (!data) return <div className="container-x pt-10 text-center text-gray-main">Tractor not found</div>;

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
    <div className="container-x pt-6 pb-8">
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-gray-main mb-3">
        <Link to="/" className="font-semibold text-primary hover:text-secondary">Home</Link>
        <IconChevronRight className="h-3 w-3" />
        <Link to={`/brand/${data.brand_slug}`} className="font-semibold text-primary hover:text-secondary">{data.brand_name}</Link>
        <IconChevronRight className="h-3 w-3" />
        <span className="truncate max-w-[160px]">{data.name}</span>
      </nav>

      <img src={data.image} alt={data.name} className="w-full h-52 md:h-80 object-cover rounded-xl shadow-card" />

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <Link to={`/brand/${data.brand_slug}`} className="inline-flex items-center rounded-full bg-green-lighter text-primary px-3 py-1 text-xs font-semibold border border-green-light hover:bg-green-mint">
            {data.brand_name}
          </Link>
          <h1 className="text-xl md:text-2xl font-extrabold text-ink mt-2 leading-tight">{data.name}</h1>
        </div>
        <button className="p-2 rounded-full border border-gray-light text-gray-main hover:bg-green-lighter active:scale-95" aria-label="Share">
          <IconShare className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-2xl font-black text-primary">{formatPrice(data.price)}</span>
        <span className="text-xs text-gray-main">On Road Price (approx)</span>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <span className="tab-pill tab-pill-active !px-4 !py-1.5 text-xs"><b>{data.hp} HP</b></span>
        <span className="tab-pill tab-pill-inactive !px-4 !py-1.5 text-xs">{data.cylinders} Cylinder</span>
        <span className="tab-pill tab-pill-inactive !px-4 !py-1.5 text-xs">Lifting: {data.lift_capacity}</span>
        <span className="tab-pill tab-pill-inactive !px-4 !py-1.5 text-xs">{data.fuel}</span>
        <span className="tab-pill tab-pill-inactive !px-4 !py-1.5 text-xs">{data.drive}</span>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => toggle(data)}
          disabled={!inBasket && full}
          className={`btn-green-sm flex-1 justify-center disabled:opacity-40 ${inBasket ? '!bg-secondary !text-white' : '!bg-white !text-primary border border-primary hover:!bg-green-lighter'}`}
        >
          <IconScale className="h-4 w-4" /> {inBasket ? 'Added to Compare' : 'Add to Compare'}
        </button>
        <Link to="/compare" className="btn-green-sm flex-1 justify-center">Compare Now</Link>
      </div>

      <section className="mt-6">
        <h2 className="sec-title mb-3">Key Specifications</h2>
        <div className="rounded-2xl border border-gray-light bg-white shadow-card p-4">
          {spec.map(([l, v]) => <SpecRow key={l} label={l} value={v} highlight={l === 'Price' || l === 'Horsepower'} />)}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="sec-title mb-3">Features</h2>
        <div className="rounded-2xl border border-gray-light bg-white shadow-card p-4">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-main">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="sec-title mb-3">Tractor Enquiry</h2>
        <div className="rounded-2xl border border-gray-light bg-white shadow-card p-4">
          {submitted ? (
            <div className="text-center py-6">
              <div className="h-12 w-12 mx-auto rounded-full bg-green-mint flex items-center justify-center text-2xl text-primary">✓</div>
              <p className="font-bold text-ink mt-3">Thank You!</p>
              <p className="text-sm text-gray-main mt-1">Our dealer will contact you soon for {data.name}.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your Name" className="w-full rounded-lg border border-gray-light bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-green-main" />
              <input required type="tel" pattern="[0-9]{10}" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="10 Digit Mobile Number" className="w-full rounded-lg border border-gray-light bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-green-main" />
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Message (optional)" rows="2" className="w-full rounded-lg border border-gray-light bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-green-main" />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button type="submit" className="btn-green-sm w-full justify-center">Request Dealer Call</button>
            </form>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="sec-title mb-3">Related {data.brand_name} Models</h2>
        <div className="hscroll">
          {data.related.map((t) => <TractorCard key={t.id} tractor={t} />)}
        </div>
      </section>

      <Link to="/tractors" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-secondary">
        View All Tractors <IconArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
