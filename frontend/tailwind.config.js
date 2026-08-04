/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        kheti: {
          50: '#eefaf0',
          100: '#d6f2d9',
          200: '#aee5b5',
          300: '#7dd089',
          400: '#4db85f',
          500: '#2f9e43',
          600: '#218234',
          700: '#1a692b',
          800: '#155324',
          900: '#0f6b00',
          DEFAULT: '#0f6b00'
        },
        accent: {
          DEFAULT: '#f97316',
          50: '#fff7ed',
          100: '#ffedd5',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '4xl': '2rem'
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
        float: '0 6px 20px rgba(0,0,0,0.12)'
      }
    }
  },
  plugins: []
};
