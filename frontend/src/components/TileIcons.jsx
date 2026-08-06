const stroke = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

export const FuelDiesel = (p) => (
  <svg {...stroke} {...p}>
    <path d="M12 3s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z" />
    <path d="M9.5 14a2.5 2.5 0 0 0 5 0" />
  </svg>
);
export const FuelPetrol = (p) => (
  <svg {...stroke} {...p}>
    <path d="M3 22h12" /><path d="M4 22V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v17" />
    <path d="M14 10h2a2 2 0 0 1 2 2v5a2 2 0 0 0 4 0V9l-4-4" /><line x1="10" y1="13" x2="10" y2="17" />
  </svg>
);
export const FuelCNG = (p) => (
  <svg {...stroke} {...p}>
    <rect x="6" y="2" width="12" height="20" rx="3" /><line x1="10" y1="6" x2="14" y2="6" />
    <line x1="10" y1="10" x2="14" y2="10" /><line x1="10" y1="14" x2="14" y2="14" />
  </svg>
);
export const FuelElectric = (p) => (
  <svg {...stroke} {...p}>
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

export const OfferNewTractor = (p) => (
  <svg {...stroke} {...p}>
    <path d="M3 17a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" /><path d="M13 17a4 4 0 0 1 8 0" />
    <path d="M5 13h6l-1-3H6z" /><path d="M11 13l1-4 7 1 1 3" /><path d="M3 21h13" />
  </svg>
);
export const OfferCompare = (p) => (
  <svg {...stroke} {...p}>
    <path d="M12 3v18" /><path d="M8 21h8" /><path d="M4 7h16" />
    <path d="m6 4 6 6 6-6" /><path d="M4 7c0 2 2 3 2 3s2-1 2-3" />
  </svg>
);
export const OfferPrice = (p) => (
  <svg {...stroke} {...p}>
    <path d="M6 3h12" /><path d="M6 8h12" /><path d="m6 13 8.5 8" /><path d="M6 13h3" /><path d="M9 13c6.667 0 6.667-10 0-10" />
  </svg>
);
export const OfferBuyUsed = (p) => (
  <svg {...stroke} {...p}>
    <circle cx="9" cy="20" r="2" /><circle cx="18" cy="20" r="2" />
    <path d="M2 3h3l2.5 13h11l2-9H6" />
  </svg>
);
export const OfferSellUsed = (p) => (
  <svg {...stroke} {...p}>
    <path d="M21 4h-7l-2 4H3v11h8l2-4h8z" /><path d="M11 8v11" />
  </svg>
);
export const OfferMini = (p) => (
  <svg {...stroke} {...p}>
    <path d="M3 15a3 3 0 1 0 6 0 3 3 0 0 0-6 0z" /><path d="M11 15a3 3 0 0 1 6 0" />
    <path d="M4 13h6l-1-2H5z" /><path d="M10 13l1-3 5 1 1 2" />
  </svg>
);
export const OfferLoan = (p) => (
  <svg {...stroke} {...p}>
    <rect x="2" y="6" width="20" height="14" rx="2" /><circle cx="8" cy="13" r="2" />
    <path d="M14 13h4" /><path d="M14 17h4" /><path d="M2 10h20" />
  </svg>
);
export const OfferSubsidy = (p) => (
  <svg {...stroke} {...p}>
    <path d="M12 2 3 7v6c0 5 3.8 8.4 9 9 5.2-.6 9-4 9-9V7l-9-5z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
export const OfferReview = (p) => (
  <svg {...stroke} {...p}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
export const OfferDealer = (p) => (
  <svg {...stroke} {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
export const OfferEMI = (p) => (
  <svg {...stroke} {...p}>
    <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="12" x2="8" y2="12" /><line x1="12" y1="12" x2="12" y2="12" /><line x1="16" y1="12" x2="16" y2="12" />
    <line x1="8" y1="17" x2="8" y2="17" /><line x1="12" y1="17" x2="12" y2="17" /><line x1="16" y1="17" x2="16" y2="17" />
  </svg>
);
export const OfferNews = (p) => (
  <svg {...stroke} {...p}>
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V9" />
    <line x1="11" y1="7" x2="19" y2="7" /><line x1="11" y1="12" x2="19" y2="12" /><line x1="11" y1="17" x2="16" y2="17" />
  </svg>
);
export const OfferVideos = (p) => (
  <svg {...stroke} {...p}>
    <rect x="2" y="5" width="20" height="14" rx="3" /><polygon points="10 9 15 12 10 15 10 9" />
  </svg>
);
export const OfferTyre = (p) => (
  <svg {...stroke} {...p}>
    <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2" />
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
  </svg>
);
export const OfferImplement = (p) => (
  <svg {...stroke} {...p}>
    <path d="M21 4h-7l-2 4H3v11h8l2-4h8z" />
  </svg>
);
export const OfferAgriNews = (p) => (
  <svg {...stroke} {...p}>
    <path d="M12 22V8" /><path d="M12 8c-4 0-6-2-6-5 4 0 6 2 6 5z" />
    <path d="M12 8c4 0 6-2 6-5-4 0-6 2-6 5z" /><path d="M4 22h16" />
  </svg>
);

export const OFFERING_ICONS = {
  'New Tractor': OfferNewTractor,
  'Compare Tractor': OfferCompare,
  'Tractor Price': OfferPrice,
  'Buy Second Hand Tractor': OfferBuyUsed,
  'Sell Second Hand Tractor': OfferSellUsed,
  'Mini Tractor': OfferMini,
  'Tractor Loan': OfferLoan,
  'Tractor Subsidy': OfferSubsidy,
  'Tractor Review': OfferReview,
  'Tractor Dealer': OfferDealer,
  'EMI Calculator': OfferEMI,
  'Tractor News': OfferNews,
  'Tractor Videos': OfferVideos,
  'Tractor Tyre': OfferTyre,
  'Tractor Implement': OfferImplement,
  'Agriculture News': OfferAgriNews
};

export const OFFERINGS = [
  { label: 'New Tractor', to: '/tractors' },
  { label: 'Compare Tractor', to: '/compare' },
  { label: 'Tractor Price', to: '/tractors' },
  { label: 'Buy Second Hand Tractor', to: '/used' },
  { label: 'Sell Second Hand Tractor', to: '/sell' },
  { label: 'Mini Tractor', to: '/tractors?mini=1' },
  { label: 'Tractor Loan', to: '/emi' },
  { label: 'Tractor Subsidy', to: '/news' },
  { label: 'Tractor Review', to: '/tractors' },
  { label: 'Tractor Dealer', to: '/dealers' },
  { label: 'EMI Calculator', to: '/emi' },
  { label: 'Tractor News', to: '/news' },
  { label: 'Tractor Videos', to: '/videos' },
  { label: 'Tractor Tyre', to: '/implements' },
  { label: 'Tractor Implement', to: '/implements' },
  { label: 'Agriculture News', to: '/news' }
];
