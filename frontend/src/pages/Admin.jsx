import { useEffect, useState } from 'react';
import { admin, api, formatDate } from '../lib/api.js';
import { Spinner } from '../components/Cards.jsx';

const TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'sell_requests', label: 'Sell Requests' },
  { key: 'leads', label: 'Leads' },
  { key: 'brands', label: 'Brands' },
  { key: 'tractors', label: 'Tractors' },
  { key: 'implements', label: 'Implements' },
  { key: 'used_listings', label: 'Used Listings' },
  { key: 'news', label: 'News' },
  { key: 'videos', label: 'Videos' },
  { key: 'dealers', label: 'Dealers' }
];

export default function Admin() {
  const [tab, setTab] = useState('dashboard');
  return (
    <div className="container-x pt-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">KhetiHub Admin / CRM</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage tractors, products, listings and customer requests</p>
        </div>
        <span className="pill bg-amber-50 text-amber-600">Demo</span>
      </div>

      <div className="hscroll hide-scrollbar mt-4">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`chip ${tab === t.key ? 'chip-active' : ''}`}>{t.label}</button>
        ))}
      </div>

      <div className="mt-4">
        {tab === 'dashboard' && <Dashboard onNavigate={setTab} />}
        {tab === 'sell_requests' && <SellRequests />}
        {tab === 'leads' && <Leads />}
        {['brands', 'tractors', 'implements', 'used_listings', 'news', 'videos', 'dealers'].includes(tab) && (
          <TableAdmin table={tab} />
        )}
      </div>
    </div>
  );
}

