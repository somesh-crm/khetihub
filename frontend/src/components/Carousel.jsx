import { useRef } from 'react';
import { IconChevronDown } from './Icons.jsx';

export default function Carousel({ children, className = '' }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.75), behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div ref={ref} className={`hide-scrollbar flex gap-3 overflow-x-auto scroll-smooth pb-2 ${className}`}>
        {children}
      </div>
      <div className="mt-2 flex items-center justify-center gap-2 md:mt-4">
        <button onClick={() => scroll(-1)} aria-label="Previous" className="slick-arrow-btn rotate-90">
          <IconChevronDown className="h-4 w-4" />
        </button>
        <button onClick={() => scroll(1)} aria-label="Next" className="slick-arrow-btn -rotate-90">
          <IconChevronDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
