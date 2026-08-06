import { useState } from 'react';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { Spinner } from '../components/Cards.jsx';
import { IconMapPin, IconPhone, IconMail, IconStar } from '../components/Icons.jsx';

const inputCls = 'w-full rounded-lg border border-gray-light bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-green-main';

export default function Dealers() {
  const { data: brands } = useFetch(api.brands, []);
  const { data: states } = useFetch(api.states, []);
  const [filters, setFilters] = useState({ state: '', brand: '', city: '' });
  const { data, loading } = useFetch(() => api.dealers(filters), [filters.state, filters.brand, filters.city]);

  return (
    <div className="container-x pt-6 pb-8">
      <h1 className="sec-title mb-4 md:mb-6">Locate Tractor Dealers</h1>
      <p className="text-sm text-gray-main">Find authorized dealers near you by state, city and brand</p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-gray-light bg-white p-4 shadow-card">
        <select value={filters.state} onChange={(e) => setFilters({ ...filters, state: e.target.value })} className={inputCls}>
          <option value="">All States</option>
          {states?.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })} className={inputCls}>
          <option value="">All Brands</option>
          {brands?.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
        </select>
        <input value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          placeholder="Search city..." className={inputCls} />
      </div>

      {loading ? <Spinner /> : (
        <div className="grid md:grid-cols-2 gap-3 mt-5">
          {data?.map((d) => (
            <div key={d.id} className="rounded-2xl border border-gray-light bg-white p-4 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-ink">{d.name}</h3>
                  <span className="inline-block bg-green-lighter text-primary rounded-full px-2 py-0.5 text-xs font-bold mt-1">{d.brand}</span>
                </div>
                <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
                  <IconStar className="h-4 w-4 fill-amber-400" /> {d.rating}
                </span>
              </div>
              <div className="mt-3 space-y-1.5 text-sm text-gray-main">
                <p className="flex items-start gap-2"><IconMapPin className="h-4 w-4 text-gray-dark mt-0.5 shrink-0" /> {d.address}, {d.city}, {d.state}</p>
                <p className="flex items-center gap-2"><IconPhone className="h-4 w-4 text-gray-dark shrink-0" /> {d.phone}</p>
                <p className="flex items-center gap-2"><IconMail className="h-4 w-4 text-gray-dark shrink-0" /> {d.email}</p>
              </div>
              <a href={`tel:${d.phone}`} className="btn-green-sm !bg-white !text-primary border border-primary hover:!bg-green-lighter w-full justify-center mt-4 text-sm">Call Dealer</a>
            </div>
          ))}
          {data?.length === 0 && <div className="col-span-full text-center py-16 text-gray-main">No dealers found.</div>}
        </div>
      )}
    </div>
  );
}
