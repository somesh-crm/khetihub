import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { HP_RANGES, BUDGET_RANGES, FUELS, DRIVES } from '../lib/constants.js';
import { TractorCard, Spinner } from '../components/Cards.jsx';
import { IconFilter, IconX } from '../components/Icons.jsx';

export default function Tractors() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(params.get('q') || '');
  const [applied, setApplied] = useState(false);

  const filters = useMemo(() => {
    const f = {};
    ['brand', 'minHp', 'maxHp', 'minPrice', 'maxPrice', 'fuel', 'drive', 'q', 'popular', 'latest', 'mini'].forEach((k) => {
      const v = params.get(k);
      if (v) f[k] = v;
    });
    return f;
  }, [params]);

  const { data, loading } = useFetch(() => api.tractors(filters), [JSON.stringify(filters)]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === '' || value === null || value === undefined) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const hpRange = filters.minHp !== undefined && filters.maxHp !== undefined
    ? HP_RANGES.find((r) => String(r.min) === String(filters.minHp) && String(r.max) === String(filters.maxHp))
    : null;
  const budget = filters.minPrice !== undefined && filters.maxPrice !== undefined
    ? BUDGET_RANGES.find((r) => String(r.min) === String(filters.minPrice) && String(r.max) === String(filters.maxPrice))
    : null;

  const title = hpRange ? `${hpRange.label} Tractors`
    : budget ? `${budget.label} Tractors`
    : filters.fuel ? `${filters.fuel} Tractors`
    : filters.popular ? 'Popular Tractors'
    : filters.latest ? 'Latest Tractors'
    : filters.mini ? 'Mini Tractors'
    : filters.q ? `Search: ${filters.q}`
    : 'All Tractors';

  useEffect(() => {
    setSearch(params.get('q') || '');
  }, [params]);

  const doSearch = () => {
    update('q', search);
    setApplied(!applied);
  };

  return (
    <div className="container-x pt-5">
      <h1 className="text-xl font-extrabold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-500 mt-0.5">{data?.length || 0} Tractors Found</p>

      <div className="flex gap-2 mt-4">
        <div className="flex-1 flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doSearch()}
            placeholder="Search tractors..."
            className="flex-1 text-sm outline-none bg-transparent"
          />
          <button onClick={doSearch} className="text-kheti-900 font-bold text-sm">Search</button>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold border transition ${showFilters ? 'bg-kheti-900 text-white border-kheti-900' : 'bg-white border-gray-300 text-gray-700'}`}
        >
          <IconFilter className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {hpRange && <FilterChip label={hpRange.label} onRemove={() => { update('minHp', ''); update('maxHp', ''); }} />}
        {budget && <FilterChip label={budget.label} onRemove={() => { update('minPrice', ''); update('maxPrice', ''); }} />}
        {filters.fuel && <FilterChip label={filters.fuel} onRemove={() => update('fuel', '')} />}
        {filters.drive && <FilterChip label={filters.drive} onRemove={() => update('drive', '')} />}
        {filters.q && <FilterChip label={`"${filters.q}"`} onRemove={() => { update('q', ''); setSearch(''); }} />}
      </div>

      {showFilters && (
        <div className="bg-white rounded-2xl shadow-card p-4 mt-3 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">By HP</h4>
            <div className="flex flex-wrap gap-2">
              {HP_RANGES.map((r) => {
                const active = hpRange?.label === r.label;
                return <button key={r.label} onClick={() => { update('minHp', r.min); update('maxHp', r.max); }}
                  className={`chip ${active ? 'chip-active' : ''}`}>{r.label}</button>;
              })}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">By Budget</h4>
            <div className="flex flex-wrap gap-2">
              {BUDGET_RANGES.map((r) => {
                const active = budget?.label === r.label;
                return <button key={r.label} onClick={() => { update('minPrice', r.min); update('maxPrice', r.max); }}
                  className={`chip ${active ? 'chip-active' : ''}`}>{r.label}</button>;
              })}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">By Fuel</h4>
            <div className="flex flex-wrap gap-2">
              {FUELS.map((f) => (
                <button key={f} onClick={() => update('fuel', f)}
                  className={`chip ${filters.fuel === f ? 'chip-active' : ''}`}>{f}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">By Drive</h4>
            <div className="flex flex-wrap gap-2">
              {DRIVES.map((d) => (
                <button key={d} onClick={() => update('drive', d)}
                  className={`chip ${filters.drive === d ? 'chip-active' : ''}`}>{d}</button>
              ))}
            </div>
          </div>
          <button
            onClick={() => { setParams({}, { replace: true }); setSearch(''); }}
            className="text-sm font-bold text-accent-500"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {loading ? <Spinner /> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
          {(data || []).map((t) => (
            <TractorCard key={t.id} tractor={t} fluid />
          ))}
          {data?.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-400">
              No tractors found. Try changing filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-kheti-900 text-white text-xs font-semibold pl-3 pr-1.5 py-1.5">
      {label}
      <button onClick={onRemove} className="p-0.5 rounded-full bg-white/20"><IconX className="h-3 w-3" /></button>
    </span>
  );
}
