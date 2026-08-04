import { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { IconMenu, IconSearch, IconX, IconChevronRight, IconScale } from './Icons.jsx';
import { DRAWER_MENU } from '../lib/constants.js';
import { useCompareStore } from '../store/compareStore.js';

const Logo = ({ light = true }) => (
  <span className="flex items-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-8 w-8">
      <rect width="64" height="64" rx="14" fill="#ffffff" opacity="0.95" />
      <rect x="6" y="30" width="34" height="20" rx="4" fill="#0f6b00" />
      <path d="M38 32 L50 38 L56 46 L44 48 L44 50 L14 50 Z" fill="#0f6b00" />
      <rect x="8" y="48" width="48" height="6" rx="3" fill="#0f6b00" />
      <circle cx="14" cy="56" r="6" fill="#f97316" />
      <circle cx="48" cy="56" r="6" fill="#f97316" />
      <rect x="8" y="14" width="18" height="8" rx="3" fill="#f97316" />
    </svg>
    <span className={`text-xl font-black tracking-tight ${light ? 'text-white' : 'text-kheti-900'}`}>
      Kheti<span className="text-accent-500">Hub</span>
    </span>
  </span>
);

const SearchOverlay = ({ open, onClose }) => {
  const [q, setQ] = useState('');
  const [results, setResults] = useState({ tractors: [], brands: [] });
  const navigate = useNavigate();

  const search = useCallback(async (term) => {
    if (!term.trim()) {
      setResults({ tractors: [], brands: [] });
      return;
    }
    try {
      const [tractors, brands] = await Promise.all([
        fetch(`/api/tractors?q=${encodeURIComponent(term)}`).then((r) => r.json()),
        fetch('/api/brands').then((r) => r.json())
      ]);
      setResults({
        tractors: (tractors || []).slice(0, 6),
        brands: (brands || []).filter((b) => b.name.toLowerCase().includes(term.toLowerCase())).slice(0, 4)
      });
    } catch {
      setResults({ tractors: [], brands: [] });
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(q), 250);
    return () => clearTimeout(t);
  }, [q, search]);

  useEffect(() => {
    if (open) {
      setQ('');
      setResults({ tractors: [], brands: [] });
    }
  }, [open]);

  if (!open) return null;

  const go = (to) => {
    onClose();
    navigate(to);
  };

  return (
    <div className="fixed inset-0 z-[70] bg-white flex flex-col">
      <div className="bg-kheti-900 px-4 py-4 rounded-b-3xl">
        <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-3 text-white">
          <IconSearch className="h-5 w-5 text-white/70" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Tractors..."
            className="flex-1 bg-transparent outline-none placeholder:text-white/60 text-white"
          />
          {q && (
            <button onClick={() => setQ('')} className="p-1">
              <IconX className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {!q && (
          <p className="text-sm text-gray-500 mt-2">
            Search by tractor name, brand, HP or fuel. E.g. "Mahindra", "575", "50 HP".
          </p>
        )}
        {results.brands.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Brands</h3>
            {results.brands.map((b) => (
              <button
                key={b.id}
                onClick={() => go(`/brand/${b.slug}`)}
                className="w-full flex items-center justify-between py-3 border-b border-gray-100 text-left"
              >
                <span className="font-semibold text-gray-800">{b.name}</span>
                <IconChevronRight className="h-4 w-4 text-gray-300" />
              </button>
            ))}
          </div>
        )}
        {results.tractors.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Tractors</h3>
            {results.tractors.map((t) => (
              <button
                key={t.id}
                onClick={() => go(`/tractor/${t.slug}`)}
                className="w-full flex items-center gap-3 py-3 border-b border-gray-100 text-left"
              >
                <img src={t.image} alt={t.name} className="h-12 w-16 rounded-lg object-cover bg-gray-100" />
                <span className="flex-1">
                  <span className="block font-semibold text-gray-800 text-sm">{t.name}</span>
                  <span className="block text-xs text-gray-500">{t.hp} HP - {t.fuel}</span>
                </span>
                <span className="text-sm font-bold text-kheti-900">₹ {t.price.toLocaleString('en-IN')}</span>
              </button>
            ))}
          </div>
        )}
        {q && results.tractors.length === 0 && results.brands.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No results found</p>
        )}
      </div>
    </div>
  );
};