function Dashboard({ onNavigate }) {
  const { data, loading } = useDash();
  if (loading) return <Spinner />;
  const stats = [
    ['Brands', data.brands, 'brands'],
    ['Tractors', data.tractors, 'tractors'],
    ['Implements', data.implements, 'implements'],
    ['Used Listings', data.used, 'used_listings'],
    ['News', data.news, 'news'],
    ['Videos', data.videos, 'videos'],
    ['Dealers', data.dealers, 'dealers']
  ];
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(([label, count, key]) => (
          <button key={key} onClick={() => onNavigate(key)} className="card p-4 text-left active:scale-[0.98] transition">
            <div className="text-2xl font-black text-kheti-900">{count}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">{label}</div>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-5">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Recent Sell Requests</h3>
            <span className="pill bg-accent-50 text-accent-500">{data.pendingSell} New</span>
            <button onClick={() => onNavigate('sell_requests')} className="text-xs font-bold text-kheti-900">View All</button>
          </div>
          {data.recentSellRequests.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No sell requests yet</p>}
          {data.recentSellRequests.map((r) => (
            <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <div className="text-sm font-semibold text-gray-800">{r.name} - {r.brand} {r.model}</div>
                <div className="text-xs text-gray-400">{r.location} {r.state} - ₹ {r.expected_price.toLocaleString('en-IN')}</div>
              </div>
              <span className="pill bg-kheti-50 text-kheti-900">{r.status}</span>
            </div>
          ))}
        </div>

        <div className="card p-4">
          <h3 className="font-bold text-gray-900 mb-3">Recent Enquiries</h3>
          {data.recentLeads.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No enquiries yet</p>}
          {data.recentLeads.map((l) => (
            <div key={l.id} className="py-2 border-b border-gray-50 last:border-0">
              <div className="text-sm font-semibold text-gray-800">{l.name} - {l.phone}</div>
              <div className="text-xs text-gray-400">{l.page || 'General'} - {l.created_at}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function useDash() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    admin.dashboard().then(setData).finally(() => setLoading(false));
  }, []);
  return { data, loading };
}

const SELL_STATUSES = ['New', 'Contacted', 'In Negotiation', 'Sold', 'Rejected'];

function SellRequests() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const load = () => admin.sellRequests().then(setRows).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);
  if (!rows) return <Spinner />;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">
        <thead className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase">
          <tr>
            <th className="p-3">Seller</th>
            <th className="p-3">Vehicle</th>
            <th className="p-3">Price</th>
            <th className="p-3">Location</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-gray-100">
              <td className="p-3">
                <div className="font-semibold text-gray-800">{r.name}</div>
                <div className="text-xs text-gray-400">{r.phone}</div>
              </td>
              <td className="p-3 font-semibold text-gray-800">{r.brand} {r.model}<div className="text-xs text-gray-400">Year {r.year} · {r.hours} hrs</div></td>
              <td className="p-3 font-bold text-kheti-900">₹ {r.expected_price.toLocaleString('en-IN')}</td>
              <td className="p-3 text-gray-600">{r.location}, {r.state}</td>
              <td className="p-3">
                <select value={r.status} onChange={(e) => admin.updateSellStatus(r.id, e.target.value).then(load)}
                  className="rounded-lg border border-gray-300 p-1.5 text-xs bg-white">
                  {SELL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td className="p-3 text-xs text-gray-400">{formatDate(r.created_at.slice(0, 10))}</td>
              <td className="p-3">
                <button onClick={() => admin.remove('sell_requests', r.id).then(load)}
                  className="text-xs font-bold text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Leads() {
  const [rows, setRows] = useState(null);
  const load = () => admin.leads().then(setRows);
  useEffect(() => { load(); }, []);
  if (!rows) return <Spinner />;
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm min-w-[600px]">
        <thead className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase">
          <tr><th className="p-3">Name</th><th className="p-3">Phone</th><th className="p-3">Page</th><th className="p-3">Message</th><th className="p-3">Date</th><th className="p-3">Actions</th></tr>
        </thead>
        <tbody>
          {rows.map((l) => (
            <tr key={l.id} className="border-t border-gray-100">
              <td className="p-3 font-semibold text-gray-800">{l.name}</td>
              <td className="p-3 text-gray-600">{l.phone}</td>
              <td className="p-3 text-xs text-kheti-900">{l.page || '-'}</td>
              <td className="p-3 text-xs text-gray-500 max-w-[240px] truncate">{l.message || '-'}</td>
              <td className="p-3 text-xs text-gray-400">{formatDate(l.created_at.slice(0, 10))}</td>
              <td className="p-3">
                <button onClick={() => admin.removeLead(l.id).then(load)} className="text-xs font-bold text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Generic table admin with inline create + edit + delete
const CONFIGS = {
  brands: {
    label: 'Brand',
    fields: [
      ['name', 'text'], ['slug', 'text'], ['country', 'text'], ['color', 'color'],
      ['is_mini', 'checkbox'], ['description', 'textarea']
    ],
    cols: ['name', 'country', 'model_count', 'is_mini']
  },
  tractors: {
    label: 'Tractor',
    fields: [
      ['brand_id', 'brand'], ['name', 'text'], ['price', 'number'], ['hp', 'number'], ['cylinders', 'number'],
      ['lift_capacity', 'text'], ['fuel', 'text'], ['drive', 'text'], ['category', 'text'],
      ['is_mini', 'checkbox'], ['is_latest', 'checkbox'], ['is_popular', 'checkbox'],
      ['description', 'textarea'], ['features', 'json']
    ],
    cols: ['name', 'brand_id', 'hp', 'price', 'fuel', 'is_popular']
  },
  implements: {
    label: 'Implement',
    fields: [['category', 'text'], ['name', 'text'], ['price', 'number'], ['description', 'textarea']],
    cols: ['name', 'category', 'price']
  },
  used_listings: {
    label: 'Used Listing',
    fields: [['title', 'text'], ['brand', 'text'], ['model', 'text'], ['price', 'number'], ['year', 'number'], ['hours', 'number'], ['location', 'text'], ['state', 'text'], ['owner', 'text'], ['phone', 'text'], ['status', 'text'], ['description', 'textarea']],
    cols: ['title', 'price', 'year', 'location', 'state', 'status']
  },
  news: {
    label: 'News Article',
    fields: [['title', 'text'], ['excerpt', 'textarea'], ['body', 'textarea'], ['date', 'date']],
    cols: ['title', 'date']
  },
  videos: {
    label: 'Video',
    fields: [['title', 'text'], ['youtube_id', 'text'], ['views', 'number'], ['duration', 'text'], ['type', 'text']],
    cols: ['title', 'views', 'duration', 'type']
  },
  dealers: {
    label: 'Dealer',
    fields: [['name', 'text'], ['brand', 'text'], ['city', 'text'], ['state', 'text'], ['address', 'textarea'], ['phone', 'text'], ['email', 'text'], ['rating', 'number']],
    cols: ['name', 'brand', 'city', 'state', 'rating']
  }
};

function TableAdmin({ table }) {
  const cfg = CONFIGS[table];
  const [rows, setRows] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');

  const load = () => admin.list(table).then(setRows).catch((e) => setError(e.message));
  useEffect(() => { load(); }, [table]);

  const blank = () => Object.fromEntries(cfg.fields.map(([k, t]) => [k, t === 'checkbox' ? 0 : t === 'number' ? 0 : '']));

  const startEdit = (row) => {
    const f = { ...blank(), ...row };
    if (f.features && Array.isArray(f.features)) f.features = f.features.join('\n');
    if (f.brand_id && !f.brand_name) {
      // keep as is; brand select handled specially
    }
    setEditing(row.id);
    setForm(f);
  };

  const save = async () => {
    setError('');
    const payload = { ...form };
    if (payload.features) {
      payload.features = JSON.stringify(payload.features.split('\n').map((s) => s.trim()).filter(Boolean));
    } else if ('features' in payload) payload.features = '[]';
    cfg.fields.forEach(([k, t]) => {
      if (t === 'number' && payload[k] !== '' && payload[k] != null) payload[k] = Number(payload[k]);
      if (t === 'checkbox') payload[k] = payload[k] ? 1 : 0;
    });
    try {
      if (editing) await admin.update(table, editing, payload);
      else await admin.create(table, payload);
      setEditing(null);
      setForm({});
      load();
    } catch (e) {
      setError(e.message || 'Save failed');
    }
  };

  const brandName = (id) => brandCache[id] || id;

  if (!rows) return <Spinner />;

  return (
    <div className="card overflow-x-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">{cfg.label}s ({rows.length})</h3>
        <button onClick={() => { setEditing('new'); setForm(blank()); }} className="btn-primary text-sm">+ Add {cfg.label}</button>
      </div>

      {(editing !== null) && (
        <div className="bg-gray-50 rounded-xl p-4 mb-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cfg.fields.map(([k, type]) => {
            const val = type === 'brand' ? (brandName(form[k]) === form[k] ? form[k] : form[k]) : form[k];
            return (
              <div key={k}>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">{k}</label>
                {type === 'textarea' && <textarea rows="2" value={form[k] || ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="w-full rounded-lg border border-gray-300 p-2 text-sm" />}
                {type === 'checkbox' && <input type="checkbox" checked={!!form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.checked ? 1 : 0 })} className="mt-2 h-5 w-5" />}
                {type === 'brand' && <BrandSelect value={form.brand_id || ''} onChange={(v) => setForm({ ...form, brand_id: v })} />}
                {type === 'color' && <input type="color" value={form[k] || '#0f6b00'} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="h-10 w-full rounded-lg border border-gray-300" />}
                {type === 'json' && <textarea rows="2" value={form[k] || ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} placeholder="One feature per line" className="w-full rounded-lg border border-gray-300 p-2 text-sm" />}
                {!['textarea', 'checkbox', 'brand', 'color', 'json'].includes(type) && (
                  <input type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'} value={val ?? ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="w-full rounded-lg border border-gray-300 p-2 text-sm" />
                )}
              </div>
            );
          })}
          <div className="sm:col-span-2 lg:col-span-3 flex gap-2">
            {error && <p className="text-red-500 text-xs self-center">{error}</p>}
            <button onClick={save} className="btn-primary text-sm">{editing === 'new' ? 'Create' : 'Save Changes'}</button>
            <button onClick={() => { setEditing(null); setForm({}); }} className="btn-outline text-sm">Cancel</button>
          </div>
        </div>
      )}

      <table className="w-full text-sm min-w-[600px]">
        <thead className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase">
          <tr>
            <th className="p-3">#</th>
            {cfg.cols.map((c) => <th key={c} className="p-3">{c}</th>)}
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} className="border-t border-gray-100">
              <td className="p-3 text-gray-400">{i + 1}</td>
              {cfg.cols.map((c) => {
                let v = r[c];
                if (c === 'brand_id') v = brandName(v);
                if (c === 'is_popular' || c === 'is_latest' || c === 'is_mini') v = v ? 'Yes' : 'No';
                if (typeof v === 'number' && c.toLowerCase().includes('price')) v = '₹ ' + v.toLocaleString('en-IN');
                return <td key={c} className="p-3 text-gray-700 font-medium max-w-[200px] truncate">{String(v ?? '-')}</td>;
              })}
              <td className="p-3 whitespace-nowrap">
                <button onClick={() => startEdit(r)} className="text-xs font-bold text-kheti-900 hover:underline mr-3">Edit</button>
                <button onClick={() => { if (confirm(`Delete ${cfg.label}?`)) admin.remove(table, r.id).then(load); }} className="text-xs font-bold text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const brandCache = {};
let brandList = [];
function BrandSelect({ value, onChange }) {
  const [brands, setBrands] = useState(brandList);
  useEffect(() => {
    if (brandList.length) { setBrands(brandList); return; }
    api.brands().then((b) => { brandList = b; b.forEach((x) => { brandCache[x.id] = x.name; }); setBrands(b); });
  }, []);
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-300 p-2 text-sm bg-white">
      <option value="">Select Brand</option>
      {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
    </select>
  );
}
