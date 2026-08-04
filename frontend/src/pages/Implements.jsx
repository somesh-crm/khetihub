import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { ImplementCard, Spinner } from '../components/Cards.jsx';
import { IMPLEMENT_CATEGORIES } from '../lib/constants.js';

export default function Implements() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const { data: categories } = useFetch(api.implementCategories, []);
  const { data, loading } = useFetch(() => api.implements(category), [category]);

  const allCount = (categories || []).reduce((s, c) => s + c.count, 0);

  return (
    <div className="container-x pt-6 pb-8">
      <h1 className="text-xl font-extrabold text-gray-900">Tractor Implements</h1>
      <p className="text-sm text-gray-500 mt-1">Ploughs, cultivators, rotavators, harvesters and more farm equipment</p>

      <div className="hscroll hide-scrollbar mt-4">
        <button onClick={() => setParams({}, { replace: true })}
          className={`chip ${!category ? 'chip-active' : ''}`}>All ({allCount})</button>
        {IMPLEMENT_CATEGORIES.map((c) => {
          const cat = (categories || []).find((x) => x.category === c);
          return (
            <button key={c} onClick={() => setParams({ category: c }, { replace: true })}
              className={`chip ${category === c ? 'chip-active' : ''}`}>
              {c} {cat ? `(${cat.count})` : ''}
            </button>
          );
        })}
      </div>

      {loading ? <Spinner /> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
          {data?.map((i) => <ImplementCard key={i.id} implement={i} fluid />)}
          {data?.length === 0 && <div className="col-span-full text-center py-16 text-gray-400">No implements found.</div>}
        </div>
      )}
    </div>
  );
}