const Drawer = ({ open, onClose }) => {
  const [openGroups, setOpenGroups] = useState({});
  useEffect(() => {
    if (open) setOpenGroups({});
  }, [open]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full w-[300px] max-w-[85vw] bg-white z-[65] shadow-float transition-transform duration-300 flex flex-col ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="bg-kheti-900 px-5 py-4 flex items-center justify-between rounded-br-2xl">
          <Logo />
          <button onClick={onClose} className="text-white p-1">
            <IconX className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {DRAWER_MENU.map((group) => {
            const isOpen = openGroups[group.heading] ?? group.heading === 'Tractor Brands';
            return (
              <div key={group.heading} className="border-b border-gray-100">
                <button
                  onClick={() => setOpenGroups({ ...openGroups, [group.heading]: !isOpen })}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-bold text-gray-800"
                >
                  {group.heading}
                  <IconChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                {isOpen && (
                  <div className="pb-2">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.label}
                        to={item.to}
                        onClick={onClose}
                        className="block px-5 py-2.5 text-sm text-gray-600 hover:bg-kheti-50"
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t border-gray-100">
          <Link to="/sell" onClick={onClose} className="btn-accent w-full">
            Sell Your Tractor
          </Link>
        </div>
      </div>
    </>
  );
};

const Header = () => {
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const compareCount = useCompareStore((s) => s.tractors.length);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-kheti-900 text-white rounded-b-3xl shadow-lg">
        <div className="container-x">
          <div className="flex items-center gap-3 pt-3 pb-2">
            <button onClick={() => setDrawer(true)} className="p-1 -ml-1" aria-label="Menu">
              <IconMenu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex-1">
              <Logo />
            </Link>
            <Link to="/compare" className="relative p-2" aria-label="Compare">
              <IconScale className="h-6 w-6" />
              {compareCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </Link>
          </div>
          <button
            onClick={() => setSearch(true)}
            className="w-full mb-3 flex items-center gap-2 rounded-full bg-white/15 px-4 py-2.5 text-white/80 text-sm active:bg-white/25 transition"
          >
            <IconSearch className="h-4 w-4" />
            Search Tractors...
          </button>
        </div>
      </header>

      <Drawer open={drawer} onClose={() => setDrawer(false)} />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />

      <main className="pt-[108px]">
        <Outlet />
      </main>

      <footer className="bg-kheti-900 text-white mt-10">
        <div className="container-x py-8">
          <div className="flex items-center justify-between mb-6">
            <Logo />
            <span className="text-xs text-white/60">Made in India</span>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-bold mb-3">KhetiHub Offerings</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link to="/tractors" className="hover:text-white">New Tractor</Link></li>
                <li><Link to="/compare" className="hover:text-white">Compare Tractor</Link></li>
                <li><Link to="/used" className="hover:text-white">Buy Second Hand Tractor</Link></li>
                <li><Link to="/sell" className="hover:text-white">Sell Second Hand Tractor</Link></li>
                <li><Link to="/emi" className="hover:text-white">EMI Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Tractor Gyan Info</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link to="/tractors?mini=1" className="hover:text-white">Mini Tractor</Link></li>
                <li><Link to="/implements" className="hover:text-white">Tractor Implement</Link></li>
                <li><Link to="/dealers" className="hover:text-white">Tractor Dealer</Link></li>
                <li><Link to="/news" className="hover:text-white">Tractor News</Link></li>
                <li><Link to="/videos" className="hover:text-white">Tractor Videos</Link></li>
                <li><Link to="/admin" className="hover:text-white">Admin</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-5 border-t border-white/10 text-xs text-white/50">
            <p>© 2026 KhetiHub Technologies Pvt Ltd. All rights reserved.</p>
            <p className="mt-1">Prices are indicative and based on internal research and may vary across locations.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default function Layout() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return <Header />;
}
