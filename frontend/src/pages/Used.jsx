import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { Spinner } from '../components/Cards.jsx';
import { IconSearch } from '../components/Icons.jsx';
import { UsedCard } from '../components/Cards.jsx';

export default function Used() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [state, setState] = useState(params.get('state') || '');
  const { data: states } = useFetch(api.states, []);
  const { data, loading } = useFetch(() => api.used({ q: params.get('q'), state: params.get('state') }), [params.get('q'), params.get('state')]);

  const apply = () => {
    const next = new URLSearchParams();
    if (q.trim()) next.set('q', q.trim());
    if (state) next.set('state', state);
    setParams(next, { replace: true });
  };

  return (
    <div className="container-x pt-6 pb-8">
      <h1 className="sec-title mb-4 md:mb-6">Buy Used Tractor</h1>
      <p className="text-sm text-gray-main">Value for money second-hand tractors from across India</p>

      <div className="rounded-2xl border border-gray-light bg-white p-4 shadow-card mt-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-light bg-white px-4 py-2.5">
            <IconSearch className="h-4 w-4 shrink-0 text-gray-main" />
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && apply()}
              placeholder="Search by brand or model..." className="flex-1 text-sm text-ink outline-none bg-transparent" />
          </div>
          <select value={state} onChange={(e) => setState(e.target.value)} className="rounded-full border border-gray-light bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-green-main">
            <option value="">All States</option>
            {states?.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={apply} className="btn-green-sm shrink-0 justify-center">Search</button>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <>
          <p className="text-sm text-gray-main mt-4">{data?.length || 0} Listings Found</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
            {data?.map((u) => <UsedCard key={u.id} listing={u} fluid />)}
            {data?.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-main">No used tractors found.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
