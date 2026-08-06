import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { IconMenu, IconSearch, IconX, IconChevronRight, IconChevronDown, IconScale, IconUser } from './Icons.jsx';
import { NAV_GROUPS, FOOTER_COLUMNS } from '../lib/constants.js';
import { useCompareStore } from '../store/compareStore.js';

const Logo = ({ dark = false }) => (
  <Link to="/" className="flex items-center gap-2 shrink-0">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-8 w-8">
      <rect width="64" height="64" rx="12" fill={dark ? '#0f6b00' : '#ffffff'} opacity="0.95" />
      <rect x="6" y="30" width="34" height="20" rx="4" fill={dark ? '#ffffff' : '#0f6b00'} />
      <path d="M38 32 L50 38 L56 46 L44 48 L44 50 L14 50 Z" fill={dark ? '#ffffff' : '#0f6b00'} />
      <rect x="8" y="48" width="48" height="6" rx="3" fill={dark ? '#ffffff' : '#0f6b00'} />
      <circle cx="14" cy="56" r="6" fill="#ff7a18" />
      <circle cx="48" cy="56" r="6" fill="#ff7a18" />
      <rect x="8" y="14" width="18" height="8" rx="3" fill="#ff7a18" />
    </svg>
    <span className={`text-xl font-black tracking-tight ${dark ? 'text-white' : 'text-white'}`}>
      Kheti<span className="text-orange-main">Hub</span>
    </span>
  </Link>
);

// ---------- Mobile search overlay ----------
const SearchOverlay = ({ open, onClose }) => {
  const [q, setQ] = useState('');
  const [results, setResults] = useState({ tractors: [], brands: [] });
  const navigate = useNavigate();

  const search = useCallback(async (term) => {
    if (!term.trim()) return setResults({ tractors: [], brands: [] });
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
    if (open) { setQ(''); setResults({ tractors: [], brands: [] }); }
  }, [open]);

  if (!open) return null;

  const go = (to) => { onClose(); navigate(to); };

  return (
    <div className="fixed inset-0 z-[80] bg-white flex flex-col">
      <div className="bg-header px-4 py-4 rounded-b-2xl">
        <div className="flex items-center gap-2 rounded-full border border-gray-silver bg-transparent px-4 py-3 text-white">
          <IconSearch className="h-5 w-5 text-white/70" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search for Tractors / Implements"
            className="flex-1 bg-transparent outline-none placeholder:text-white/60 text-white" />
          {q && <button onClick={() => setQ('')} className="p-1"><IconX className="h-4 w-4" /></button>}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {results.brands.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-bold text-gray-main uppercase mb-2">Brands</h3>
            {results.brands.map((b) => (
              <button key={b.id} onClick={() => go(`/brand/${b.slug}`)}
                className="w-full flex items-center justify-between py-3 border-b border-gray-100 text-left">
                <span className="font-semibold text-ink">{b.name}</span>
                <IconChevronRight className="h-4 w-4 text-gray-light" />
              </button>
            ))}
          </div>
        )}
        {results.tractors.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-main uppercase mb-2">Tractors</h3>
            {results.tractors.map((t) => (
              <button key={t.id} onClick={() => go(`/tractor/${t.slug}`)}
                className="w-full flex items-center gap-3 py-3 border-b border-gray-100 text-left">
                <img src={t.image} alt={t.name} className="h-12 w-16 rounded-lg object-cover bg-gray-100" />
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-ink text-sm truncate">{t.name}</span>
                  <span className="block text-xs text-gray-main">{t.hp} HP - {t.fuel}</span>
                </span>
                <span className="text-sm font-bold text-primary shrink-0">₹ {t.price.toLocaleString('en-IN')}</span>
              </button>
            ))}
          </div>
        )}
        {q && !results.tractors.length && !results.brands.length && (
          <p className="text-center text-gray-grey mt-10">No results found</p>
        )}
      </div>
    </div>
  );
};

