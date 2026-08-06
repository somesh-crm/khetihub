import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { HP_RANGES, BUDGET_RANGES, FUELS } from '../lib/constants.js';
import { TractorCard, MiniCard, UsedCard, BrandTile, VideoCard, FeaturedNews, NewsRow, Spinner, ImplementTile } from '../components/Cards.jsx';
import { IconChevronRight } from '../components/Icons.jsx';
import { FuelDiesel, FuelPetrol, FuelCNG, FuelElectric, OFFERING_ICONS, OFFERINGS } from '../components/TileIcons.jsx';
import Carousel from '../components/Carousel.jsx';
import EMICalculator from '../components/EMICalculator.jsx';

const FUEL_ICONS = {
  Diesel: FuelDiesel,
  Petrol: FuelPetrol,
  CNG: FuelCNG,
  Electric: FuelElectric
};

// Hero banner (SVG gradient + Search Tractors card)
const Hero = () => {
  const [brandId, setBrandId] = useState('');
  const [hp, setHp] = useState('');
  const navigate = useNavigate();
  const { data: brands } = useFetch(api.brands, []);

  const go = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (brandId) p.set('brand', brandId);
    if (hp) p.set('maxHp', hp);
    navigate(`/tractors${p.toString() ? '?' + p.toString() : ''}`);
  };

  return (
    <section className="relative w-full overflow-hidden bg-green-dark-gradient">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(70,170,72,0.35),transparent_60%)]" />
      <div className="container-x relative py-6 md:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex-1 text-white md:pr-8">
            <h1 className="text-2xl md:text-4xl font-bold leading-tight">Find Your Perfect Tractor</h1>
            <p className="mt-2 text-white/85 text-sm md:text-base">Search, compare, buy new & used tractors and find the right implements & dealers near you.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/used" className="btn-green-sm !bg-white !text-primary hover:!bg-green-lighter">Buy Used Tractor</Link>
              <Link to="/sell" className="btn-green-sm !bg-orange-main hover:!bg-orange-dark">Sell Your Tractor</Link>
            </div>
          </div>
          <form onSubmit={go} className="w-full max-w-[380px] rounded-xl bg-white p-5 shadow-main">
            <h2 className="mb-4 text-lg font-semibold text-ink leading-5">Search Tractors</h2>
            <select value={brandId} onChange={(e) => setBrandId(e.target.value)}
              className="mb-2 w-full rounded-lg border border-gray-light h-[38px] px-2 text-sm text-ink bg-white focus:border-green-main outline-none">
              <option value="">Select Brand</option>
              {brands?.map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}
            </select>
            <select value={hp} onChange={(e) => setHp(e.target.value)}
              className="mb-2 w-full rounded-lg border border-gray-light h-[38px] px-2 text-sm text-ink bg-white focus:border-green-main outline-none">
              <option value="">Select HP Range</option>
              {HP_RANGES.map((r) => <option key={r.label} value={r.max}>{r.label}</option>)}
            </select>
            <Link to="/compare" className="mb-2 block w-full rounded-lg border border-primary h-[38px] leading-[38px] text-center text-sm font-medium text-primary hover:bg-green-lighter">
              Compare Tractors
            </Link>
            <button type="submit" className="w-full rounded-lg bg-primary h-[38px] text-sm font-medium text-white hover:bg-secondary transition">
              Search Tractor
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

// Section: generic tiles (HP / Budget)
const TilesSection = ({ title, tiles, bg, to }) => (
  <section className={`${bg ? 'bg-section-gray' : ''}`}>
    <div className="container-x">
      <h2 className="sec-title mb-4 md:mb-6">{title}</h2>
      <div className="flex flex-wrap gap-2 md:gap-4">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to} className="tile min-h-[100px] w-[calc(30%-6px)] md:w-[calc(15%-12px)] px-2">
            <span className="text-center text-base lg:text-lg font-semibold text-ink leading-tight">{t.label}</span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const BrandSection = () => {
  const { data, loading } = useFetch(api.brands, []);
  if (loading) return null;
  const visible = (data || []).slice(0, 9);
  return (
    <section>
      <div className="container-x">
        <h2 className="sec-title mb-4 md:mb-6">Tractors Brands</h2>
        <div className="flex flex-wrap justify-between gap-3 md:flex-nowrap">
          {visible.map((b) => <BrandTile key={b.id} brand={b} />)}
        </div>
        <div className="mt-5 text-center">
          <Link to="/brands" className="btn-green">View All Brands</Link>
        </div>
      </div>
    </section>
  );
};

