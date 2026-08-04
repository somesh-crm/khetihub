// Generates SVG placeholder images for tractors, implements, news, videos and used listings.
// Keeps the whole app self-contained with no external image dependencies.

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function shade(hex, amt) {
  const h = hex.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(h.slice(0, 2), 16) + amt));
  const g = Math.max(0, Math.min(255, parseInt(h.slice(2, 4), 16) + amt));
  const b = Math.max(0, Math.min(255, parseInt(h.slice(4, 6), 16) + amt));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function tractorArt(color) {
  return `
    <g transform="translate(100,150) scale(2.6)">
      <rect x="0" y="30" width="60" height="34" rx="6" fill="${color}" stroke="#ffffff" stroke-width="2.5"/>
      <path d="M58 34 L78 40 L86 52 L72 56 L72 62 L30 62 Z" fill="${color}" stroke="#ffffff" stroke-width="2.5"/>
      <rect x="-4" y="58" width="88" height="12" rx="4" fill="#1b1b1b"/>
      <circle cx="6" cy="72" r="12" fill="#1b1b1b" stroke="#ffffff" stroke-width="2.5"/>
      <circle cx="76" cy="72" r="12" fill="#1b1b1b" stroke="#ffffff" stroke-width="2.5"/>
      <circle cx="6" cy="72" r="5" fill="#6b6b6b"/>
      <circle cx="76" cy="72" r="5" fill="#6b6b6b"/>
      <rect x="10" y="6" width="26" height="12" rx="3" fill="#2d2d2d"/>
      <rect x="12" y="8" width="8" height="8" rx="2" fill="#cfd8dc"/>
      <rect x="24" y="8" width="8" height="8" rx="2" fill="#cfd8dc"/>
      <rect x="22" y="28" width="16" height="8" rx="2" fill="#2d2d2d"/>
    </g>`;
}

function implementArt(category) {
  const shapes = {
    Plough: '<path d="M20 120 L120 90 L120 160 L20 130 Z" fill="#7f8c8d"/><circle cx="120" cy="125" r="28" fill="#95a5a6" stroke="#ecf0f1" stroke-width="3"/>',
    Cultivator: '<rect x="20" y="70" width="160" height="24" rx="10" fill="#7f8c8d"/><rect x="50" y="94" width="8" height="70" fill="#95a5a6"/><rect x="100" y="94" width="8" height="70" fill="#95a5a6"/><rect x="150" y="94" width="8" height="70" fill="#95a5a6"/>',
    Rotavator: '<circle cx="100" cy="130" r="55" fill="none" stroke="#7f8c8d" stroke-width="18"/><rect x="40" y="20" width="120" height="22" rx="8" fill="#5d6d7e"/>',
    Harvester: '<rect x="30" y="90" width="140" height="60" rx="10" fill="#f1c40f"/><path d="M30 90 L20 40 L60 60 Z" fill="#e67e22"/><circle cx="50" cy="160" r="24" fill="#1b1b1b"/><circle cx="150" cy="160" r="24" fill="#1b1b1b"/>',
    Harrow: '<rect x="30" y="60" width="140" height="26" rx="12" fill="#7f8c8d"/><circle cx="45" cy="60" r="14" fill="#bdc3c7"/><circle cx="80" cy="60" r="14" fill="#bdc3c7"/><circle cx="115" cy="60" r="14" fill="#bdc3c7"/><circle cx="150" cy="60" r="14" fill="#bdc3c7"/>',
    Sprayer: '<rect x="60" y="50" width="80" height="70" rx="10" fill="#27ae60"/><rect x="20" y="30" width="160" height="8" rx="4" fill="#1b5e20"/><circle cx="30" cy="30" r="10" fill="#7f8c8d"/><circle cx="170" cy="30" r="10" fill="#7f8c8d"/>',
    Baler: '<rect x="35" y="90" width="130" height="55" rx="12" fill="#d35400"/><circle cx="60" cy="150" r="18" fill="#1b1b1b"/><circle cx="140" cy="150" r="18" fill="#1b1b1b"/><path d="M35 90 L20 60 L55 60 Z" fill="#a04000"/>',
    'Super Seeder': '<rect x="25" y="80" width="150" height="30" rx="10" fill="#2980b9"/><path d="M50 110 L50 170" stroke="#2c3e50" stroke-width="8"/><path d="M100 110 L100 170" stroke="#2c3e50" stroke-width="8"/><path d="M150 110 L150 170" stroke="#2c3e50" stroke-width="8"/><circle cx="50" cy="172" r="10" fill="#95a5a6"/><circle cx="100" cy="172" r="10" fill="#95a5a6"/><circle cx="150" cy="172" r="10" fill="#95a5a6"/>',
    'Backhoe Loader': '<path d="M80 140 L160 90 L160 150 Z" fill="#e67e22"/><rect x="70" y="120" width="80" height="30" rx="8" fill="#f39c12"/><circle cx="70" cy="160" r="22" fill="#1b1b1b"/><circle cx="150" cy="160" r="22" fill="#1b1b1b"/>',
    'Power Tiller': '<rect x="30" y="100" width="140" height="34" rx="8" fill="#c0392b"/><path d="M30 120 L20 60 L55 80 Z" fill="#95a5a6"/><circle cx="150" cy="150" r="26" fill="#1b1b1b"/>',
    Trolley: '<rect x="25" y="70" width="150" height="60" rx="8" fill="#16a085"/><circle cx="55" cy="140" r="22" fill="#1b1b1b"/><circle cx="145" cy="140" r="22" fill="#1b1b1b"/>',
    Trailer: '<rect x="25" y="70" width="150" height="55" rx="8" fill="#8e44ad"/><circle cx="55" cy="135" r="20" fill="#1b1b1b"/><circle cx="145" cy="135" r="20" fill="#1b1b1b"/>',
    'Seed Drill': '<rect x="20" y="70" width="160" height="26" rx="10" fill="#2c3e50"/><circle cx="45" cy="96" r="12" fill="#f39c12"/><circle cx="80" cy="96" r="12" fill="#f39c12"/><circle cx="115" cy="96" r="12" fill="#f39c12"/><circle cx="150" cy="96" r="12" fill="#f39c12"/>',
    Leveler: '<rect x="25" y="95" width="150" height="30" rx="8" fill="#5d6d7e"/><path d="M60 95 L80 30 L100 95" stroke="#34495e" stroke-width="8" fill="none"/>'
  };
  return shapes[category] || shapes.Cultivator;
}

