import { Link } from 'react-router-dom';
import { IconScale, IconChevronRight, IconArrowRight } from './Icons.jsx';
import { useCompareStore } from '../store/compareStore.js';
import { formatPrice } from '../lib/api.js';

export function Spinner({ className = 'h-8 w-8' }) {
  return (
    <div className="flex justify-center py-16">
      <div className={`${className} border-4 border-kheti-100 border-t-kheti-900 rounded-full animate-spin`} />
    </div>
  );
}

export function SectionHeader({ title, to, linkLabel = 'View All' }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="section-title text-base md:text-lg">{title}</h2>
      {to && (
        <Link to={to} className="flex items-center gap-0.5 text-xs font-bold text-kheti-900 whitespace-nowrap">
          {linkLabel} <IconArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

export function TractorCard({ tractor, compact = false, fluid = false }) {
  const { tractors, toggle } = useCompareStore();
  const inBasket = tractors.some((t) => t.id === tractor.id);
  const full = tractors.length >= 3;

  return (
    <div className={`card flex flex-col ${fluid ? 'w-full' : 'w-52 md:w-64'}`}>
      <div className="relative">
        <Link to={`/tractor/${tractor.slug}`}>
          <img src={tractor.image} alt={tractor.name} loading="lazy" className="w-full h-28 md:h-32 object-cover" />
        </Link>
        <button
          onClick={() => toggle(tractor)}
          disabled={!inBasket && full}
          title={full && !inBasket ? 'Max 3 tractors can be compared' : 'Add to compare'}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition ${
            inBasket ? 'bg-accent-500 text-white' : 'bg-white/90 text-kheti-900 active:scale-95 disabled:opacity-50'
          }`}
        >
          <IconScale className="h-4 w-4" />
        </button>
        {!compact && <span className="absolute top-2 left-2 pill bg-white/90 text-kheti-900">{tractor.hp} HP</span>}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <Link to={`/tractor/${tractor.slug}`} className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 min-h-[36px]">
          {tractor.name}
        </Link>
        <div className="mt-1.5 text-xs text-gray-500">
          {tractor.cylinders} Cylinder - {tractor.fuel}
        </div>
        <div className="mt-1.5 text-[11px] text-gray-500">
          Lifting Capacity: <span className="font-semibold text-gray-700">{tractor.lift_capacity}</span>
        </div>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-kheti-900 font-extrabold text-sm">{formatPrice(tractor.price)}</span>
          <Link to={`/tractor/${tractor.slug}`} className="text-[11px] font-bold text-accent-500">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export function BrandCard({ brand }) {
  return (
    <Link to={`/brand/${brand.slug}`} className="card w-28 md:w-32">
      <div className="p-4 flex flex-col items-center gap-2">
        <span
          className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-black text-lg"
          style={{ backgroundColor: brand.color }}
        >
          {brand.name[0]}
        </span>
        <span className="text-xs font-semibold text-gray-800 text-center leading-tight">{brand.name}</span>
        <span className="text-[10px] text-gray-400">{brand.model_count} Models</span>
      </div>
    </Link>
  );
}

export function UsedCard({ listing, fluid = false }) {
  return (
    <Link to={`/used/${listing.id}`} className={`card flex flex-col ${fluid ? 'w-full' : 'w-60 md:w-64'}`}>
      <div className="relative">
        <img src={listing.image} alt={listing.title} loading="lazy" className="w-full h-28 object-cover" />
        <span className="absolute top-2 left-2 pill bg-white/90 text-kheti-900">{listing.status}</span>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <span className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">{listing.title}</span>
        <span className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <span className="text-kheti-900 font-bold">{listing.year}</span>
          <span>-</span>
          <span>{listing.location}, {listing.state}</span>
        </span>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-kheti-900 font-extrabold">{formatPrice(listing.price)}</span>
          <span className="flex items-center gap-0.5 text-[11px] font-bold text-accent-500">
            View Details <IconChevronRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function NewsCard({ article, horizontal = false }) {
  const Comp = horizontal ? 'div' : Link;
  const props = horizontal ? { className: 'card flex gap-3 p-3' } : { to: `/news/${article.slug}`, className: 'card flex flex-col' };
  return (
    <Comp {...props}>
      <div className={horizontal ? 'w-24 h-20 shrink-0' : ''}>
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className={horizontal ? 'w-24 h-20 object-cover rounded-lg' : 'w-full h-32 object-cover'}
        />
      </div>
      <div className={horizontal ? 'flex-1 min-w-0' : 'p-3 flex-1 flex flex-col'}>
        <span className="text-[10px] font-semibold text-gray-400 uppercase">{article.date}</span>
        <h3 className={`font-bold text-gray-900 leading-snug ${horizontal ? 'text-sm line-clamp-2' : 'text-sm mt-1 line-clamp-2'}`}>
          {article.title}
        </h3>
        {!horizontal && (
          <>
            <p className="mt-1.5 text-xs text-gray-500 line-clamp-2">{article.excerpt}</p>
            <span className="mt-auto pt-2 text-xs font-bold text-accent-500">Read More &gt;</span>
          </>
        )}
      </div>
    </Comp>
  );
}

export function VideoCard({ video }) {
  return (
    <div className="card w-60 md:w-72">
      <a href={`https://www.youtube.com/watch?v=${video.youtube_id}`} target="_blank" rel="noreferrer" className="block relative">
        <img src={video.thumbnail} alt={video.title} loading="lazy" className="w-full h-32 object-cover" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-12 w-12 rounded-full bg-black/50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3" /></svg>
          </span>
        </span>
        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
          {video.duration}
        </span>
      </a>
      <div className="p-3">
        <a href={`https://www.youtube.com/watch?v=${video.youtube_id}`} target="_blank" rel="noreferrer">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">{video.title}</h3>
        </a>
        <span className="mt-1 text-xs text-gray-500">
          {video.views.toLocaleString('en-IN')} Views - {video.type}
        </span>
      </div>
    </div>
  );
}

export function ImplementCard({ implement, fluid = false }) {
  return (
    <Link to={`/implements/${implement.slug}`} className={`card flex flex-col ${fluid ? 'w-full' : 'w-40 md:w-44'}`}>
      <img src={implement.image} alt={implement.name} loading="lazy" className="w-full h-24 object-cover" />
      <div className="p-2.5 flex flex-col flex-1">
        <span className="text-[10px] font-semibold text-accent-500 uppercase">{implement.category}</span>
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1 mt-0.5">{implement.name}</h3>
        <span className="mt-auto pt-1 text-kheti-900 font-extrabold text-sm">{formatPrice(implement.price)}</span>
      </div>
    </Link>
  );
}