const FuelSection = () => (
  <section className="bg-section-gray">
    <div className="container-x">
      <h2 className="sec-title mb-4 md:mb-6">Select Tractor by Fuel</h2>
      <div className="flex flex-wrap justify-between gap-2">
        {FUELS.map((f) => {
          const Icon = FUEL_ICONS[f];
          return (
            <Link key={f} to={`/tractors?fuel=${f}`} className="tile h-[120px] w-[calc(24%-6px)]">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-green-mint/50 text-primary">
                <Icon className="h-12 w-12" />
              </span>
              <span className="mt-1 text-sm font-semibold text-ink">{f}</span>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

const PopularSection = ({ data }) => (
  <section>
    <div className="container-x">
      <h2 className="sec-title mb-4 md:mb-6">Popular Tractor</h2>
      {data ? <Carousel>{data.map((t) => <TractorCard key={t.id} tractor={t} />)}</Carousel> : <Spinner />}
      <div className="mt-5 text-center">
        <Link to="/tractors?popular=1" className="btn-green">View All Popular Tractor</Link>
      </div>
    </div>
  </section>
);

const LatestSection = ({ data }) => (
  <section className="bg-section-gray">
    <div className="container-x">
      <h2 className="sec-title mb-4 md:mb-6">Latest Tractor</h2>
      {data ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {data.slice(0, 8).map((t) => <TractorCard key={t.id} tractor={t} variant="new" fluid />)}
        </div>
      ) : <Spinner />}
      <div className="mt-5 text-center">
        <Link to="/tractors?latest=1" className="btn-green">View All Latest Tractors</Link>
      </div>
    </div>
  </section>
);

const MiniSection = ({ data }) => (
  <section>
    <div className="container-x">
      <h2 className="sec-title mb-4 md:mb-6">Mini Tractors</h2>
      {data ? <Carousel>{data.map((t) => <MiniCard key={t.id} tractor={t} />)}</Carousel> : <Spinner />}
      <div className="mt-5 text-center">
        <Link to="/tractors?mini=1" className="btn-green">View All Mini Tractors</Link>
      </div>
    </div>
  </section>
);

const UsedSection = ({ data }) => (
  <section className="bg-section-gray">
    <div className="container-x">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="sec-title">Buy Used Tractor</h2>
        <Link to="/sell" className="hidden md:inline-block rounded-md bg-primary px-4 py-2 text-white text-sm font-medium hover:bg-secondary transition">Sell Your Tractor</Link>
      </div>
      {data ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.slice(0, 4).map((u) => <UsedCard key={u.id} listing={u} fluid />)}
        </div>
      ) : <Spinner />}
      <div className="mt-5 text-center">
        <Link to="/used" className="btn-green">View All Second Hand Tractors</Link>
      </div>
    </div>
  </section>
);

const CompareSection = () => {
  const [slots, setSlots] = useState([{}, {}, {}]);
  const [active, setActive] = useState(0);
  const [brandId, setBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const { data: brands } = useFetch(api.brands, []);
  const { data: models } = useFetch(() => api.tractors({ brand: brandId }), [brandId]);
  const navigate = useNavigate();

  const add = () => {
    if (!modelId) return;
    const next = [...slots];
    next[active] = { slug: modelId };
    setSlots(next);
    setBrandId(''); setModelId('');
    setActive((a) => (a + 1) % 3);
  };

  const goCompare = () => {
    const slugs = slots.map((s) => s.slug).filter(Boolean);
    if (slugs.length >= 2) navigate(`/compare?add=${slugs.join(',')}`);
  };

  return (
    <section>
      <div className="container-x">
        <h2 className="sec-title mb-4 md:mb-6">Compare Tractors</h2>
        <div className="flex items-stretch justify-between gap-2">
          {slots.map((slot, i) => (
            <div key={i} className="w-[calc(33.33%-6px)] md:w-[calc(33.33%-1rem)]">
              <div className={`rounded-xl p-3 md:p-5 ${active === i ? 'border-2 border-primary bg-green-lighter' : 'border border-gray-light'}`}>
                {slot.slug ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-bold text-primary truncate w-full text-center">{slot.slug}</span>
                    <button onClick={() => { const n = [...slots]; n[i] = {}; setSlots(n); }} className="text-xs text-gray-main underline">Remove</button>
                  </div>
                ) : (
                  <button onClick={() => setActive(i)} className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-light">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-mint/50 text-primary text-3xl font-light">+</span>
                    <span className="text-xs text-gray-main">Add Tractor</span>
                  </button>
                )}
                {active === i && !slot.slug && (
                  <div className="mt-3">
                    <select value={brandId} onChange={(e) => setBrandId(e.target.value)}
                      className="mb-2 w-full rounded-lg border h-[36px] px-2 text-sm bg-white focus:border-green-main outline-none">
                      <option value="">Select Brand</option>
                      {brands?.map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}
                    </select>
                    <select value={modelId} onChange={(e) => setModelId(e.target.value)} disabled={!brandId}
                      className="w-full rounded-lg border h-[36px] px-2 text-sm bg-white disabled:bg-gray-100 focus:border-green-main outline-none">
                      <option value="">Select Model</option>
                      {models?.map((m) => <option key={m.id} value={m.slug}>{m.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-3">
          <button onClick={add} disabled={!modelId} className="btn-green-sm disabled:opacity-40">Add Tractor</button>
          <button onClick={goCompare} disabled={slots.filter((s) => s.slug).length < 2} className="btn-green-sm !bg-orange-main disabled:opacity-40">Compare Tractors</button>
        </div>
      </div>
    </section>
  );
};

const ImplementSection = ({ categories }) => (
  <section className="bg-section-gray">
    <div className="container-x">
      <h2 className="sec-title mb-4 md:mb-6">Tractor Implement Types</h2>
      <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
        {(categories || []).map((c) => (
          <ImplementTile key={c.category} name={c.category} count={c.count} />
        ))}
      </div>
      <div className="mt-5 text-center">
        <Link to="/implements" className="btn-green">View All Implements</Link>
      </div>
    </div>
  </section>
);

const UpdatesSection = ({ videos }) => {
  const [tab, setTab] = useState('Tractor Videos');
  return (
    <section>
      <div className="container-x">
        <h2 className="sec-title mb-4 md:mb-6">Updates About Tractor</h2>
        <div className="hide-scrollbar mb-4 flex gap-2 overflow-auto md:gap-4">
          {['Tractor Videos', 'Tractor Reels'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`tab-pill ${tab === t ? 'tab-pill-active' : 'tab-pill-inactive'}`}>{t}</button>
          ))}
        </div>
        <Carousel>
          {(videos || []).map((v) => <VideoCard key={v.id} video={v} />)}
        </Carousel>
        <div className="mt-5 text-center">
          <Link to="/videos" className="btn-green">View All Tractor Videos</Link>
        </div>
      </div>
    </section>
  );
};

const NewsSection = ({ news }) => {
  if (!news) return null;
  const [featured, ...rest] = news;
  return (
    <section className="bg-section-gray">
      <div className="container-x">
        <h2 className="sec-title mb-4 md:mb-6">Tractor News</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <FeaturedNews article={featured} index={1} />
          <div className="max-h-[530px] overflow-y-auto border-t border-gray-100">
            {rest.map((n, i) => <NewsRow key={n.id} article={n} index={i + 2} />)}
          </div>
        </div>
        <div className="mt-5 text-center">
          <Link to="/news" className="btn-green">View All Tractor News</Link>
        </div>
      </div>
    </section>
  );
};

const CommunitySection = () => {
  const channels = [
    { name: 'Facebook', count: '784.5K', cls: 'bg-[#1877f2]' },
    { name: 'Youtube', count: '276.8K', cls: 'bg-[#ff0000]' },
    { name: 'Instagram', count: '239.2K', cls: 'bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af]' },
    { name: 'Linkedin', count: '17.9K', cls: 'bg-[#0a66c2]' },
    { name: 'Whatsapp', count: '5.7K', cls: 'bg-[#25d366]' },
    { name: 'Twitter', count: '1.1K', cls: 'bg-[#000000]' }
  ];
  return (
    <section className="bg-green-lighter">
      <div className="container-x">
        <h2 className="mb-5 text-center text-xl md:text-2xl font-semibold text-ink">Join Our Community</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {channels.map((c) => (
            <div key={c.name} className="flex min-w-[180px] max-w-[300px] items-center gap-3 rounded-lg bg-white p-3 shadow-card transition hover:scale-[1.03]">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${c.cls} text-white font-bold`}>{c.name[0]}</span>
              <span className="flex-1 text-xs text-gray-main">Follow {c.name}</span>
              <span className="border-s border-gray-light ps-3 text-lg font-bold text-ink">{c.count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const OfferingsSection = () => (
  <section>
    <div className="container-x">
      <h2 className="sec-title mb-4 md:mb-6">KhetiHub Offerings</h2>
      <div className="flex flex-wrap justify-around gap-3">
        {OFFERINGS.map((o) => {
          const Icon = OFFERING_ICONS[o.label];
          return (
            <Link key={o.label} to={o.to} className="tile h-[120px] w-[calc(30%-10px)] md:h-[150px] md:w-[136px] px-2">
              <span className="flex h-[60px] w-full items-center justify-center text-primary">
                <Icon className="h-[52px] w-[52px]" />
              </span>
              <span className="mt-1 text-center text-xs md:text-sm font-semibold text-ink leading-tight">{o.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section className="bg-section-gray">
    <div className="container-x">
      <h2 className="sec-title mb-4 md:mb-6">About KhetiHub</h2>
      <div className="space-y-3 text-base text-gray-main leading-relaxed">
        <p>
          KhetiHub is India's leading digital marketplace for farmers and key stakeholders of the Indian agricultural sector.
          It offers updated information about tractor price and models, tractor tyres, loans and insurance, old tractors, and various types of farm implements.
        </p>
        <p>
          The platform features a dedicated tractor model listing from all the prominent manufacturers such as Mahindra, Swaraj, Eicher, Sonalika,
          New Holland, Massey Ferguson, John Deere, Powertrac, Solis, Farmtrac, Kubota, and many others.
        </p>
        <h3 className="text-lg font-bold text-ink pt-1">Find All Tractor Models in India</h3>
        <p>A tractor is a farmer's best friend. We provide an extensive list of agriculture vehicles available in India, featuring the latest models from leading tractor brands. Compare 2WD and 4WD heavy-duty tractors on price, features, and specifications.</p>
        <h3 className="text-lg font-bold text-ink pt-1">Use the Tractor Comparison Tool and Save Time</h3>
        <p>India is the world's largest tractor manufacturer and user. With our compare tool, farmers can compare two or more models and find the ideal agriculture vehicle based on engine HP, fuel tank capacity, transmission type, price and more.</p>
        <h3 className="text-lg font-bold text-ink pt-1">Value For Money Second-Hand Tractors in India</h3>
        <p>Buying a second-hand tractor in India is no longer a headache. Farmers can find affordable Mahindra, Swaraj, Sonalika and other second-hand tractor models around them, or sell their old tractor to the right buyer and get the best price.</p>
        <h3 className="text-lg font-bold text-ink pt-1">Stay Ahead with Tractor Industry News and Agriculture Updates</h3>
        <p>Knowledge is the real power for farmers. Stay updated with new tractor model launches, technological innovations, government policies and subsidies, tractor sales reports, and unbiased reviews through our news and videos sections.</p>
        <p className="pt-2">KhetiHub is a tradename of KhetiHub Technologies Pvt Ltd.</p>
      </div>
    </div>
  </section>
);

export default function Home() {
  const { data: popular } = useFetch(() => api.tractors({ popular: 1 }), []);
  const { data: latest } = useFetch(() => api.tractors({ latest: 1 }), []);
  const { data: mini } = useFetch(() => api.tractors({ mini: 1 }), []);
  const { data: used } = useFetch(api.used, []);
  const { data: videos } = useFetch(api.videos, []);
  const { data: news } = useFetch(api.news, []);
  const { data: categories } = useFetch(api.implementCategories, []);

  return (
    <div>
      <Hero />
      <BrandSection />
      <TilesSection title="Select Tractor By HP" bg
        tiles={HP_RANGES.map((r) => ({ label: r.label, to: `/tractors?minHp=${r.min}&maxHp=${r.max}` }))} />
      <FuelSection />
      <PopularSection data={popular} />
      <TilesSection title="Select Tractor By Budget" bg
        tiles={BUDGET_RANGES.map((r) => ({ label: r.label, to: `/tractors?minPrice=${r.min}&maxPrice=${r.max}` }))} />
      <LatestSection data={latest} />
      <MiniSection data={mini} />
      <UsedSection data={used} />

      {/* Promo banner */}
      <section>
        <div className="container-x">
          <Link to="/implements" className="block overflow-hidden rounded-xl shadow-main">
            <div className="flex items-center justify-between gap-4 bg-green-dark-gradient px-6 py-4 text-white">
              <div>
                <h3 className="text-lg md:text-2xl font-bold">Tractor Implements & Tyres</h3>
                <p className="text-xs md:text-sm text-white/80 mt-1">Ploughs, Rotavators, Cultivators, Harvesters & more</p>
              </div>
              <span className="btn-green-sm !bg-white !text-primary whitespace-nowrap">Explore <IconChevronRight className="h-3 w-3" /></span>
            </div>
          </Link>
        </div>
      </section>

      <section className="bg-section-gray pt-0">
        <div className="container-x pt-6">
          <h2 className="sec-title mb-6">Calculate EMI</h2>
          <EMICalculator />
        </div>
      </section>

      <ImplementSection categories={categories} />
      <UpdatesSection videos={videos} />
      <NewsSection news={news} />
      <CommunitySection />
      <OfferingsSection />
      <AboutSection />
    </div>
  );
}
