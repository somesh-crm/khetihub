import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, formatPrice, formatDate } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { Spinner } from '../components/Cards.jsx';
import { IconPhone, IconMapPin, IconCalendar, IconClock, IconUser, IconShare } from '../components/Icons.jsx';

export default function UsedDetail() {
  const { id } = useParams();
  const { data, loading } = useFetch(() => api.usedListing(id), [id]);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (loading) return <Spinner />;
  if (!data) return <div className="container-x pt-10 text-center text-gray-500">Listing not found</div>;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.submitLead({ ...leadForm, page: `Used: ${data.title}` });
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-x pt-6 pb-8">
      <div className="card">
        <img src={data.image} alt={data.title} className="w-full h-52 object-cover" />
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <span className="pill bg-accent-50 text-accent-500">{data.status}</span>
          <h1 className="text-xl font-extrabold text-gray-900 mt-2 leading-tight">{data.title}</h1>
        </div>
        <button className="p-2 rounded-full border border-gray-200 text-gray-500 active:bg-gray-100"><IconShare className="h-5 w-5" /></button>
      </div>

      <div className="mt-3 text-2xl font-black text-kheti-900">{formatPrice(data.price)}</div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <InfoBox icon={<IconCalendar className="h-4 w-4" />} label="Year" value={data.year} />
        <InfoBox icon={<IconClock className="h-4 w-4" />} label="Hours Used" value={`${data.hours} hrs`} />
        <InfoBox icon={<IconMapPin className="h-4 w-4" />} label="Location" value={`${data.location}, ${data.state}`} />
        <InfoBox icon={<IconUser className="h-4 w-4" />} label="Owner" value={data.owner || 'Private'} />
      </div>

      <div className="card p-4 mt-5">
        <h2 className="font-bold text-gray-900 mb-2">Description</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{data.description || 'No description provided by the seller.'}</p>
      </div>

      <div className="card p-4 mt-5">
        <h2 className="font-bold text-gray-900 mb-3">Contact Seller</h2>
        {submitted ? (
          <div className="text-center py-6">
            <p className="font-bold text-gray-900">Enquiry Sent!</p>
            <p className="text-sm text-gray-500 mt-1">The seller will contact you soon.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input required value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
              placeholder="Your Name" className="w-full rounded-lg border border-gray-300 p-3 text-sm" />
            <input required type="tel" pattern="[0-9]{10}" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
              placeholder="10 Digit Mobile Number" className="w-full rounded-lg border border-gray-300 p-3 text-sm" />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" className="btn-accent w-full">Send Enquiry</button>
          </form>
        )}
      </div>

      <Link to="/used" className="mt-6 inline-block text-sm font-bold text-kheti-900">Back to Used Tractors</Link>
    </div>
  );
}

function InfoBox({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-2.5">
      <span className="h-8 w-8 rounded-lg bg-kheti-50 text-kheti-900 flex items-center justify-center shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="text-[10px] font-bold text-gray-400 uppercase">{label}</div>
        <div className="text-sm font-bold text-gray-800 truncate">{value}</div>
      </div>
    </div>
  );
}
