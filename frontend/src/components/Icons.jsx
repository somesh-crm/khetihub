const S = (props) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  ...props
});

export const IconMenu = (p) => <svg {...S(p)}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>;
export const IconSearch = (p) => <svg {...S(p)}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
export const IconX = (p) => <svg {...S(p)}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
export const IconChevronRight = (p) => <svg {...S(p)}><polyline points="9 18 15 12 9 6" /></svg>;
export const IconChevronDown = (p) => <svg {...S(p)}><polyline points="6 9 12 15 18 9" /></svg>;
export const IconPhone = (p) => <svg {...S(p)}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
export const IconMapPin = (p) => <svg {...S(p)}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
export const IconCalendar = (p) => <svg {...S(p)}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
export const IconStar = (p) => <svg {...S(p)}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
export const IconPlay = (p) => <svg {...S(p)}><polygon points="6 3 20 12 6 21 6 3" /></svg>;
export const IconEye = (p) => <svg {...S(p)}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
export const IconClock = (p) => <svg {...S(p)}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
export const IconScale = (p) => <svg {...S(p)}><path d="M12 3v18" /><path d="M8 21h8" /><path d="M4 7h16" /><path d="m6 4 6 6 6-6" /><path d="M4 7c0 2 2 3 2 3s2-1 2-3M16 7c0 2 2 3 2 3s2-1 2-3" /></svg>;
export const IconCalculator = (p) => <svg {...S(p)}><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="12" x2="8" y2="12" /><line x1="12" y1="12" x2="12" y2="12" /><line x1="16" y1="12" x2="16" y2="12" /><line x1="8" y1="17" x2="8" y2="17" /><line x1="12" y1="17" x2="12" y2="17" /><line x1="16" y1="17" x2="16" y2="17" /></svg>;
export const IconUser = (p) => <svg {...S(p)}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
export const IconMail = (p) => <svg {...S(p)}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
export const IconArrowRight = (p) => <svg {...S(p)}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
export const IconFilter = (p) => <svg {...S(p)}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
export const IconRupee = (p) => <svg {...S(p)}><path d="M6 3h12" /><path d="M6 8h12" /><path d="m6 13 8.5 8" /><path d="M6 13h3" /><path d="M9 13c6.667 0 6.667-10 0-10" /></svg>;
export const IconHome = (p) => <svg {...S(p)}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
export const IconTractor = (p) => <svg {...S(p)}><path d="M3 17a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" /><path d="M13 17a4 4 0 0 1 8 0" /><circle cx="7" cy="17" r="1.5" /><circle cx="17" cy="17" r="1.5" /><path d="M7 17h10" /><path d="M5 13h6l-1-3H6z" /><path d="M11 13l1-4 7 1 1 3" /><path d="M19 10V8h2l1 2" /></svg>;
export const IconShare = (p) => <svg {...S(p)}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>;
export const IconFuel = (p) => <svg {...S(p)}><path d="M3 22h12" /><path d="M4 22V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v17" /><path d="M14 9h2a2 2 0 0 1 2 2v6a2 2 0 0 0 4 0V9l-4-4" /><line x1="10" y1="13" x2="10" y2="17" /></svg>;