// ---------- Mobile slide-in drawer ----------
const Drawer = ({ open, onClose }) => {
  const [openGroups, setOpenGroups] = useState({});
  useEffect(() => { if (open) setOpenGroups({}); }, [open]);

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-[70] transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 left-0 h-full w-[300px] max-w-[85vw] bg-white z-[75] shadow-float transition-transform duration-300 flex flex-col ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="bg-header px-5 py-4 flex items-center justify-between rounded-br-2xl">
          <Logo />
          <button onClick={onClose} className="text-white p-1"><IconX className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {NAV_GROUPS.map((group) => {
            const isOpen = openGroups[group.heading] ?? group.heading === 'Tractor Brands';
            return (
              <div key={group.heading} className="border-b border-gray-100">
                <div className="flex items-center justify-between px-5 py-3.5">
                  <Link to={group.to} onClick={onClose} className="text-sm font-bold text-ink">{group.heading}</Link>
                  <button onClick={() => setOpenGroups({ ...openGroups, [group.heading]: !isOpen })}>
                    <IconChevronDown className={`h-4 w-4 text-gray-grey transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {isOpen && (
                  <div className="pb-2 bg-gray-50/50">
                    {group.items.map((item) => (
                      <NavLink key={item.label} to={item.to} onClick={onClose}
                        className="block px-5 py-2.5 text-sm text-gray-grey border-l-2 border-transparent hover:border-primary hover:bg-green-lighter hover:text-primary">
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
          <Link to="/sell" onClick={onClose} className="btn-green-sm w-full justify-center">Sell Your Tractor</Link>
        </div>
      </div>
    </>
  );
};

// ---------- Mobile header (fixed, dark green, rounded bottom) ----------
const MobileHeader = ({ onMenu, onSearch }) => {
  const compareCount = useCompareStore((s) => s.tractors.length);
  return (
    <header className="fixed top-0 left-0 right-0 z-[60] bg-header text-white rounded-b-2xl shadow-nav lg:hidden">
      <div className="px-4">
        <div className="flex items-center gap-3 pt-3 pb-2">
          <button onClick={onMenu} className="p-1 -ml-1" aria-label="Menu"><IconMenu className="h-6 w-6" /></button>
          <div className="flex-1"><Logo /></div>
          <Link to="/compare" className="relative p-2" aria-label="Compare">
            <IconScale className="h-6 w-6" />
            {compareCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-orange-main text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {compareCount}
              </span>
            )}
          </Link>
        </div>
        <button onClick={onSearch}
          className="w-full mb-3 flex items-center gap-2 rounded-full border border-gray-silver px-4 py-2.5 text-white/80 text-sm bg-transparent active:bg-white/10 transition">
          <IconSearch className="h-4 w-4" />
          Search for Tractors / Implements
        </button>
      </div>
    </header>
  );
};

// ---------- Desktop header (utility bar + nav) ----------
const DesktopHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const compareCount = useCompareStore((s) => s.tractors.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setActiveDropdown(null);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const navItems = [
    { label: 'Home', to: '/', group: null },
    { label: 'Tractor Brands', to: '/brands', group: 'Tractor Brands' },
    { label: 'New Tractors', to: '/tractors', group: 'New Tractors' },
    { label: 'Used Tractor / Implement', to: '/used', group: 'Used Tractor / Implement' },
    { label: 'Implements', to: '/implements', group: 'Implements' },
    { label: 'Blogs & Videos', to: '/news', group: 'Blogs & Videos' }
  ];

  const group = NAV_GROUPS.find((g) => g.heading === activeDropdown);
  const showPanel = activeDropdown && group;

  return (
    <header className="hidden lg:block">
      {/* Utility bar */}
      <div className="bg-header text-white">
        <div className="container-x flex items-center gap-4 py-3">
          <Logo />
          <form onSubmit={(e) => e.preventDefault()} className="flex-1 flex items-center gap-2 rounded-full border border-gray-silver px-4 py-2 max-w-[500px]">
            <IconSearch className="h-4 w-4 text-white/60" />
            <input placeholder="Search for Tractors / Implements / Tyres"
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/60" />
          </form>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-white">English</span>
          </div>
          <Link to="/partner" className="text-xs text-white/80 hover:text-white border border-white/30 rounded-full px-3 py-1.5">Partner With Us</Link>
          <div className="flex items-center gap-2 rounded-full border border-gray-gainsboro px-3 py-1">
            <span className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center"><IconUser className="h-4 w-4" /></span>
            <span className="leading-tight">
              <span className="block font-medium">Login</span>
              <span className="block text-[10px] text-white/70">New User? Register</span>
            </span>
          </div>
        </div>
      </div>
      {/* Nav bar */}
      <nav className="bg-white relative z-50 shadow-nav border-b-[2px] border-primary">
        <div className="container-x flex items-stretch">
          {navItems.map((item) => (
            <div key={item.label} className="relative group"
              onMouseEnter={() => item.group && setActiveDropdown(item.group)}
              onMouseLeave={() => item.group && setActiveDropdown(null)}>
              <Link to={item.to}
                className="flex items-center gap-1.5 px-5 py-4 text-sm font-semibold text-gray-main border-b-4 border-transparent hover:text-primary hover:border-primary hover:bg-green-light transition">
                {item.label}
                {item.group && <IconChevronDown className={`h-3.5 w-3.5 transition-transform ${activeDropdown === item.group ? 'rotate-180' : ''}`} />}
              </Link>
            </div>
          ))}
          <div className="ml-auto flex items-center">
            <Link to="/compare" className="relative flex items-center gap-2 px-5 py-4 text-sm font-semibold text-gray-main hover:text-primary">
              <IconScale className="h-5 w-5 text-primary" />
              Compare
              {compareCount > 0 && (
                <span className="bg-orange-main text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">{compareCount}</span>
              )}
            </Link>
          </div>
        </div>
        {showPanel && (
          <div className="absolute left-0 right-0 top-full bg-white shadow-main border-t border-gray-100">
            <div className="container-x py-4">
              <div className={group.heading === 'Tractor Brands' ? 'grid grid-cols-2 gap-x-10 gap-y-1 max-w-[420px]' : 'columns-2 max-w-[560px] gap-10'}>
                {group.items.map((item) => (
                  <Link key={item.label} to={item.to} onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 py-2 text-sm font-medium text-gray-grey border-l-2 border-transparent hover:border-primary hover:bg-green-50 hover:text-primary">
                    <span className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{item.label[0]}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
              {group.heading === 'Tractor Brands' && (
                <Link to="/brands" onClick={() => setActiveDropdown(null)} className="inline-flex mt-3 rounded-lg py-1.5 text-sm font-semibold text-primary hover:bg-green-lighter px-2">
                  View All Brands →
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

// ---------- Footer (matching original columns) ----------
const Footer = () => {
  const socials = [
    { label: 'Facebook', count: '784.5K', cls: 'bg-[#1877f2]' },
    { label: 'Youtube', count: '276.8K', cls: 'bg-[#ff0000]' },
    { label: 'Instagram', count: '239.2K', cls: 'bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af]' },
    { label: 'Linkedin', count: '17.9K', cls: 'bg-[#0a66c2]' },
    { label: 'Whatsapp', count: '5.7K', cls: 'bg-[#25d366]' },
    { label: 'Twitter', count: '1.1K', cls: 'bg-[#000000]' }
  ];
  return (
    <footer className="bg-[#f4f7f4] pt-10 pb-5 border-t border-gray-light">
      <div className="container-x">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
          <Logo />
          <div>
            <h4 className="text-lg font-semibold text-ink mb-3">Follow Us On</h4>
            <div className="flex gap-2">
              {socials.map((s) => (
                <span key={s.label} title={s.label} className={`h-9 w-9 rounded-full ${s.cls} text-white flex items-center justify-center text-[10px] font-bold`}>
                  {s.label[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-3 inline-block border-b border-gray-grey pb-1 text-sm md:text-base font-semibold text-ink">{col.heading}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}><Link to={l.to} className="text-sm font-medium text-gray-grey hover:text-primary">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 max-w-[600px]">
          <h4 className="text-lg font-semibold text-ink mb-2">Subscribe to Newsletter</h4>
          <div className="flex gap-2">
            <input placeholder="Enter Email" className="flex-1 rounded-[40px] border border-gray-secondary bg-transparent px-5 py-2 text-sm outline-none focus:border-primary" />
            <button className="rounded-full bg-ink px-6 py-2 text-sm font-medium text-white hover:bg-primary transition">Subscribe</button>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-gainsboro pt-5">
          <h5 className="text-sm font-semibold text-ink mb-1">Disclaimer</h5>
          <p className="text-xs text-gray-main leading-relaxed">
            The information provided by KhetiHub on this site is for general informational purposes only. All the information is provided in good faith, however, we make no representation or warranty of any kind regarding the accuracy, adequacy, validity or completeness of any information on the Site.
          </p>
          <p className="text-xs text-gray-main mt-2">* Prices on our website are based on our internal research and may vary across locations.</p>
        </div>

        <p className="mt-6 text-center text-sm font-medium text-gray-main">© 2026 KhetiHub Technologies Pvt Ltd.</p>
      </div>
    </footer>
  );
};

export default function Layout() {
  const location = useLocation();
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDrawer(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <MobileHeader onMenu={() => setDrawer(true)} onSearch={() => setSearch(true)} />
      <DesktopHeader />
      <Drawer open={drawer} onClose={() => setDrawer(false)} />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />

      <main className="flex-1 pt-[104px] lg:pt-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
