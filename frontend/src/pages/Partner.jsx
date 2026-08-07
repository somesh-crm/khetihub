import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { IconCheck } from '../components/Icons.jsx';

const BENEFITS = [
  { title: 'Growing Market', desc: 'India is the world\'s largest tractor market — become an early partner in a fast-growing digital agri platform.' },
  { title: 'Qualified Leads', desc: 'Get verified farmer and buyer enquiries generated from our tractor, implement and used-vehicle traffic.' },
  { title: 'Brand Visibility', desc: 'Showcase your dealership, inventory and offers to millions of farmers across India.' },
  { title: 'No Registration Fee', desc: 'Partnering with KhetiHub is simple and free. Pay only for value-added services you choose.' }
];

const STEPS = [
  { n: '01', title: 'Apply Online', desc: 'Fill the form with your dealership or business details.' },
  { n: '02', title: 'Verification', desc: 'Our team verifies your documents and location within 48 hours.' },
  { n: '03', title: 'Go Live', desc: 'Start receiving enquiries and listing your inventory on KhetiHub.' }
];

const input = 'w-full rounded-lg border border-gray-light bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-green-main';

export default function Partner() {
  const [form, setForm] = useState({ name: '', phone: '', city: '', brand: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.submitLead({ name: form.name, phone: form.phone, message: `${form.city ? form.city + ' | ' : ''}${form.brand ? 'Interested in ' + form.brand : ''} | ${form.message}`.trim(), page: 'Partner Enquiry' });
      setSubmitted(true);
    } catch { /* noop */ }
  };

  return (
    <div className="container-x pt-6 pb-8">
      {/* Hero */}
      <section className="rounded-2xl bg-green-dark-gradient px-6 py-8 md:py-10 text-white text-center">
        <h1 className="text-2xl md:text-4xl font-bold">Partner With KhetiHub</h1>
        <p className="mt-2 max-w-xl mx-auto text-white/85 text-sm md:text-base">
          Join India's trusted tractor marketplace. Grow your dealership with thousands of farmer enquiries.
        </p>
        <a href="#partner-form" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-primary hover:bg-green-lighter transition">
          Become a Partner
        </a>
      </section>

      {/* Benefits */}
      <section className="mt-8">
        <h2 className="sec-title mb-4">Why Partner With KhetiHub</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-2xl border border-gray-light bg-white p-5 shadow-card transition-all duration-300 hover:border-secondary hover:bg-green-lighter">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-mint/60 text-primary">
                <IconCheck className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-bold text-ink">{b.title}</h3>
              <p className="mt-1 text-sm text-gray-main leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-8">
        <h2 className="sec-title mb-4">How It Works</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl bg-green-lighter p-5">
              <span className="text-3xl font-black text-primary/40">{s.n}</span>
              <h3 className="mt-1 font-bold text-ink">{s.title}</h3>
              <p className="mt-1 text-sm text-gray-main">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enquiry form */}
      <section id="partner-form" className="mt-8">
        <div className="rounded-2xl border border-gray-light bg-white p-5 md:p-7 shadow-card">
          <h2 className="sec-title mb-1">Dealership Enquiry</h2>
          <p className="text-sm text-gray-main mb-4">Fill in your details and our team will reach out within 48 hours.</p>
          {submitted ? (
            <div className="text-center py-10">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-mint text-primary"><IconCheck className="h-8 w-8" /></span>
              <h3 className="mt-4 text-xl font-bold text-ink">Thank You for Your Interest!</h3>
              <p className="mt-1 text-sm text-gray-main">Our partnership team will contact you shortly.</p>
              <Link to="/" className="btn-green mt-5">Back to Home</Link>
            </div>
          ) : (
            <form onSubmit={submit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name" className={input} />
              <input required type="tel" pattern="[0-9]{10}" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10 Digit Mobile Number" className={input} />
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City / District" className={input} />
              <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className={input}>
                <option value="">Select Brand Interest (optional)</option>
                <option>Mahindra</option>
                <option>Swaraj</option>
                <option>Sonalika</option>
                <option>John Deere</option>
                <option>New Holland</option>
                <option>Massey Ferguson</option>
                <option>Eicher</option>
                <option>Other</option>
              </select>
              <textarea rows="3" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message / dealership details" className={`${input} md:col-span-2`} />
              <div className="md:col-span-2">
                <button type="submit" className="btn-green !mx-0">Submit Enquiry</button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
