export const HP_RANGES = [
  { label: 'Below 20 HP', min: 0, max: 20 },
  { label: '36 to 40 HP', min: 36, max: 40 },
  { label: '41 to 45 HP', min: 41, max: 45 },
  { label: '46 to 50 HP', min: 46, max: 50 },
  { label: '51 to 55 HP', min: 51, max: 55 },
  { label: '61 to 65 HP', min: 61, max: 65 },
  { label: '21 to 25 HP', min: 21, max: 25 },
  { label: '26 to 30 HP', min: 26, max: 30 },
  { label: '31 to 35 HP', min: 31, max: 35 },
  { label: '56 to 60 HP', min: 56, max: 60 },
  { label: 'Above 65 HP', min: 66, max: 999 }
];

export const BUDGET_RANGES = [
  { label: 'Under 3 Lakh', min: 0, max: 299999 },
  { label: '3 to 5 Lakh', min: 300000, max: 499999 },
  { label: '5 to 7 Lakh', min: 500000, max: 699999 },
  { label: '7 to 9 Lakh', min: 700000, max: 899999 },
  { label: '9 to 11 Lakh', min: 900000, max: 1099999 },
  { label: 'Above 11 Lakh', min: 1100000, max: 99999999 },
  { label: 'Under 5 Lakh', min: 0, max: 499999 },
  { label: '5 to 10 Lakh', min: 500000, max: 999999 },
  { label: 'Above 10 Lakh', min: 1000000, max: 99999999 }
];

export const FUELS = ['Diesel', 'Petrol', 'CNG', 'Electric'];

export const DRIVES = ['2WD', '4WD'];

export const IMPLEMENT_CATEGORIES = [
  'Plough',
  'Cultivator',
  'Power Tiller',
  'Rotavator',
  'Combine Harvester',
  'Harrow',
  'Sprayer',
  'Baler',
  'Super Seeder',
  'Backhoe Loader'
];

// Nav groups mirroring tractorgyan.com menu structure
export const NAV_GROUPS = [
  {
    heading: 'Tractor Brands',
    to: '/brands',
    items: [
      { label: 'Massey Ferguson', to: '/brand/massey-ferguson' },
      { label: 'Farmtrac', to: '/brand/farmtrac' },
      { label: 'Solis', to: '/brand/solis' },
      { label: 'Eicher', to: '/brand/eicher' },
      { label: 'Sonalika', to: '/brand/sonalika' },
      { label: 'John Deere', to: '/brand/john-deere' },
      { label: 'Swaraj', to: '/brand/swaraj' },
      { label: 'Powertrac', to: '/brand/powertrac' },
      { label: 'VST', to: '/brand/vst' },
      { label: 'Kubota', to: '/brand/kubota' },
      { label: 'New Holland', to: '/brand/new-holland' },
      { label: 'Mahindra', to: '/brand/mahindra' }
    ]
  },
  {
    heading: 'New Tractors',
    to: '/tractors',
    items: [
      { label: 'All Tractor', to: '/tractors' },
      { label: 'Latest Tractor', to: '/tractors?latest=1' },
      { label: 'Tractor On Road Price', to: '/tractors' },
      { label: 'Tractor By Fuel', to: '/tractors' },
      { label: 'Diesel Tractor', to: '/tractors?fuel=Diesel' },
      { label: 'Petrol Tractor', to: '/tractors?fuel=Petrol' },
      { label: 'CNG Tractor', to: '/tractors?fuel=CNG' },
      { label: 'Electric Tractor', to: '/tractors?fuel=Electric' }
    ]
  },
  {
    heading: 'Used Tractor / Implement',
    to: '/used',
    items: [
      { label: 'Buy Used Tractor', to: '/used' },
      { label: 'Buy Used Mini Tractor', to: '/used' },
      { label: 'Buy Used Implement', to: '/used' },
      { label: 'Sell Used Implement', to: '/sell?type=implement' }
    ]
  },
  {
    heading: 'Implements',
    to: '/implements',
    items: IMPLEMENT_CATEGORIES.map((c) => ({ label: c, to: `/implements?category=${encodeURIComponent(c)}` }))
  },
  {
    heading: 'Blogs & Videos',
    to: '/news',
    items: [
      { label: 'All Blogs', to: '/news' },
      { label: 'Videos', to: '/videos' },
      { label: 'Reels & Shorts', to: '/videos' }
    ]
  }
];

export const FOOTER_COLUMNS = [
  {
    heading: 'Popular Searches',
    links: [
      { label: 'MRF Tractor Tyres', to: '/implements' },
      { label: 'Rotavators', to: '/implements?category=Rotavator' },
      { label: '4WD Tractor', to: '/tractors?drive=4WD' },
      { label: '2WD Tractor', to: '/tractors?drive=2WD' },
      { label: 'CNG Tractor', to: '/tractors?fuel=CNG' },
      { label: 'Electric Tractor', to: '/tractors?fuel=Electric' },
      { label: 'All Tractor Series', to: '/tractors' }
    ]
  },
  {
    heading: 'Top Tractor In India',
    links: [
      { label: 'Swaraj 855 FE', to: '/tractor/swaraj-855-fe' },
      { label: 'New Holland 3630', to: '/tractor/new-holland-3630-tx-special-edition' },
      { label: 'John Deere 5310', to: '/tractor/john-deere-5310-powertech-2wd' },
      { label: 'Mahindra 575', to: '/tractor/mahindra-575-di-xp-plus' },
      { label: 'Massey Ferguson 241', to: '/tractor/massey-ferguson-241-di' },
      { label: 'Sonalika 745 III', to: '/tractor/sonalika-di-745-iii-sikander' }
    ]
  },
  {
    heading: 'Important Links',
    links: [
      { label: 'Write Review', to: '/tractors' },
      { label: 'Tractor Dealership Enquiry', to: '/dealers' },
      { label: 'EMI Calculator', to: '/emi' },
      { label: 'Compare Tractors', to: '/compare' },
      { label: 'Admin / CRM', to: '/admin' }
    ]
  },
  {
    heading: 'About KhetiHub',
    links: [
      { label: 'About KhetiHub', to: '/' },
      { label: 'Tractor News', to: '/news' },
      { label: 'Tractor Videos', to: '/videos' },
      { label: 'Sell Your Tractor', to: '/sell' }
    ]
  }
];
