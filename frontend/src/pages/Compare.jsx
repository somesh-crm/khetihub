import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useCompareStore } from '../store/compareStore.js';
import { useFetch } from '../lib/hooks.js';
import { Spinner } from '../components/Cards.jsx';
import { IconScale, IconX } from '../components/Icons.jsx';

const ROWS = [
  ['brand', 'Brand'],
  ['hp', 'Horsepower'],
  ['cylinders', 'Cylinders'],
  ['lift_capacity', 'Lift Capacity'],
  ['engine', 'Engine'],
  ['fuel', 'Fuel'],
  ['drive', 'Drive'],
  ['power_takeoff', 'Power Take-off'],
  ['transmission', 'Transmission'],
  ['fuel_tank', 'Fuel Tank'],
  ['tyres', 'Tyres'],
  ['weight', 'Weight'],
  ['warranty', 'Warranty']
];

export default function Compare() {
  const { tractors, remove, clear, toggle } = useCompareStore();
  const [params, setParams] = useSearchParams();

  const slugs = tractors.map((t) => t.slug).join(',');
  const { data, loading } = useFetch(() => (slugs ? Promise.all(slugs.split(',').map((s) => api.tractor(s))) : Promise.resolve([])), [slugs]);

  useEffect(() => {
    const add = params.get('add');
    if (add && !loading && data?.length) {
      const toAdd = add.split(',').slice(0, 3);
      toAdd.forEach((slug) => {
        const t = data.find((d) => d.slug === slug);
        if (t && !tractors.some((x) => x.id === t.id) && tractors.length < 3) toggle(t);
      });
      params.delete('add');
      setParams(params, { replace: true });
    }
  }, [params, data, loading, tractors, toggle, setParams]);

  const items = data || [];

  if (loading && !items.length) return <Spinner />;

  if (!items.length) {
    return (
      <div className="container-x pt-10 text-center">
        <IconScale className="h-12 w-12 mx-auto text-gray-light" />
        <h1 className="sec-title mt-4 mb-4 md:mb-6">Compare Tractors</h1>
        <p className="text-sm text-gray-main mt-2 max-w-sm mx-auto">
          Add up to 3 tractors to compare their specifications side by side. Use the compare button on any tractor.
        </p>
        <div className="flex flex-wrap gap-2 justify-center mt-6">
          <Link to="/tractors" className="btn-green-sm">Browse Tractors</Link>
          <Link to="/brands" className="btn-green-sm !bg-white !text-primary border border-primary hover:!bg-green-lighter">Browse Brands</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x pt-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="sec-title">Compare Tractors</h1>
        {items.length > 1 && (
          <button onClick={clear} className="text-xs font-bold text-red-500">Clear All</button>
        )}
      </div>
      <p className="text-sm text-gray-main mt-1">{items.length} of 3 added</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        {items.map((t) => (
          <div key={t.id} className="rounded-2xl border border-gray-light bg-white shadow-card relative overflow-hidden">
            <button onClick={() => remove(t.id)} className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 shadow text-gray-main active:scale-95">
              <IconX className="h-4 w-4" />
            </button>
            <Link to={`/tractor/${t.slug}`}>
              <img src={t.image} alt={t.name} className="w-full h-28 md:h-36 object-cover" />
            </Link>
            <div className="p-3">
              <span className="text-[10px] font-bold text-primary uppercase">{t.brand_name}</span>
              <h3 className="text-sm font-bold text-ink leading-snug mt-0.5 line-clamp-2">{t.name}</h3>
              <div className="mt-1 text-primary font-extrabold text-sm">₹ {t.price.toLocaleString('en-IN')}</div>
            </div>
          </div>
        ))}
        {items.length < 3 && (
          <Link to="/tractors" className="rounded-2xl border-2 border-dashed border-gray-light flex flex-col items-center justify-center p-6 text-gray-main hover:border-primary hover:text-primary bg-white">
            <span className="text-3xl font-light">+</span>
            <span className="text-xs font-semibold mt-1">Add Tractor</span>
          </Link>
        )}
      </div>

      <div className="overflow-x-auto mt-6 rounded-2xl border border-gray-light bg-white shadow-card">
        <table className="w-full text-sm min-w-[480px]">
          <tbody>
            <tr className="bg-header text-white">
              <th className="text-left p-3 font-bold w-32">Specification</th>
              {items.map((t) => (
                <th key={t.id} className="text-left p-3 font-bold">{t.name}</th>
              ))}
            </tr>
            {ROWS.map(([key, label]) => (
              <tr key={key} className="border-b border-gray-100">
                <td className="p-3 font-semibold text-gray-main">{label}</td>
                {items.map((t) => (
                  <td key={t.id} className="p-3 font-semibold text-ink">{t[key] || 'NA'}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-3 font-semibold text-gray-main">Price</td>
              {items.map((t) => (
                <td key={t.id} className="p-3 font-black text-primary">₹ {t.price.toLocaleString('en-IN')}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <Link to="/tractors" className="btn-green">Add More Tractors</Link>
      </div>
    </div>
  );
}
