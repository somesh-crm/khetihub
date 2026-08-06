import { Link, useSearchParams } from 'react-router-dom';
import { api, formatPrice } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { ImplementTile, Spinner } from '../components/Cards.jsx';
import { IMPLEMENT_CATEGORIES } from '../lib/constants.js';

const chipCls = (active) => `tab-pill !px-4 ${active ? 'tab-pill-active' : 'tab-pill-inactive'}`;

function ImplementCard({ implement }) {
  return (
    <Link to={`/implements/${implement.slug}`} className="flex flex-col rounded-2xl border border-gray-light bg-white shadow-card transition-all duration-300 hover:border-secondary hover:bg-green-lighter hover:scale-[1.02]">
      <img src={implement.image} alt={implement.name} loading="lazy" className="h-32 w-full object-contain md:h-40" />
      <div className="flex flex-1 flex-col p-3">
        <span className="self-start bg-green-lighter text-primary rounded-full px-2 py-0.5 text-xs font-bold">{implement.category}</span>
        <h3 className="mt-2 text-sm font-bold text-ink line-clamp-2 leading-snug">{implement.name}</h3>
        <p className="mt-1 text-primary font-bold text-sm">{formatPrice(implement.price)}</p>
      </div>
    </Link>
  );
}

export default function Implements() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const { data: categories } = useFetch(api.implementCategories, []);
  const { data, loading } = useFetch(() => api.implements(category), [category]);

  const allCount = (categories || []).reduce((s, c) => s + c.count, 0);

  return (
    <div className="container-x pt-6 pb-8">
      <h1 className="sec-title mb-4 md:mb-6">Tractor Implements</h1>
      <p className="text-sm text-gray-main">Ploughs, cultivators, rotavators, harvesters and more farm equipment</p>

      <div className="hide-scrollbar mt-5 flex gap-2 overflow-x-auto">
        <button onClick={() => setParams({}, { replace: true })} className={chipCls(!category)}>All ({allCount})</button>
        {IMPLEMENT_CATEGORIES.map((c) => {
          const cat = (categories || []).find((x) => x.category === c);
          return (
            <button key={c} onClick={() => setParams({ category: c }, { replace: true })} className={chipCls(category === c)}>
              {c} {cat ? `(${cat.count})` : ''}
            </button>
          );
        })}
      </div>

      <section className="mt-6">
        <h2 className="sec-title mb-3">Browse by Category</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {(categories || []).map((c) => (
            <ImplementTile key={c.category} name={c.category} count={c.count} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="sec-title mb-3">{category || 'All Implements'}</h2>
        {loading ? <Spinner /> : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {data?.map((i) => <ImplementCard key={i.id} implement={i} />)}
            {data?.length === 0 && <div className="col-span-full text-center py-16 text-gray-main">No implements found.</div>}
          </div>
        )}
      </section>
    </div>
  );
}
