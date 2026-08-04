import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { HP_RANGES, BUDGET_RANGES, FUELS, IMPLEMENT_CATEGORIES } from '../lib/constants.js';
import { TractorCard, BrandCard, UsedCard, VideoCard, NewsCard, Spinner, SectionHeader } from '../components/Cards.jsx';
import { IconArrowRight, IconCalculator, IconScale, IconSearch, IconTractor, IconPlay } from '../components/Icons.jsx';

const HeroLinks = ({ title, children }) => (
  <div className="mt-3">
    <h3 className="text-white/90 font-bold text-sm mb-2">{title}</h3>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

const ChipLink = ({ to, children, onDark = false }) => (
  <Link
    to={to}
    className={`inline-flex items-center rounded-full px-3.5 py-2 text-xs font-semibold transition active:scale-95 ${
      onDark ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-white border border-gray-200 text-gray-700 hover:border-kheti-900'
    }`}
  >
    {children}
  </Link>
);

const CompareWidget = () => {
  const [brandId, setBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const [brand, setBrand] = useState(null);
  const [model, setModel] = useState(null);
  const [slot, setSlot] = useState(0);
  const [picks, setPicks] = useState([]);
  const { data: brands } = useFetch(api.brands, []);
  const { data: models, loading } = useFetch(() => api.tractors({ brand: brandId }), [brandId]);
  const navigate = useNavigate();

  const current = picks[slot] || {};
  const activeBrand = brandId || current.brand_slug;
  const activeModel = modelId || current.slug;

  const addSlot = () => {
    const slug = modelId || model?.slug;
    if (!slug) return;
    const picked = brands && models ? { slug, brand_slug: brandId } : { slug };
    const next = [...picks];
    next[slot] = picked;
    setPicks(next);
    setBrandId('');
    setModelId('');
    setSlot((s) => (s + 1) % 3);
  };

  const goCompare = () => {
    const slugs = picks.map((p) => p.slug);
    if (slugs.length >= 2) navigate(`/compare?add=${slugs.join(',')}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-4">
      <h3 className="font-extrabold text-gray-900 mb-3">Compare Tractors</h3>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setSlot(i)}
            className={`rounded-xl border-2 p-2 text-center transition ${slot === i ? 'border-kheti-900 bg-kheti-50' : 'border-gray-200'}`}
          >
            <span className="block text-2xl font-black text-kheti-900">A{i + 1}</span>
            <span className="block text-[10px] text-gray-500 mt-0.5">
              {picks[i]?.brand_slug ? models?.find((m) => m.slug === picks[i].slug)?.name || picks[i].slug : `Slot ${i + 1}`}
            </span>
          </button>
        ))}
      </div>
      <select
        value={activeBrand || ''}
        onChange={(e) => { setBrandId(e.target.value); setBrand(null); }}
        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm mb-2 bg-white"
      >
        <option value="">Select Brand</option>
        {brands?.map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}
      </select>
      <select
        value={activeModel || ''}
        onChange={(e) => setModelId(e.target.value)}
        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm mb-3 bg-white"
      >
        <option value="">Select Model</option>
        {models?.map((m) => <option key={m.id} value={m.slug}>{m.name}</option>)}
      </select>
      <div className="flex gap-2">
        <button onClick={addSlot} disabled={!activeModel} className="btn-outline flex-1 disabled:opacity-40">
          Add Tractor
        </button>
        <button onClick={goCompare} disabled={picks.length < 2} className="btn-primary flex-1 disabled:opacity-40">
          Compare
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const { data: brands } = useFetch(api.brands, []);
  const { data: popular } = useFetch(() => api.tractors({ popular: 1 }), []);
  const { data: latest } = useFetch(() => api.tractors({ latest: 1 }), []);
  const { data: mini } = useFetch(() => api.tractors({ mini: 1 }), []);
  const { data: used } = useFetch(api.used, []);
  const { data: videos } = useFetch(api.videos, []);
  const { data: news } = useFetch(api.news, []);
  const { data: categories } = useFetch(api.implementCategories, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-kheti-900 text-white rounded-b-4xl">
        <div className="container-x py-5 pb-7">
          <div className="mb-1 text-xs text-white/70 font-medium">Buy - Compare - Sell</div>
          <h1 className="text-2xl font-black leading-tight">India's Tractor Marketplace</h1>

          <HeroLinks title="Tractor Brands">
            {(brands || []).slice(0, 10).map((b) => (
              <ChipLink key={b.id} to={`/brand/${b.slug}`} onDark>{b.name}</ChipLink>
            ))}
            <ChipLink to="/brands" onDark>View All Brands</ChipLink>
          </HeroLinks>

          <HeroLinks title="Select Tractor By HP">
            {HP_RANGES.map((r) => (
              <ChipLink key={r.label} to={`/tractors?minHp=${r.min}&maxHp=${r.max}`} onDark>{r.label}</ChipLink>
            ))}
          </HeroLinks>

          <HeroLinks title="Select Tractor by Fuel">
            {FUELS.map((f) => (
              <ChipLink key={f} to={`/tractors?fuel=${f}`} onDark>{f} Tractor</ChipLink>
            ))}
          </HeroLinks>
        </div>
      </section>

      {/* Popular */}
      <section className="mt-6">
        <div className="container-x">
          <SectionHeader title="Popular Tractor" to="/tractors?popular=1" />
          {popular ? (
            <div className="hscroll">
              {popular.map((t) => <TractorCard key={t.id} tractor={t} />)}
            </div>
          ) : <Spinner />}
        </div>
      </section>

      {/* Budget */}
      <section className="mt-6">
        <div className="container-x">
          <h2 className="section-title mb-3">Select Tractor By Budget</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {BUDGET_RANGES.map((r) => (
              <Link key={r.label} to={`/tractors?minPrice=${r.min}&maxPrice=${r.max}`}
                className="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-2 text-sm font-semibold text-gray-700 active:bg-gray-50">
                <IconTractor className="h-4 w-4 text-kheti-900 shrink-0" />
                <span className="truncate">{r.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest */}
      <section className="mt-6">
        <div className="container-x">
          <SectionHeader title="Latest Tractor" to="/tractors?latest=1" />
          {latest ? (
            <div className="hscroll">
              {latest.map((t) => <TractorCard key={t.id} tractor={t} />)}
            </div>
          ) : <Spinner />}
        </div>
      </section>

      {/* Mini */}
      <section className="mt-6">
        <div className="container-x">
          <SectionHeader title="Mini Tractors" to="/tractors?mini=1" />
          {mini ? (
            <div className="hscroll">
              {mini.map((t) => <TractorCard key={t.id} tractor={t} />)}
            </div>
          ) : <Spinner />}
        </div>
      </section>

      {/* Used */}
      <section className="mt-6">
        <div className="container-x">
          <div className="bg-white rounded-2xl shadow-card p-4 mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-extrabold text-gray-900">Buy / Sell Used Tractor</h2>
              <p className="text-xs text-gray-500 mt-0.5">Value for money second-hand tractors</p>
            </div>
            <Link to="/sell" className="btn-accent shrink-0">Sell Your Tractor</Link>
          </div>
          <div className="hscroll">
            {(used || []).map((u) => <UsedCard key={u.id} listing={u} />)}
          </div>
          <div className="mt-3 flex gap-2">
            <Link to="/used" className="btn-outline flex-1">View All Used Tractors</Link>
            <Link to="/sell" className="btn-primary flex-1">Sell Your Tractor</Link>
          </div>
        </div>
      </section>

      {/* Compare + EMI */}
      <section className="mt-8 bg-kheti-50 py-6">
        <div className="container-x">
          <h2 className="section-title mb-4">
            <IconScale className="h-5 w-5 text-kheti-900" /> Tractor Tools
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <CompareWidget />
            <div className="bg-white rounded-2xl shadow-card p-4 flex flex-col">
              <h3 className="font-extrabold text-gray-900 mb-1">Calculate EMI</h3>
              <p className="text-xs text-gray-500 mb-4">Plan your tractor loan easily</p>
              <div className="flex-1 grid grid-cols-2 gap-3 text-center">
                <div className="bg-kheti-50 rounded-xl p-4">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Loan Amount</div>
                  <div className="text-lg font-extrabold text-kheti-900">₹ 5L</div>
                </div>
                <div className="bg-kheti-50 rounded-xl p-4">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Tenure</div>
                  <div className="text-lg font-extrabold text-kheti-900">5 Yr</div>
                </div>
                <div className="bg-kheti-50 rounded-xl p-4">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Interest</div>
                  <div className="text-lg font-extrabold text-kheti-900">10%</div>
                </div>
                <div className="bg-kheti-900 rounded-xl p-4 text-white">
                  <div className="text-[10px] font-bold text-white/60 uppercase">Monthly EMI</div>
                  <div className="text-lg font-extrabold">₹ 10,624</div>
                </div>
              </div>
              <Link to="/emi" className="btn-primary w-full mt-4">
                <IconCalculator className="h-4 w-4" /> Open EMI Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Implements */}
      <section className="mt-8">
        <div className="container-x">
          <SectionHeader title="Tractor Implement Types" to="/implements" />
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {IMPLEMENT_CATEGORIES.map((c) => {
              const cat = (categories || []).find((x) => x.category === c);
              return (
                <Link key={c} to={`/implements?category=${encodeURIComponent(c)}`}
                  className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col items-center gap-1.5 text-center active:bg-gray-50">
                  <span className="h-9 w-9 rounded-full bg-kheti-50 text-kheti-900 flex items-center justify-center font-black">
                    {c[0]}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-700 leading-tight">{c}</span>
                  {cat && <span className="text-[10px] text-gray-400">{cat.count} Implements</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="mt-8 bg-gray-100 py-6">
        <div className="container-x">
          <SectionHeader title="Updates About Tractor" />
          <h3 className="flex items-center gap-2 font-extrabold text-gray-900 mb-3">
            <IconPlay className="h-5 w-5 text-accent-500" /> Tractor Videos
          </h3>
          <div className="hscroll">
            {(videos || []).slice(0, 6).map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
          <div className="mt-3">
            <Link to="/videos" className="btn-outline w-full">View All Tractor Videos</Link>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="mt-8">
        <div className="container-x">
          <SectionHeader title="Tractor News" to="/news" />
          <div className="space-y-3">
            {(news || []).slice(0, 5).map((n) => <NewsCard key={n.id} article={n} horizontal />)}
          </div>
        </div>
      </section>

      {/* Brands strip */}
      <section className="mt-8">
        <div className="container-x">
          <SectionHeader title="All Tractor Brands" to="/brands" />
          <div className="hscroll">
            {(brands || []).map((b) => <BrandCard key={b.id} brand={b} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
