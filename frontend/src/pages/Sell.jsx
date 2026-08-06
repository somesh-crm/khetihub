import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../lib/api.js';

export default function Sell() {
  const [params] = useSearchParams();
  const [type, setType] = useState(params.get('type') === 'implement' ? 'implement' : 'tractor');
  const [form, setForm] = useState({
    name: '', phone: '', brand: '', model: '', year: '', expected_price: '',
    location: '', state: '', hours: '', condition: 'Good', notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      await api.submitSellRequest({ ...form, year: Number(form.year) || 0, expected_price: Number(form.expected_price) || 0, hours: Number(form.hours) || 0 });
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const input = 'w-full rounded-lg border border-gray-light bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-green-main';
  const label = 'text-xs font-bold text-gray-dark uppercase mb-1 block';

  if (submitted) {
    return (
      <div className="container-x pt-10 pb-16 text-center max-w-md">
        <div className="h-16 w-16 mx-auto rounded-full bg-green-mint flex items-center justify-center text-3xl text-primary">✓</div>
        <h1 className="text-xl font-extrabold text-ink mt-4">Request Submitted!</h1>
        <p className="text-sm text-gray-main mt-2 leading-relaxed">
          Thank you {form.name.split(' ')[0] || ''}! Our team will contact you at <b>{form.phone}</b> to verify details and list your {type === 'implement' ? 'implement' : 'tractor'} on KhetiHub.
        </p>
        <div className="flex gap-2 justify-center mt-6">
          <Link to="/used" className="btn-green-sm">Browse Used Tractors</Link>
          <Link to="/" className="btn-green-sm !bg-white !text-primary border border-primary hover:!bg-green-lighter">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x pt-6 pb-10 max-w-2xl">
      <h1 className="sec-title mb-4 md:mb-6">Sell Your {type === 'implement' ? 'Implement' : 'Tractor'}</h1>
      <p className="text-sm text-gray-main -mt-2">Connect with genuine buyers and get the best price</p>

      <div className="flex gap-2 mt-4">
        <button onClick={() => setType('tractor')} className={`flex-1 rounded-full py-3 text-sm font-bold transition ${type === 'tractor' ? 'bg-primary text-white' : 'bg-white border border-gray-light text-ink'}`}>
          Tractor
        </button>
        <button onClick={() => setType('implement')} className={`flex-1 rounded-full py-3 text-sm font-bold transition ${type === 'implement' ? 'bg-primary text-white' : 'bg-white border border-gray-light text-ink'}`}>
          Implement
        </button>
      </div>

      <form onSubmit={submit} className="rounded-2xl border border-gray-light bg-white p-5 mt-4 space-y-4 shadow-card">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Your Name *</label>
            <input required value={form.name} onChange={set('name')} placeholder="Full name" className={input} />
          </div>
          <div>
            <label className={label}>Mobile Number *</label>
            <input required type="tel" pattern="[0-9]{10}" value={form.phone} onChange={set('phone')} placeholder="10 digit number" className={input} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Brand</label>
            <input value={form.brand} onChange={set('brand')} placeholder="e.g. Mahindra" className={input} />
          </div>
          <div>
            <label className={label}>{type === 'implement' ? 'Implement Name' : 'Model'}</label>
            <input value={form.model} onChange={set('model')} placeholder="e.g. 575 DI XP Plus" className={input} />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={label}>Year</label>
            <input type="number" min="1980" max="2026" value={form.year} onChange={set('year')} placeholder="2020" className={input} />
          </div>
          <div>
            <label className={label}>Expected Price (₹)</label>
            <input type="number" value={form.expected_price} onChange={set('expected_price')} placeholder="450000" className={input} />
          </div>
          <div>
            <label className={label}>Hours Used</label>
            <input type="number" value={form.hours} onChange={set('hours')} placeholder="1500" className={input} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>City / Village</label>
            <input value={form.location} onChange={set('location')} placeholder="e.g. Jaipur" className={input} />
          </div>
          <div>
            <label className={label}>State</label>
            <input value={form.state} onChange={set('state')} placeholder="e.g. Rajasthan" className={input} />
          </div>
        </div>
        <div>
          <label className={label}>Condition</label>
          <div className="flex flex-wrap gap-2">
            {['Excellent', 'Good', 'Fair', 'Needs Repair'].map((c) => (
              <button type="button" key={c} onClick={() => setForm({ ...form, condition: c })}
                className={`tab-pill !px-4 ${form.condition === c ? 'tab-pill-active' : 'tab-pill-inactive'}`}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <label className={label}>Additional Notes</label>
          <textarea rows="3" value={form.notes} onChange={set('notes')} placeholder="Any details like new tyres, service history, etc." className={input} />
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button type="submit" disabled={sending} className="btn-green-sm w-full justify-center disabled:opacity-60">
          {sending ? 'Submitting...' : 'Submit for Sale'}
        </button>
        <p className="text-[11px] text-gray-main text-center">Our team will verify the details and contact you within 24 hours.</p>
      </form>
    </div>
  );
}
