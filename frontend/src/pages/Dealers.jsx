import { useState } from 'react';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { Spinner } from '../components/Cards.jsx';
import { IconMapPin, IconPhone, IconMail, IconStar } from '../components/Icons.jsx';

export default function Dealers() {
  const { data: brands } = useFetch(api.brands, []);
  const { data: states } = useFetch(api.states, []);
  const [filters, setFilters] = useState({ state: '', brand: '', city: '' });
  const { data, loading } = useFetch(() => api.dealers(filters), [filters.state, filters.brand, filters.city]);

  return (
    <div className="container-x pt-6 pb-8">
      <h1 className="text-xl font-extrabold text-gray-900">Locate Tractor Dealers</h1>
      <p className="text-sm text-gray-500 mt-1">Find authorized dealers near you by state, city and brand</p>

      <div className="card p-4 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select value={filters.state} onChange={(e) => setFilters({ ...filters, state: e.target.value })}
          className="rounded-lg border border-gray-300 p-3 text-sm bg-white">
          <option value="">All States</option>
          {states?.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
          className="rounded-lg border border-gray-300 p-3 text-sm bg-white">
          <option value="">All Brands</option>
          {brands?.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
        </select>
        <input value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          placeholder="Search city..." className="rounded-lg border border-gray-300 p-3 text-sm" />
      </div>

      {loading ? <Spinner /> : (
        <div className="grid md:grid-cols-2 gap-3 mt-5">
          {data?.map((d) => (
            <div key={d.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{d.name}</h3>
                  <span className="inline-flex pill bg-kheti-50 text-kheti-900 mt-1">{d.brand}</span>
                </div>
                <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
                  <IconStar className="h-4 w-4 fill-amber-400" /> {d.rating}
                </span>
              </div>
              <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                <p className="flex items-start gap-2"><IconMapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" /> {d.address}, {d.city}, {d.state}</p>
                <p className="flex items-center gap-2"><IconPhone className="h-4 w-4 text-gray-400 shrink-0" /> {d.phone}</p>
                <p className="flex items-center gap-2"><IconMail className="h-4 w-4 text-gray-400 shrink-0" /> {d.email}</p>
              </div>
              <a href={`tel:${d.phone}`} className="btn-outline w-full mt-4 text-sm">Call Dealer</a>
            </div>
          ))}
          {data?.length === 0 && <div className="col-span-full text-center py-16 text-gray-400">No dealers found.</div>}
        </div>
      )}
    </div>
  );
}
