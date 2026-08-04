export const HP_RANGES = [
  { label: 'Below 20 HP', min: 0, max: 20 },
  { label: '21 to 25 HP', min: 21, max: 25 },
  { label: '26 to 30 HP', min: 26, max: 30 },
  { label: '31 to 35 HP', min: 31, max: 35 },
  { label: '36 to 40 HP', min: 36, max: 40 },
  { label: '41 to 45 HP', min: 41, max: 45 },
  { label: '46 to 50 HP', min: 46, max: 50 },
  { label: '51 to 55 HP', min: 51, max: 55 },
  { label: '56 to 60 HP', min: 56, max: 60 },
  { label: '61 to 65 HP', min: 61, max: 65 },
  { label: 'Above 65 HP', min: 66, max: 999 }
];

export const BUDGET_RANGES = [
  { label: 'Under 3 Lakh', min: 0, max: 299999 },
  { label: '3 to 5 Lakh', min: 300000, max: 499999 },
  { label: '5 to 7 Lakh', min: 500000, max: 699999 },
  { label: '7 to 9 Lakh', min: 700000, max: 899999 },
  { label: '9 to 11 Lakh', min: 900000, max: 1099999 },
  { label: 'Above 11 Lakh', min: 1100000, max: 99999999 }
];

export const FUELS = ['Diesel', 'CNG', 'Electric', 'Petrol'];

export const DRIVES = ['2WD', '4WD'];

export const IMPLEMENT_CATEGORIES = [
  'Plough',
  'Cultivator',
  'Rotavator',
  'Harvester',
  'Harrow',
  'Sprayer',
  'Baler',
  'Super Seeder',
  'Backhoe Loader',
  'Power Tiller',
  'Trolley',
  'Trailer',
  'Seed Drill',
  'Leveler'
];

export const DRAWER_MENU = [
  {
    heading: 'Tractor Brands',
    items: [
      { label: 'Massey Ferguson', to: '/brand/massey-ferguson' },
      { label: 'Farmtrac', to: '/brand/farmtrac' },
      { label: 'Solis', to: '/brand/solis' },
      { label: 'Eicher', to: '/brand/eicher' },
      { label: 'Sonalika', to: '/brand/sonalika' },
      { label: 'John Deere', to: '/brand/john-deere' },
      { label: 'Swaraj', to: '/brand/swaraj' },
      { label: 'Mahindra', to: '/brand/mahindra' },
      { label: 'Powertrac', to: '/brand/powertrac' },
      { label: 'Kubota', to: '/brand/kubota' },
      { label: 'New Holland', to: '/brand/new-holland' },
      { label: 'VST', to: '/brand/vst' },
      { label: 'View All Brands', to: '/brands' }
    ]
  },
  {
    heading: 'New Tractors',
    items: [
      { label: 'All Latest Tractor', to: '/tractors?latest=1' },
      { label: 'Tractor On Road Price', to: '/tractors' },
      { label: 'Popular Tractor', to: '/tractors?popular=1' },
      { label: 'Mini Tractor', to: '/tractors?mini=1' },
      { label: 'Compare Tractor', to: '/compare' },
      { label: 'Locate Tractor Dealer', to: '/dealers' }
    ]
  },
  {
    heading: 'Tractor by Fuel',
    items: FUELS.map((f) => ({ label: `${f} Tractor`, to: `/tractors?fuel=${f}` }))
  },
  {
    heading: 'Used Tractor / Implement',
    items: [
      { label: 'Buy Used Tractor', to: '/used' },
      { label: 'Sell Used Tractor', to: '/sell' },
      { label: 'Sell Used Implement', to: '/sell?type=implement' }
    ]
  },
  {
    heading: 'Implements',
    items: [
      { label: 'Implement Home', to: '/implements' },
      { label: 'Implement Category', to: '/implements' },
      { label: 'Locate Implement Dealer', to: '/dealers' },
      ...IMPLEMENT_CATEGORIES.slice(0, 5).map((c) => ({ label: c, to: `/implements?category=${encodeURIComponent(c)}` }))
    ]
  },
  {
    heading: 'Blogs & Videos',
    items: [
      { label: 'All Blogs', to: '/news' },
      { label: 'Videos', to: '/videos' },
      { label: 'Reels & Shorts', to: '/videos' }
    ]
  }
];