export function tractorImage(name, color = '#0f6b00') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${shade(color, -40)}"/>
      <stop offset="100%" stop-color="${color}"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#bg)"/>
  <rect width="640" height="360" fill="rgba(0,0,0,0.15)"/>
  ${tractorArt(shade(color, 30))}
  <text x="320" y="330" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="#ffffff">${esc(name)}</text>
</svg>`;
}

export function implementImage(name, category, color = '#0f6b00') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#37474f"/>
      <stop offset="100%" stop-color="#263238"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#bg)"/>
  ${implementArt(category)}
  <text x="320" y="330" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#ffffff">${esc(name)}</text>
</svg>`;
}

export function newsImage(title, color = '#0f6b00') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${shade(color, -50)}"/>
      <stop offset="100%" stop-color="${color}"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#bg)"/>
  <rect width="640" height="360" fill="rgba(0,0,0,0.2)"/>
  <text x="40" y="120" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#ffffff">TRACTOR NEWS</text>
  <text x="40" y="300" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#ffffff">${esc(title)}</text>
</svg>`;
}

export function videoImage(title, color = '#c0392b') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1c2833"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#bg)"/>
  <rect width="640" height="360" fill="rgba(0,0,0,0.3)"/>
  <circle cx="320" cy="170" r="58" fill="rgba(255,255,255,0.15)"/>
  <circle cx="320" cy="170" r="48" fill="rgba(255,255,255,0.25)"/>
  <polygon points="308,148 308,192 344,170" fill="#ffffff"/>
  <text x="40" y="320" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="#ffffff">${esc(title)}</text>
</svg>`;
}

export function usedImage(name, color = '#0f6b00') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#5d4037"/>
      <stop offset="100%" stop-color="#3e2723"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#bg)"/>
  <rect width="640" height="360" fill="rgba(0,0,0,0.2)"/>
  ${tractorArt('#c58b4d')}
  <text x="40" y="40" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#ffd54f">SECOND HAND</text>
  <text x="320" y="330" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="#ffffff">${esc(name)}</text>
</svg>`;
}
