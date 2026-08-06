import { Link } from 'react-router-dom';
import { IconScale, IconChevronRight, IconEye, IconShare, IconMapPin, IconArrowRight } from './Icons.jsx';
import { useCompareStore } from '../store/compareStore.js';
import { formatPrice, formatViews } from '../lib/api.js';

export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-8 w-8 border-4 border-green-mint border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export function SectionHeader({ title, to, linkLabel = 'View All' }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4 md:mb-6">
      <h2 className="sec-title">{title}</h2>
      {to && (
        <Link to={to} className="flex items-center gap-1 text-sm font-semibold text-primary whitespace-nowrap hover:text-secondary shrink-0">
          {linkLabel} <IconArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

// Spec bar: mint green with HP / Cylinder / Lifting Capacity (original)
export function SpecBar({ tractor, variant = 'default' }) {
  const cells = [
    { label: 'HP', value: tractor.hp },
    { label: 'Cylinder', value: tractor.cylinders },
    { label: 'Lifting Capacity', value: tractor.lift_capacity }
  ];
  const divider = variant === 'new' ? 'border-green-main' : 'border-primary';
  return (
    <div className="spec-bar">
      {cells.map((c, i) => (
        <div key={c.label} className={`spec-cell ${i < cells.length - 1 ? `border-r ${divider}` : ''}`}>
          <span className="w-full text-xs font-normal text-gray-dark truncate">{c.label}</span>
          <p className="w-full font-bold truncate max-w-[90px] md:max-w-[130px]">{c.value}</p>
        </div>
      ))}
    </div>
  );
}

// Compare button (scale icon) floating on cards
export function CompareButton({ tractor, className = '' }) {
  const { tractors, toggle } = useCompareStore();
  const inBasket = tractors.some((t) => t.id === tractor.id);
  const full = tractors.length >= 3;
  return (
    <button
      onClick={() => toggle(tractor)}
      disabled={!inBasket && full}
      title={full && !inBasket ? 'Max 3 tractors can be compared' : inBasket ? 'Remove from compare' : 'Add to compare'}
      className={`absolute top-2 right-2 z-10 p-2 rounded-full shadow transition active:scale-95 ${inBasket ? 'bg-primary text-white' : 'bg-white/90 text-primary'} disabled:opacity-40 ${className}`}
    >
      <IconScale className="h-4 w-4" />
    </button>
  );
}

// Popular / Latest tractor card (white, rounded-2xl, mint spec bar)
export function TractorCard({ tractor, variant = 'default', fluid = false }) {
  return (
    <div className={`${fluid ? 'w-full' : 'w-[260px] md:w-[280px]'} px-1.5 py-2`}>
      <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-light bg-white p-5 shadow-card transition-all duration-300 hover:border-secondary hover:bg-green-lighter hover:scale-[1.02] relative">
        <CompareButton tractor={tractor} />
        <div>
          <Link to={`/tractor/${tractor.slug}`} className="mb-2.5 line-clamp-2 min-h-[56px] text-lg font-semibold leading-6 text-ink hover:text-primary">
            {tractor.name}
          </Link>
          <Link to={`/tractor/${tractor.slug}`} className="view-pill mb-2">
            View Details <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3'><polyline points='9 18 15 12 9 6'/></svg>" className="h-2.5 w-2.5" alt="" />
          </Link>
        </div>
        <Link to={`/tractor/${tractor.slug}`} className="mb-4 block">
          <img src={tractor.image} alt={tractor.name} loading="lazy" className="m-auto object-contain h-[150px] md:h-[165px]" />
        </Link>
        <SpecBar tractor={tractor} variant={variant} />
      </div>
    </div>
  );
}

// Mini tractor card (portrait, overhanging mint spec bar)
export function MiniCard({ tractor, fluid = false }) {
  return (
    <div className={`${fluid ? 'w-full' : 'w-[220px]'} px-1.5 py-2 pb-8`}>
      <Link to={`/tractor/${tractor.slug}`}>
        <div className="mb-8 relative flex flex-col items-center justify-center rounded-lg border border-gray-light p-3 pb-10 shadow-bottom transition-all duration-300 hover:bg-green-lighter hover:scale-[1.02]">
          <img src={tractor.image} alt={tractor.name} loading="lazy" className="h-auto max-h-[200px] w-full max-w-[200px] px-2 object-contain" />
          <h3 className="mt-2 text-center font-semibold text-ink line-clamp-1">{tractor.name}</h3>
          <div className="absolute -bottom-5 flex h-full max-h-12 w-[90%] justify-between rounded-lg bg-green-mint px-2 py-1.5 text-center text-sm">
            <div className="px-1"><span className="block text-xs font-normal text-gray-dark">HP</span><p className="text-xs font-bold md:text-sm">{tractor.hp}</p></div>
            <div className="mx-1 border-x border-primary px-2"><span className="block text-xs font-normal text-gray-dark">Cylinder</span><p className="text-xs font-bold md:text-sm">{tractor.cylinders}</p></div>
            <div className="px-1"><span className="block text-xs font-normal text-gray-dark">Capacity</span><p className="text-xs font-bold md:text-sm">{tractor.lift_capacity}</p></div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Used tractor card with For Sell ribbon
export function UsedCard({ listing, fluid = false }) {
  return (
    <Link to={`/used/${listing.id}`} className={`${fluid ? 'w-full' : 'w-[270px]'}`}>
      <div className="relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-bottom transition-all duration-300 hover:shadow-xl hover:bg-green-lighter hover:scale-[1.02]">
        <div className="sell-ribbon">
          <div className="sell-ribbon-inner">{listing.status}</div>
        </div>
        <div className="mb-4 flex h-full flex-col justify-between">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <img src={listing.image} alt={listing.title} loading="lazy" className="h-full w-full object-contain object-bottom" />
          </div>
          <div className="px-3 pt-2">
            <div className="flex items-center gap-1 text-[14px] font-medium text-link">
              <IconMapPin className="h-4 w-4 shrink-0" />
              <span className="truncate text-gray-dark">{listing.location}, {listing.state}</span>
            </div>
          </div>
          <span className="line-clamp-2 min-h-[50px] px-3 pt-2 text-[18px] font-bold text-ink">{listing.title}</span>
          <div className="mx-auto flex w-full justify-between pb-2 text-center text-ink md:py-2">
            <div className="flex w-[50%] flex-col items-center gap-[2px] px-4">
              <div className="text-xs text-gray-dark">Year</div>
              <div className="text-md font-semibold">{listing.year}</div>
            </div>
            <div className="flex w-[50%] flex-col items-center gap-[2px] border-l border-green-lightest px-4">
              <div className="text-xs text-gray-dark">Price</div>
              <div className="text-md font-semibold">{formatPrice(listing.price)}</div>
            </div>
          </div>
          <div className="mt-2 flex w-full justify-end px-3 pb-3">
            <span className="view-pill-outline">
              View Details
              <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300522E' stroke-width='3'><polyline points='9 18 15 12 9 6'/></svg>" className="w-3" alt="" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Brand tile (white logo box + name)
export function BrandTile({ brand }) {
  return (
    <Link to={`/brand/${brand.slug}`} className="tile py-4 px-2">
      <span className="flex h-[60px] w-[70px] md:h-[60px] md:w-[80px] items-center justify-center rounded-xl bg-white">
        <span className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-black text-xl" style={{ backgroundColor: brand.color }}>
          {brand.name[0]}
        </span>
      </span>
      <span className="mt-2 text-center text-xs font-semibold text-ink line-clamp-1">{brand.name}</span>
    </Link>
  );
}

// Video card with play overlay
export function VideoCard({ video }) {
  return (
    <div className="px-1.5 py-2 w-[260px] md:w-[300px]">
      <div className="rounded-xl bg-white p-4 text-center shadow-card">
        <a href={`https://www.youtube.com/watch?v=${video.youtube_id}`} target="_blank" rel="noreferrer" className="relative block">
          <div className="relative h-[160px] overflow-hidden rounded-lg">
            <img src={video.thumbnail} alt={video.title} loading="lazy" className="h-full w-full object-cover" />
            <span className="absolute left-[42%] top-[30%] flex h-[50px] w-[50px] items-center justify-center rounded-3xl bg-white/85">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3" /></svg>
            </span>
          </div>
        </a>
        <a href={`https://www.youtube.com/watch?v=${video.youtube_id}`} target="_blank" rel="noreferrer">
          <h3 className="line-clamp-3 h-[72px] pt-2 text-left text-[15px] font-semibold leading-snug text-ink hover:text-primary">{video.title}</h3>
        </a>
        <div className="mt-1 flex items-center justify-between text-xs text-gray-main">
          <span className="flex items-center gap-1"><IconEye className="h-3.5 w-3.5" /> {formatViews(video.views)} Views</span>
          <span className="flex items-center gap-2">
            <span className="flex items-center gap-1"><IconShare className="h-3.5 w-3.5" /> Share</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// News card - horizontal numbered list row (used in list view)
export function NewsRow({ article, index }) {
  return (
    <Link to={`/news/${article.slug}`} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-green-lighter/60">
      <span className="news-badge mt-0.5">{index}</span>
      <span className="text-sm text-gray-main flex-1">
        <span className="block mb-1">{article.date}</span>
        <span className="block text-base font-bold text-ink hover:text-primary line-clamp-2">{article.title}</span>
      </span>
      <img src={article.image} alt={article.title} loading="lazy" className="w-[40%] max-w-[140px] aspect-video rounded-xl object-cover shadow-card" />
    </Link>
  );
}

// Featured news card (left column)
export function FeaturedNews({ article, index }) {
  return (
    <Link to={`/news/${article.slug}`} className="block group">
      <img src={article.image} alt={article.title} loading="lazy" className="aspect-video w-full rounded-xl object-cover shadow-card" />
      <div className="mt-3 flex items-center gap-2">
        <span className="news-badge">{index}</span>
        <span className="text-sm text-gray-main">{article.date}</span>
      </div>
      <h3 className="mt-1 text-lg md:text-2xl font-bold text-ink group-hover:text-primary leading-snug">{article.title}</h3>
      <p className="mt-1.5 text-gray-main text-base line-clamp-2">{article.excerpt}</p>
      <span className="mt-2 inline-block text-base font-bold text-primary">Read More &gt;</span>
    </Link>
  );
}

// Implement tile (used in Implement Types grid)
export function ImplementTile({ name, count }) {
  return (
    <Link to={`/implements?category=${encodeURIComponent(name)}`} className="tile min-h-[124px] px-2 py-3">
      <span className="flex h-[64px] w-[72px] items-center justify-center rounded-xl bg-green-mint/60 text-primary">
        <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" /><path d="M13 17a4 4 0 0 1 8 0" /><circle cx="7" cy="17" r="1.5" /><circle cx="17" cy="17" r="1.5" />
          <path d="M5 13h6l-1-3H6z" /><path d="M11 13l1-4 7 1 1 3" />
        </svg>
      </span>
      <span className="mt-1 min-h-[24px] text-center text-sm font-medium text-ink line-clamp-2">{name}</span>
      {count !== undefined && <span className="text-xs text-gray-main">{count} Items</span>}
    </Link>
  );
}

// Simple horizontal card used in "Latest" grid & inner pages
export function ImgTextCard({ title, subtitle, img, to, price }) {
  return (
    <Link to={to} className="card-block">
      <div className="rounded-2xl border border-gray-light bg-white overflow-hidden transition-all duration-300 hover:border-secondary hover:bg-green-lighter hover:scale-[1.01] shadow-bottom">
        <img src={img} alt={title} loading="lazy" className="h-40 w-full object-cover" />
        <div className="p-3">
          <h3 className="text-sm font-bold text-ink line-clamp-2 leading-snug">{title}</h3>
          {subtitle && <p className="text-xs text-gray-main mt-1">{subtitle}</p>}
          {price && <p className="text-primary font-bold text-sm mt-1">{formatPrice(price)}</p>}
        </div>
      </div>
    </Link>
  );
}
