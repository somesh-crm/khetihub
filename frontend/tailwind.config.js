/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // TractorGyan palette (verified from https://tractorgyan.com/)
        primary: '#008000',          // main green - buttons, active accents
        secondary: '#00522E',        // dark green - hover, section-title underline
        header: '#002A17',           // very dark green - top header bar
        'green-main': '#29852B',     // nav hover underline, spec-bar dividers
        'green-light': '#46AA4824',  // hover bg (14% alpha)
        'green-lighter': '#F4FBF4',  // hover bg, community section
        'green-lightest': '#46AA48', // bright green
        'green-mint': '#C0EBC0',     // spec bars under tractor images
        'green-sold': '#015401',     // ribbon dark green
        'orange-main': '#FF7A18',    // mobile active tab
        'orange-dark': '#E56700',
        'section-gray': '#F5F5F5',   // alternating section bg
        'gray-main': '#666666',      // secondary text
        'gray-dark': '#595959',      // labels
        'gray-grey': '#797979',      // footer links
        'gray-secondary': '#AFAFAF', // slider ticks
        'gray-light': '#D3DAE0',     // card borders
        'gray-gainsboro': '#D9D9D9', // avatar ring
        'gray-silver': '#C4C4C4',    // search pill border
        ink: '#182C3D',              // original text-black (dark navy)
        link: '#4CAF50'              // used-card location green
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif']
      },
      boxShadow: {
        card: '0px 1px 3px 0px #63636340',
        nav: '0px 4px 37px 0px #0F461054',
        main: '0px 4px 37px 0px #0F46102B',
        bottom: '0px 4px 4px 0px #00000045',
        brand: '1px 5px 16px 0px rgba(88,98,89,0.21)',
        sell: '0px 4px 12px 0px #091F4345'
      },
      backgroundImage: {
        'green-gradient': 'linear-gradient(270deg, #015401, #46aa48 50%, #015401)',
        'green-dark-gradient': 'linear-gradient(93.97deg, #015401, #46AA48 46.01%, #015401 99.35%)',
        'orange-gradient': 'linear-gradient(90deg, #ff7a18, #ff521b)'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: []
};
